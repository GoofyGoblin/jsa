const editMenu = document.getElementById("edit-modal");
const closeEditMenuBtn = document.getElementById("close-modal");
const cancelEditMenuBtn = document.getElementById("cancel-edit");
const sendEditMenuBtn = document.getElementById("send-edit");
const url = "http://localhost:3030/dotfiles";
window.openEditMenu = openEditMenu;
async function getDotfilesData() {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new error(`response status ${response.status}`);
		}
		const result = await response.json();
		renderTodos(result);
	} catch (error) {
		console.log(error.message);
	}
}
getDotfilesData();

function renderTodos(results) {
	let list = results.map((dotfiles) => {
		return `
							<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
								<td class="px-4 py-3 text-sm font-medium text-center text-slate-500">${dotfiles.id}</td>
								<td class="px-4 py-3 text-sm font-medium">${dotfiles.name}</td>
								<td class="px-4 py-3 text-sm text-slate-500">${dotfiles.description}</td>
								<td class="px-4 py-3 text-sm font-bold text-primary text-center">${dotfiles.score}</td>
								<td class="px-4 py-3 text-sm text-center space-x-2">
									<button class="text-blue-500 hover:underline text-xs font-bold uppercase" onclick="openEditMenu()">Edit</button>
									<span class="text-slate-400">|</span>
									<button class="text-red-500 hover:underline text-xs font-bold uppercase" onclick ="deleteDotfilesList()">Delete</button>
								</td>
							</tr>
		`;
	})
	document.querySelector("#admin-leaderboard-body").innerHTML = list;
}

function openEditMenu() {
	editMenu.classList.remove("hidden");
}

function closeEditMenu() {
	closeEditMenuBtn.addEventListener("click", () => {
		editMenu.classList.add("hidden");
	})
	cancelEditMenuBtn.addEventListener("click", () => {
		editMenu.classList.add("hidden");
	})
}
closeEditMenu();

function sendEditMenuBtnHandler() {
	sendEditMenuBtn.addEventListener("click", () => {
		editMenu.classList.add("hidden");
	})
}

async function sendEditMenu(id, name, repo_url, description, score) {

}
