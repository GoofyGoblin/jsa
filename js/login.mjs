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
	const isAdmin = accounts.find(()=> username.value === "admin");
	console.log(account);
	console.log(isAdmin);
	if (!username.value || !password.value) {
		alert("Please fill in all fields")
		return
	}
	if (!account) {
		alert("Invalid username or password")
		return
	}
	if(isAdmin) {
		localStorage.setItem("user", JSON.stringify(account));
		window.location.href = "admin_dashboard.html"
		return
	}
	localStorage.setItem("user", JSON.stringify(account));
	window.location.href = "home.html";
}
