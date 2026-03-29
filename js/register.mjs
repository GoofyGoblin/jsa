const accountURL = "http://localhost:3000/accounts";

const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const registerBtn = document.querySelector("#register-btn");
const accounts = await fetchAccounts(accountURL);

async function fetchAccounts(url) {
    const res = await fetch(url);
    const data = JSON.parse(await res.text());
    return data
}

/*
  Removes the whitespaces from the user input and then calls the input check function
 */

function getRegisterBtn() {
    registerBtn.addEventListener("click", (e) => {
        e.preventDefault()
        checkUserInput((usernameInput.value || "").trim(), (emailInput.value || "").trim(), (passwordInput.value || "").trim(), (confirmPasswordInput.value || "").trim())
    })
}
getRegisterBtn();

function checkUserInput(usernameValue, emailValue, passwordValue, confirmPasswordValue) {
    if (!usernameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
        alert("Please fill in all fields");
        return;
    }
    if (passwordValue !== confirmPasswordValue) {
        alert("Password does not match");
        return;
    }
    checkIfAccountExist();
}


function getAccountData(data, usernameValue) {
    return data.find((e) => e.username == usernameValue);
}

function getNextId() {
    return accounts.length + 1;
}

function checkIfAccountExist() {
    const username = usernameInput.value.trim();
    const exist = getAccountData(accounts, username)
    console.log(exist);

    if(exist) {
        alert('This user already exist');
        return;
    } else {
        createNewAccountObj();
    }
}

function createNewAccountObj() {
    const usernameValue = usernameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const idValue = getNextId();

	const newAccount = {
		user_id: `${idValue}`,
		username: `${usernameValue}`,
		email: `${emailValue}`,
		password: `${passwordValue}`,
		role: "user",
	}
    sendNewAccount(newAccount);
}

/*
  Sends the account, if it fails call fetchUnfullfilledHandler
  if not call fetchFullfilledHandler
 */

async function sendNewAccount(newAccount) {
	const res = await fetch(accountURL, {
		method: "POST",
		headers: {"Content-type": "application/json"},
		body: JSON.stringify(newAccount),
	})
	if (!res) return;
	if (!res.ok) {
		fetchUnfullfilledHandler();
		return;
	}
	fetchFullfilledHandler();
}

function fetchFullfilledHandler(){
	window.location.href = "login.html";
}

function fetchUnfullfilledHandler(){
	alert("Cant connect to server");
}
