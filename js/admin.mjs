const editMenu = document.getElementById("edit-modal");
const closeEditMenuBtn = document.getElementById("close-modal");
const cancelEditMenuBtn = document.getElementById("cancel-edit");
const sendEditMenuBtn = document.getElementById("send-edit");

const getEditedSoftwareName = document.getElementById("edit-software-name");
const getEditedSoftwareDesc = document.getElementById("edit-software-desc");
const getEditedSoftwareScore = document.getElementById("edit-software-score");

const url = "http://localhost:3030/dotfiles";

const getAddedSoftwareDesc = document.getElementById("software-desc");
const getAddedRepoUrl = document.getElementById("repo-url");
const getPushBtn = document.getElementById("push-btn");
const adminOption = document.getElementById("software-name-select");
const getAddedSoftwareScore = document.getElementById("software-score");

let currentId;
let currentRepoUrl;
let currentUserId;
let adminChoice = adminOption.value;
let result;

window.start = start;
window.confirmDeletion = confirmDeletion;
async function getDotfilesData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new error(`response status ${response.status}`);
        }
        result = await response.json();
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
									<button class="text-blue-500 hover:underline text-xs font-bold uppercase" onclick="start('${dotfiles.id}', '${dotfiles.user_id}', '${dotfiles.repo_url}')">Edit</button>
									<span class="text-slate-400">|</span>
									<button class="text-red-500 hover:underline text-xs font-bold uppercase" onclick ="confirmDeletion('${dotfiles.id}')">Delete</button>
								</td>
							</tr>
		`;
    })
    list.forEach((e) => {
        document.querySelector("#admin-leaderboard-body").innerHTML += e;
    })
}

function start(id, user_id, repo_url) {
    openEditMenu();
    closeEditMenu();
    sendEditMenuBtnHandler();
    currentId = id;
    currentRepoUrl = repo_url;
    currentUserId = user_id;
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

function sendEditMenuBtnHandler() {
    sendEditMenuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        editMenu.classList.add("hidden");
        createUserObj();
    })
}

function createUserObj() {
    const userObj = {
        "id": `${currentId}`,
        "user_id": `${currentUserId}`,
        "name": `${getEditedSoftwareName.value}`,
        "repo_url": `${currentRepoUrl}`,
        "description": `${getEditedSoftwareDesc.value}`,
        "score": `${getEditedSoftwareScore.value} / 100`
    }
    sendEditMenu(userObj);
}

function confirmDeletion(id) {
    const confirmation = confirm("Are you sure you want to delete this dotfiles?");
    if (!confirmation) {
        return;
    }
    deleteDotfilesList(id);
}

async function sendEditMenu(userObj) {
    const sendEditMenu = await fetch(`http://localhost:3030/dotfiles/${userObj.id}`, {
        method: 'PATCH',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userObj)
    })
    if (!sendEditMenu) return;
    if (!sendEditMenu.ok) {
        alert("Something went wrong");
    }
}

async function sendNewEditMenu(userObj) {
    const sendNewEditMenu = await fetch("http://localhost:3030/dotfiles", {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userObj)
    })
    if (!sendNewEditMenu) return;
    if (!sendNewEditMenu.ok) {
        alert("Something went wrong");
    }
}

async function deleteDotfilesList(id) {
    const deleteDotfilesList = await fetch(`http://localhost:3030/dotfiles/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(id)
    })
    if (!deleteDotfilesList) return;
    if (!deleteDotfilesList.ok) {
        alert("Something went wrong");
    }
}

function getAdminChoice() {
    adminOption.addEventListener("change", (e) => {
        adminOption = e.target.value;
    })
}
getAdminChoice();

function pushBtnClicked() {
    getPushBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const newUserObj = {
            "id": `${result.length + 1}`,
            "user_id": `1`,
            "name": `${adminChoice}`,
            "repo_url": `${getAddedRepoUrl.value}`,
            "description": `${getAddedSoftwareDesc.value}`,
            "score": `${getAddedSoftwareScore.value} / 100`
        }
        console.log(newUserObj);
        sendNewEditMenu(newUserObj);
    })
}
pushBtnClicked();
