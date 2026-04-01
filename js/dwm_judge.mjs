import { fetchGithubData } from "./submit.mjs";

/*
  Generally the same as nvim_judge but only reads the lines of code
 */

const repoUrl = document.getElementById("repo-url");

async function selectDwmUrlPath(json)
{
    const data = await json;
    return data.filter((e) => e.name == "dwm");
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

async function fetchDwmConfigRepo(user, repo, path)
{
    let initialUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

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
    for (let i = 0; i < filesArray.length; i++)
    {
        loc += filesArray[i].split("\n").length;
    }
    return loc;
}

function calcScore(loc)
{
    let score = 100;
    if (loc >= 2000)
    {
        score = score * 0.5;
    }
    if (loc >= 5000)
    {
        score = score * 0.1;
    }
    if (loc >= 6000)
    {
        score = 0;
    }
    return Math.round(score);
}

export async function dwmOutputProcessor(json)
{
    const dwmData = await selectDwmUrlPath(json);

    const
    { user, repo, path } = parseRepoObj(dwmData);

    const urls = await fetchDwmConfigRepo(user, repo, path);

    const filesArray = await fetchFilesContents(urls);

    const loc = lineCounter(filesArray);

    const score = calcScore(loc);

    return score;
}
