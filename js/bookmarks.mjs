const tableBody = document.querySelector("#table-body");
window.deleteBookmark = deleteBookmark;

export async function toggleBookmark(dotfilesId, userId) {
    const res = await fetch(`http://localhost:3060/bookmarks`);
    const data = await res.json();
    const existing = data.filter((e) => { return e.dotfiles_id == dotfilesId; });
    const currentUserId = getCurrentUserId();
    const currentId = randomNumberGenerator();
    const object = {
        "dotfiles_id": `${dotfilesId}`,
        "user_id": `${userId}`,
        "id": `${currentId}`
    };
    const condition = bookmarkCondition(existing, currentUserId);
    if (condition == true) {
        await fetch(`http://localhost:3060/bookmarks/${existing[0].id}`, { method: 'DELETE' });
    }
    await fetch('http://localhost:3060/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
    });
}

function bookmarkCondition(existing, currentUserId) {
    if (existing.user_id == currentUserId) {
        return false;
    }
    else {
        return true;
    }
}

function randomNumberGenerator() {
    const min = 1;
    const max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getBookmarksData() {
    const bookmarks = await fetch('http://localhost:3060/bookmarks')
    return bookmarks.json().then((data) => {
        return data;
    });
}

function getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    return currentUser.user_id;
}

async function getDotfilesData() {
    const dotfilesData = await fetch('http://localhost:3030/dotfiles');
    return dotfilesData.json().then((data) => { return data; });
}

async function filterBookmarksData(data, user_id) {
    return (data.filter((e) => e.user_id === user_id));
}

async function getUserData() {
    const data = await fetch('http://localhost:3000/accounts');
    return data.json().then((data) => { return data; });
}

function filterDotfilesData(bookmarksData, dotfilesData) {
    return bookmarksData.map(bookmark => {
        const dotfile = dotfilesData.find(d => d.id === bookmark.dotfiles_id);
        return { ...dotfile, bookmark_id: bookmark.id }
    })
}

function getUsername(data, user_id) {
    const user = data.find((e) => e.user_id === user_id);
    return user.username;
}

async function renderBookmarks() {
    const data = await getBookmarksData();

    const userId = getCurrentUserId();

    const userData = await getUserData();

    const dotfilesData = await getDotfilesData();

    const bookmarksData = await filterBookmarksData(data, userId);

    const filteredDotfilesData = filterDotfilesData(bookmarksData, dotfilesData);
    console.log(filteredDotfilesData);

    tableBody.innerHTML = "";

    if (bookmarksData.length == 0) {
        tableComponent.classList.add("hidden")
        noBookmarks.classList.remove("hidden")
        return;
    }
    console.log(filteredDotfilesData);

    let list = filteredDotfilesData.map((bookmarks) => {
        const username = getUsername(userData, bookmarks.user_id)
        const bId = bookmarks.bookmark_id;
        return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                        <td class="px-4 py-4 text-sm font-medium mono-text text-primary">${bookmarks.name}</td>
                        <td class="px-4 py-4 text-sm">${username}</td>
                        <td class="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 italic">${bookmarks.description}</td>
                        <td class="px-4 py-4 text-sm text-right font-bold text-green-500">${bookmarks.score}</td>
                        <td class="px-4 py-4 text-sm text-center">
                            <button class="text-red-500 hover:text-red-600 transition-colors" onclick="deleteBookmark('${bId}')">
                                <span class="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </td>
        `;
    })
    list.forEach((e) => {
        tableBody.innerHTML += e;
    })
}
renderBookmarks();

async function deleteBookmark(id) {
    console.log(id);
    await fetch(`http://localhost:3060/bookmarks/${id}`, { method: 'DELETE' });
}

/*
- return stuff
    <button class="text-red-500 hover:text-red-600 transition-colors" onclick="functionThatDeletes(bookmark)">
        <span class="material-symbols-outlined text-sm">delete</span>
    </button>
*/
