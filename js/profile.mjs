// fetching the json api
const dotfilesUrl = "http://localhost:3030/dotfiles";
const accountsUrl = "http://localhost:3000/accounts";
const usersUsername = document.getElementById('user-username');
const usersRole = document.getElementById('user-role');
const usersSubmitCount = document.getElementById('user-submission-count');
const usersAvgScore = document.getElementById('user-avg-score');
const tableBody = document.getElementById('user-submissions-list');

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

function getUsername() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (!username) {
        return;
    }
    return username;
}

async function getUser(username) {
    const userData = await getUserData();
    return userData.find(u => u.username === username);
}

async function getDotfiles(user) {
    const dotfilesData = await getDotfilesData();
    return dotfilesData.filter(d => d.user_id === user.user_id);
}

function calcAvgScore(dotfiles) {
    let avgScore = "N/A";
    if (dotfiles.length > 0) {
        const totalScore = dotfiles.reduce((sum, d) => sum + parseFloat(d.score || 0), 0);
        avgScore = (totalScore / dotfiles.length).toFixed(1);
    }
    return avgScore;
}

function updateDom(user, dotfiles, score) {
    usersUsername.innerText = user.username;
    usersRole.innerText = user.role;
    usersSubmitCount.innerText = dotfiles.length;
    usersAvgScore.innerText = score;
}

async function renderProfile() {
    const username = getUsername();

    const user = await getUser(username);
    if (!user) {
        document.getElementById('user-username').innerText = "User not found";
        return;
    }
    const userDotfiles = await getDotfiles(user);
    const avgScore = calcAvgScore(userDotfiles);

    updateDom(user, userDotfiles, avgScore);

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
