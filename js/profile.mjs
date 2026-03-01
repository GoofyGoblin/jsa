// fetching the json api
const dotfilesUrl = "http://localhost:3030/dotfiles";
const accountsUrl = "http://localhost:3000/accounts";

async function getDotfilesData() {
    try {
        const response = await fetch(dotfilesUrl);
        if (!response.ok) {
            throw new Error(`response status ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error.message);
    }
}

async function getUserData() {
    try {
        const res = await fetch(accountsUrl);
        if (!res.ok) {
            throw new Error(`response status ${res.status}`);
        }
        const data = JSON.parse(await res.text());
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

async function renderProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (!username) {
        return;
    }
    const userData = await getUserData();
    const dotfilesData = await getDotfilesData();
    const user = userData.find(u => u.username === username);
    if (!user) {
        document.getElementById('user-username').innerText = "User not found";
        return;
    }
    const userDotfiles = dotfilesData.filter(d => d.user_id === user.user_id || d.user_id === user.id);
    let avgScore = "N/A";
    if (userDotfiles.length > 0) {
        const totalScore = userDotfiles.reduce((sum, d) => sum + parseFloat(d.score || 0), 0);
        avgScore = (totalScore / userDotfiles.length).toFixed(1);
    }
    document.getElementById('user-username').innerText = user.username;
    document.getElementById('user-role').innerText = user.role || "Contributor";
    document.getElementById('user-submission-count').innerText = userDotfiles.length;
    document.getElementById('user-avg-score').innerText = avgScore;
    const tableBody = document.getElementById('user-submissions-list');
    if (userDotfiles.length > 0) {
        tableBody.innerHTML = "";
        userDotfiles.forEach(dotfile => {
            tableBody.innerHTML += `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td class="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">${dotfile.name}</td>
                    <td class="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">${dotfile.description}</td>
                    <td class="px-4 py-4 text-sm font-bold text-primary text-right">${dotfile.score} / 100</td>
                </tr>
            `;
        });
    }
}

renderProfile();
