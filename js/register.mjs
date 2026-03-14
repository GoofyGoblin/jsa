const accountURL = "http://localhost:3000/accounts";

const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const registerBtn = document.querySelector("#register-btn");

function getValidAccounts(data) {
    const list = Array.isArray(data) ? data : (data && data.accounts) || [];
    return list.filter((item) => item && typeof item.username === "string");
}

function getNextId(accounts) {
	    const ids = accounts
	        .map((a) => (typeof a.id === "string" ? parseInt(a.id, 10) : a.id))
	        .filter((n) => !isNaN(n));
	    const max = ids.length ? Math.max(...ids) : 0;
	    return String(max + 1)
}


function getRegisterBtn(registerBtn) {
    registerBtn.addEventListener("click", (e) => {
        e.preventDefault()
        checkUserInput((usernameInput.value || "").trim(), (emailInput.value || "").trim(), (passwordInput.value || "").trim(), (confirmPasswordInput.value || "").trim())
    })
}
getRegisterBtn(registerBtn);

function checkUserInput(usernameValue, emailValue, passwordValue, confirmPasswordValue) {
    if (!usernameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
        alert("Please fill in all fields");
        return;
    }
    if (passwordValue !== confirmPasswordValue) {
        alert("Password does not match");
        return;
    }
    fetchAccounts(accountURL, usernameValue, emailValue);
}

async function fetchAccounts(url, usernameValue, emailValue) {
    const res = await fetch(url);
    res.json()
        .then((data) => {
            checkAccountFromUserInput(
				data,
                getValidAccounts(data).some((a) => a.username === usernameValue),
                getValidAccounts(data).some((a) => a.email === emailValue)
            );
        })
}

function checkAccountFromUserInput(data, existUser, existEmail) {
    if (existUser) {
        alert("Username already exists");
        return;
    }
    if (existEmail) {
        alert("Email already exists");
        return;
    }
	createNewAccountObj(getNextId(getValidAccounts(data)), (usernameInput.value || "").trim(), (emailInput.value || "").trim(), (passwordInput.value).trim());
}

function createNewAccountObj(idValue, usernameValue, emailValue, passwordValue) {
	const newAccount = {
		id: idValue,
		username: usernameValue,
		email: emailValue,
		password: passwordValue,
		role: "user",
	}
	//console.log(newAccount);
	sendNewAccount(newAccount);
}

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
