// get user input
const username = document.querySelector("#username-btn");
const password = document.querySelector("#password-btn");
const loginBtn = document.querySelector("#login-btn");

/*
  Self explanatory, its in the function name
 */

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

/*
  This function
  1. Checks if the user is admin or not
  2. If admin then the user gets sent to the dashboard
  3. If not then the user gets sent to the home page
  4. Saves the user credentials to local storage (after deleting the password of course)
 */

function verifyLoginData(loginData) {
	const accounts = loginData;
	let account = accounts.find(account => account.username === username.value)
	const isAdmin = accounts.find(()=> username.value === "admin");
	// console.log(account);
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
        delete account.password;
		localStorage.setItem("user", JSON.stringify(account));
		window.location.href = "admin_dashboard.html"
		return
	}
    delete account.password;
	localStorage.setItem("user", JSON.stringify(account));
	window.location.href = "home.html";
}
