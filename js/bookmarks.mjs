const tableBody = document.querySelector("#table-body");
window.deleteBookmark = deleteBookmark;

export async function toggleBookmark(user_id, id) {
    const res = await fetch(`http://localhost:3060/bookmarks?id=${id}&user_id=${user_id}`);
    const existing = await res.json();
    /* console.log(existing); */

    if (existing.length > 0) {
        /* console.log(`bookmark id: ${existing[0].id}, bookmark user_id: ${existing[0].user_id}`); */
        await fetch(`http://localhost:3060/bookmarks/${existing[0].id}`, { method: 'DELETE' });
    } else {
        await fetch('http://localhost:3060/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "id": `${id}`, "user_id": `${user_id}` })
        });
    }
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
    /*
    data = await getBookmarksData();
    user_id = getCurrentUserId();
    */
    return (data.filter((e) => e.user_id === user_id));
}

async function getUserData() {
    const data = await fetch('http://localhost:3000/accounts');
    return data.json().then((data) => { return data; });
}

function filterDotfilesData(bookmarksData, dotfilesData) {
    const bookmarksId = bookmarksData.map((e) => { return e.id; });
    let filteredData = [];
    let id;
    for (id of bookmarksId) {
        filteredData.push(dotfilesData.filter((e) => {return e.id === id}));
    }
    return filteredData.flat();
}

function getUsername(data, user_id) {
    const user = data.find((e) => e.user_id === user_id);
    return user.username;
}

async function renderBookmarks() {
    const data = await getBookmarksData();
    // const user_id = getCurrentUserId();
    const user_id = "1";
    const userData = await getUserData();
    const dotfilesData = await getDotfilesData();
    const bookmarksData = await filterBookmarksData(data, user_id);
    const filteredDotfilesData = filterDotfilesData(bookmarksData, dotfilesData);
    console.log(filteredDotfilesData);
    tableBody.innerHTML = "";
    if (bookmarksData.length == 0) {
        tableComponent.classList.add("hidden")
        noBookmarks.classList.remove("hidden")
        return;
    }
    let list = filteredDotfilesData.map((bookmarks) => {
        const username = getUsername(userData, bookmarks.user_id)
        // const username = "fish"
        return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                        <td class="px-4 py-4 text-sm font-medium mono-text text-primary">${bookmarks.name}</td>
                        <td class="px-4 py-4 text-sm">${username}</td>
                        <td class="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 italic">${bookmarks.description}</td>
                        <td class="px-4 py-4 text-sm text-right font-bold text-green-500">${bookmarks.score}</td>
                        <td class="px-4 py-4 text-sm text-center">
                            <button class="text-red-500 hover:text-red-600 transition-colors" onclick="deleteBookmark('${bookmarks.id}')">
                                <span class="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </td>
        `;
    })
    // let bruh = filteredData.forEach((e) => {return e});
    // console.log(bruh);
    list.forEach((e) => {
        tableBody.innerHTML += e;
    })
}
renderBookmarks();

async function deleteBookmark(id) {
    await fetch(`http://localhost:3060/bookmarks/${id}`, { method: 'DELETE' });
}

/*
- return stuff
    <button class="text-red-500 hover:text-red-600 transition-colors" onclick="functionThatDeletes(bookmark)">
        <span class="material-symbols-outlined text-sm">delete</span>
    </button>
*/
