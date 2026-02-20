// fetching the json api
const url = "http://localhost:3030/dotfiles";
async function getDotfilesData() {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new error(`response status ${response.status}`);
		}
		const result = await response.json();
		console.log(result);
		createEntries(result);
	} catch (error) {
		console.log(error.message);
	}
}
getDotfilesData();

function createEntries(result) {
	const topEntry = result.slice(0, 5);
	const fullEntry = result;
	renderTodos(topEntry, fullEntry);
}

function renderTodos(topResults, fullResults) {
	let result;
	const url = window.location.href;
	if (url.indexOf("leaderboard.html") > -1)  {
		result = topResults;
	} else {
		result = fullResults;
	}
	console.log(topResults);
	console.log(fullResults);
	console.log(result);
	let list = result.map((dotfiles) => {
		return `
						<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${dotfiles.id}</td>
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${dotfiles.name}</td>
							<td class="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">${dotfiles.description}</td>
							<td class="px-4 py-4 text-sm font-bold text-primary text-right">${dotfiles.score}</td>
		`;
	})
	list.forEach((e) => {
		document.querySelector("#leaderboard").innerHTML += e;
	})
}

console.log(document.querySelector("#leaderboard"));
console.log("leaderboard.html" in window.location);


