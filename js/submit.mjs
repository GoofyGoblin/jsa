import { nvimOutputProcessor } from "./nvim_judge.mjs";
import { dwmOutputProcessor } from "./dwm_judge.mjs";
const token = "token"
const userOption = document.getElementById("select");
let userChoice = userOption.value;
let dotfilesScore;
let max = 0;
const description = document.getElementById("description").value;
const repo_url = document.getElementById("repo-url").value;

function getCurrentUserId() {
    let currentUserId;
    const user = JSON.parse(localStorage.getItem('user'));
    currentUserId = user.user_id;
    return currentUserId;
}

async function getDotfilesId() {
    const res = await fetch('http://localhost:3030/dotfiles');
    const data = JSON.parse(await res.text());
    return data.length;
}

function getUserChoice() {
    userOption.addEventListener("change", (e) => {
        userChoice = e.target.value;
    })
}

function getSubmitButton() {
    document.getElementById("submit-btn").addEventListener("click", (e) => {
        e.preventDefault();
        const checkLoggedIn = checkIfLoggedIn();
        if (!checkLoggedIn) {
            alert("Please create an account before submitting")
            return;
        }
        getGithubUrl();
        getUserChoice();
    })
}
getSubmitButton();

function checkIfLoggedIn() {
    const user = localStorage.getItem('user');
    if (user) {
        return true;
    }
    return false;
}


function getGithubUrl() {
    if (document.getElementById("repo-url").value === "") {
        alert("Please enter a repo URL");
    }
    console.log(document.getElementById("repo-url").value);
    parseGithubUrl(document.getElementById("repo-url").value);
}

function parseGithubUrl(url) {
    const repoUrl = new URL(url);
    const [user, repo] = repoUrl.pathname.split("/").filter(Boolean);
    fetchRepoContents(user, repo);
}

export async function fetchGithubData(url) {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Accept': 'application/vnd.github+json'
            }
        });
        return res;
    } catch (e) {
        console.log(e);
    }
}

async function fetchRepoContents(user, repo) {
    const res = await fetchGithubData(`https://api.github.com/repos/${user}/${repo}/contents/`);
    if (!res.ok) {
        throw new Error("Repo not found")
    }
    if (userChoice === "nvim") {
        dotfilesScore = await nvimOutputProcessor(res.json());
    } else if (userChoice === "dwm") {
        dotfilesScore = await dwmOutputProcessor(res.json());
    }
    createNewDotfileData(dotfilesScore);
}

async function createNewDotfileData(score) {
    const currentUserId = await getCurrentUserId();
    const currentDotfilesId = await getDotfilesId();
    const newDotfileData = {
        "id": `${currentDotfilesId + 1}`,
        "user_id": `${currentUserId}`,
        "name": `${userChoice}`,
        "repo_url": `${repo_url}`,
        "description": `${description}`,
        "score": `${score}`,
    }
    checkForRepeatSubmission(newDotfileData);
}

async function checkForRepeatSubmission(repo_data) {
    let check = true;
    const res = await fetch('http://localhost:3030/dotfiles');
    const data = JSON.parse(await res.text());
    console.log(data);
    data.forEach((e) => {
        if (e.repo_url === repo_data.repo_url) {
            check = false;
        }
    })
    if (check == false) {
        alert("You have already submitted this repo");
    } else {
        pushDotfilesData(repo_data);
    }
}

async function pushDotfilesData(obj) {
    await fetch('http://localhost:3030/dotfiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log("Success: ", data);
        })
        .catch(error => {
            console.log("Error: ", error);
        })
}
