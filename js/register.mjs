const accountURL = "http://localhost:3000/accounts";

const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const registerBtn = document.querySelector("#register-btn");

/*
  Gets the existing data
 */

function getValidAccounts(data) {
    const list = Array.isArray(data) ? data : (data && data.accounts) || [];
    return list.filter((item) => item && typeof item.username === "string");
}

/*
  Get the length of elements in the json file and then adds 1 to the id of the new user
 */

function getNextId(accounts) {
	    const ids = accounts
	        .map((a) => (typeof a.id === "string" ? parseInt(a.id, 10) : a.id))
	        .filter((n) => !isNaN(n));
	    const max = ids.length ? Math.max(...ids) : 0;
	    return String(max + 1)
}


/*
  Removes the whitespaces from the user input and then calls the input check function
 */

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

/*
  Fetch accounts from the json file and then call checkAccountFromUserInput
  with data gotten from the json file using getValidAccounts
 */

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

/*
  If existUser or existEmail is not empty then alerts the user and then return
  if not then calls createNewAccountObj
 */

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

/*
  Creates object and then calls the send function
 */

function createNewAccountObj(idValue, usernameValue, emailValue, passwordValue) {
	const newAccount = {
		id: idValue,
		username: usernameValue,
		email: emailValue,
		password: passwordValue,
		role: "user",
	}
	sendNewAccount(newAccount);
}

/*
  Sends the account, if it fails call fetchUnfullfilledHandler
  if not calls fetchFullfilledHandler
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
