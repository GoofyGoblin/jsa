// fetching the json api
import { toggleBookmark } from "./bookmarks.mjs";

window.toggleBookmark = toggleBookmark;

const url = "http://localhost:3030/dotfiles";
async function getDotfilesData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new error(`response status ${response.status}`);
        }
        const result = await response.json();
        renderDotfiles(result.splice(0, 3));
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
        const username = getUsername(userData, dotfiles.user_id);
        return `
						<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                ${dotfiles.name}
                            </td>
							<td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                <a href="profile.html?username=${username}" class="suckless-link">${username}</a>
                            </td>
							<td class="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">${dotfiles.description}</td>
							<td class="px-4 py-4 text-sm font-bold text-primary text-right">${dotfiles.score} / 100
                                <button class="bookmark-btn text-slate-400 hover:text-yellow-400 transition-colors focus:outline-none inline-flex items-center" id="bookmark-btn" data-id="${dotfiles.id}" onclick="event.preventDefault(); this.classList.toggle('text-yellow-400'); this.classList.toggle('text-slate-400'); toggleBookmark(${dotfiles.user_id}, ${dotfiles.id})">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                                </td>
		`;
    })
    list.forEach((e) => {
        document.querySelector("#leaderboard").innerHTML += e;
    })
}
