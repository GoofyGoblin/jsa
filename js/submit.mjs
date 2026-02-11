import { nvimOutputProcessor } from "./nvim_judge.mjs";
import { dwmOutputProcessor } from "./dwm_judge.mjs";
const token = process.env.GITHUB_API_KEY

const userOption = document.getElementById("select");
let userChoice = userOption.value;
let dotfilesScore;
let currentUserId;
let currentDotfilesId;
const description = document.getElementById("description").value;
const repo_url = document.getElementById("repo-url").value;

async function getCurrentUserId() {
	let max = 0;
	const res = await fetch('http://localhost:3000/accounts');
	res.json()
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].user_id > max) {
					max = data[i].user_id;
				}
			}
		})
	currentUserId = max + 1;
}
getCurrentUserId();

async function getDotfilesId() {
	let max = 0;
	const res = await fetch('http://localhost:3030/dotfiles');
	res.json()
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].id > max) {
					max = data[i].id;
				}
			}
		})
	currentDotfilesId = max + 1;
}

getDotfilesId();

function getUserChoice() {
	userOption.addEventListener("change", (e) => {
		userChoice = e.target.value;
	})
}

function getSubmitButton() {
	document.getElementById("submit-btn").addEventListener("click", (e) => {
		e.preventDefault();
		getGithubUrl();
		getUserChoice();
	})
}

getSubmitButton();

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
	createNewDotfileData();
}

function createNewDotfileData() {
	const newDotfileData = {
		"id": `${currentDotfilesId + 1}`,
		"user_id": `${currentUserId}`,
		"name": `${userChoice}`,
		"repo_url": `${repo_url}`,
		"description": `${description}`,
		"score": `${dotfilesScore} / 10`
	}
	pushDotfilesData(newDotfileData);
}

async function pushDotfilesData(obj) {
	console.log(obj);
	const res = fetch('http://localhost:3030/dotfiles', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(obj)
	})
	if (!res) return;
	if (!res.ok) {
		alert("Something went wrong");
	}
}

