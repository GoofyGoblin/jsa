// fetching the json api
const url = "http://localhost:3030/dotfiles";
async function getDotfilesData() {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new error(`response status ${response.status}`);
		}
		const result = await response.json();
		renderDotfiles(result.splice(0, 5));
	} catch (error) {
		console.log(error.message);
	}
}
getDotfilesData();

async function getUserData() {
	const res = await fetch('http://localhost:3000/accounts');
	const data = JSON.parse(await res.text());
	return data;
} 

function getUsername(data, user_id) {
	const user = data.find((e) => e.user_id === user_id);
	return user.username;
}


async function renderDotfiles(results) {
	const userData = await getUserData();
	results = results.sort((a, b) => b.id - a.id);
	let list = results.map((dotfiles) => {
		return `
						<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${dotfiles.name}</td>
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${getUsername(userData, dotfiles.user_id)}</td>
							<td class="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">${dotfiles.description}</td>
							<td class="px-4 py-4 text-sm font-bold text-primary text-right">${dotfiles.score} / 100</td>
		`;
	})
	list.forEach((e) => {
		document.querySelector("#leaderboard").innerHTML += e;
	})
}

