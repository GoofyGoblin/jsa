// get user input
const username = document.querySelector("#username-btn");
const password = document.querySelector("#password-btn");
const loginBtn = document.querySelector("#login-btn");
// fetching the json api
const accountUrl = "http://localhost:3000/accounts"
async function getUserData() {
	const url = "http://localhost:3000/accounts";
	try {
		const res = await fetch(url);
		if (!res.ok) {
			throw new error(`response status ${res.status}`);
		}
		res.json()
			.then((data) => {
				verifyLoginData(data);
			})
	} catch (error) {
		console.log(error.message);
	}
}

function getLoginBtn() {
	if (loginBtn) {
		loginBtn.addEventListener("click", (e) => {
			e.preventDefault()
			getUserData();
		})
	}
}
getLoginBtn();

function verifyLoginData(loginData) {
	const accounts = loginData;
	const account = accounts.find(account => account.username === username.value && account.password === password.value)
	console.log(account);
	if (!username.value || !password.value) {
		alert("Please fill in all fields")
		return
	}
	if (!account) {
		alert("Invalid username or password")
	}
	window.location.href = "home.html";
}

function logUsersList(results) {
	let list = results.map((todos) => {
		return todos;
	})
	console.log(list);
}
