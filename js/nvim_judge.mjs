import { fetchGithubData } from "./submit.mjs";

async function selectNvimPath(json) {
	const data = await json;
	return data.find((element) => element.name === "nvim");
}

function parseRepoObj(repoObj) {
	const url = new URL(repoObj.html_url);
	const [user, repo] = url.pathname.split("/").filter(Boolean);
	return { user, repo, path: repoObj.path };
}

async function fetchNvimConfigRepo(user, repo, path) {
	const initialUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
	const allUrls = await getAllFileUrls(initialUrl);
	return allUrls;
}

async function getAllFileUrls(url) {
	const res = await fetchGithubData(url);
	if (!res.ok) return [];
	const data = await res.json();

	let urls = [];

	const files = data.filter(item => item.download_url != null);
	urls.push(...files.map(f => f.url));

	const dirs = data.filter(item => item.download_url == null);
	const dirPromises = dirs.map(dir => getAllFileUrls(dir.url));
	const nestedUrls = await Promise.all(dirPromises);

	nestedUrls.forEach(nested => urls.push(...nested));

	return urls;
}

async function fetchFilesContents(urls) {
	const fileContents = [];
	for (const url of urls) {
		const res = await fetchGithubData(url);
		const data = await res.json();
		fileContents.push(atob(data.content));
	}
	return fileContents;
}

function lineCounter(filesArray) {
	let loc = 0;
	for (const fileContent of filesArray) {
		loc += fileContent.split("\n").length;
	}
	return loc;
}

function pluginsCounter(filesArray) {
	const foundPlugins = new Set();
	const combinedContent = filesArray.join("")
		.replace(/--.*$/gm, "")
		.replace(/\/\/.*$/gm, "")
		.replace(/#.*$/gm, "");

	const regex = /["'`]?\b([\w.-]+\/[\w.-]+)\b["'`]?/g;

	let match;
	while ((match = regex.exec(combinedContent)) !== null) {
		foundPlugins.add(match[1]);
	}
	return foundPlugins.size;
}

function calcScore(loc, plugins) {
	let score = 100;
	score -= plugins * 2;
	score -= loc * 0.05;
	return score;
}

export async function nvimOutputProcessor(json) {
	const nvimData = await selectNvimPath(json);

	if (!nvimData) {
		return { score: 0 };
	}

	const { user, repo, path } = parseRepoObj(nvimData);

	const urls = await fetchNvimConfigRepo(user, repo, path);

	const filesArray = await fetchFilesContents(urls);

	const loc = lineCounter(filesArray);

	const plugins = pluginsCounter(filesArray);

	const score = calcScore(loc, plugins);

	return score;
}
