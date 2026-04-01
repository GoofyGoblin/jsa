import { fetchGithubData } from "./submit.mjs";

const repoUrl = document.getElementById("repo-url");


async function selectNvimPath(json)
{
    const data = await json;
    return data.filter((element) => element.name == "nvim");
}

function parseRepoObj(repoObj)
{
    const url = new URL(repoUrl.value);
    const [user, repo] = url.pathname.split("/").filter(Boolean);
    if (repoObj.length <= 0)
    {
        return { user, repo };
    }
    return { user, repo, path: repoObj[0].path };
}

async function fetchNvimConfigRepo(user, repo, path)
{
    let initialUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

    /* if the config files is not in another folder in the repo */
    if (!path)
    {
        initialUrl = `https://api.github.com/repos/${user}/${repo}/contents`
    }
    const allUrls = await getAllFileUrls(initialUrl);
    return allUrls;
}

async function getAllFileUrls(url)
{
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

async function fetchFilesContents(urls)
{
    const fileContents = [];
    for (const url of urls)
    {
        const res = await fetchGithubData(url);
        const data = await res.json();
        fileContents.push(atob(data.content));
    }
    return fileContents;
}

function lineCounter(filesArray)
{
    let loc = 0;
    for (const fileContent of filesArray)
    {
        loc += fileContent.split("\n").length;
    }
    return loc;
}

/*
  This function
  counts the plugin through regex
 */

function pluginsCounter(filesArray)
{
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
    if (score < 0) {
        score = 0;
    }
    return Math.round(score);
}

/*
  This function gets the return value of other functions to
  call more functions and then return the value of it to submit.mjs

  1. Selects the dotfile path
  2. Gets all the lua files from that path
  3. If there's no path then the initialUrl gets changed (see line 11)
  4. Counts the line and function and then pass it the calc function
 */

export async function nvimOutputProcessor(json)
{
    const nvimData = await selectNvimPath(json);
    const
    { user, repo, path } = parseRepoObj(nvimData);
    const urls = await fetchNvimConfigRepo(user, repo, path);
    const filesArray = await fetchFilesContents(urls);
    const loc = lineCounter(filesArray);
    const plugins = pluginsCounter(filesArray);
    const score = calcScore(loc, plugins);

    return score;
}
