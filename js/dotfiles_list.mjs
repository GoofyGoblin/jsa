// fetching the json api
const getSearchInput = document.getElementById("leaderboard-search");
const url = "http://localhost:3030/dotfiles";
async function getDotfilesData() {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new error(`response status ${response.status}`);
		}
		const result = await response.json();
		return result;
	} catch (error) {
		//console.log(error.message);
	}
}

async function getUserData() {
	const res = await fetch('http://localhost:3000/accounts');
	const data = JSON.parse(await res.text());
	return data;
}
getDotfilesData();

async function createEntries(result, inputValue) {
	let topEntry;
	let fullEntry;
	//console.log(inputValue);
	const data = await getDotfilesData();
	if (result.length === 0 || inputValue == "") {
		topEntry = data.splice(0, 5);
		fullEntry = data;
	} else {
		topEntry = result.splice(0, 5);
		fullEntry = result;
	}
	renderDotfiles(topEntry, fullEntry);
}
createEntries([]);


function getUsername(data, user_id) {
	const user = data.find((e) => e.user_id === user_id);
	return user.username;
}

async function renderDotfiles(topResults, fullResults) {
	let result;
	const userData = await getUserData();
	const url = window.location.href;
	if (url.endsWith(("full_leaderboard.html"))) {
		result = fullResults;
	} else {
		result = topResults;
	}
	result.sort((a, b) => b.score - a.score);
    let rank = 0;
	let list = result.map((dotfiles) => {
        rank++;
		return `
						<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${rank}</td>
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${dotfiles.name}</td>
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${getUsername(userData, dotfiles.user_id)}</td>
							<td class="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">${dotfiles.description}</td>
							<td class="px-4 py-4 text-sm font-bold text-primary text-right">${dotfiles.score} / 100</td>
		`;
	})
	document.querySelector("#leaderboard").innerHTML = "";
	list.forEach((e) => {
		document.querySelector("#leaderboard").innerHTML += e;
	})
}

function getSearchInputValue() {
	getSearchInput.addEventListener("input", (e) => {
		e.preventDefault();
		const searchValue = getSearchInput.value;
		formatInputValue(searchValue);
	})
}
getSearchInputValue();

function formatInputValue(inputValue) {
	inputValue = inputValue.trim().toLowerCase();
	if (inputValue.length <= 1) {
		return;
	}
	getSearchResults(inputValue);
}

function filterSearchResults(data, userdata, inputValue) {
	const usrDataNames = userdata.map((e) => e.username);
	const filteredUsrData = userdata.filter((e) => e.username);
	const matchingUser = usrDataNames.find((e) => inputValue === e);
	if (matchingUser) {
		const matchingUserId = filteredUsrData.find((e) => e.username === matchingUser).user_id;
		return data.filter((e) => e.user_id === matchingUserId);
	}
	return data.filter((e) => e.name == inputValue);
}

async function getSearchResults(inputValue) {
	const userData = await getUserData();
	const dotfilesData = await getDotfilesData();
	const filteredData = filterSearchResults(dotfilesData, userData, inputValue);
	createEntries(filteredData, inputValue);
}
