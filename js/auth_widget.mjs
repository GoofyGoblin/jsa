function domLoadedHandler() {
    document.addEventListener('DOMContentLoaded', () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const headerContainer = document.querySelector('header > div') || document.querySelector('header');
        addWidget(user, headerContainer);
    })
}
domLoadedHandler();

function addWidget(user, headerContainer) {
    if(headerContainer){
        headerContainer.classList.add('relative');
        const widget = document.createElement('div');
        widget.className = 'absolute top-0 right-0 flex items-center gap-3 text-xs';
        if(user){
            addUser(widget, user);
        } else {
            const isLoginPage = window.location.pathname.endsWith('login.html');
            const isRegisterPage = window.location.pathname.endsWith('register.html');
            checkIfLoggedIn(isLoginPage, isRegisterPage, widget);
        }
        headerContainer.appendChild(widget);
    }
}

function addUser(widget, user){
    widget.innerHTML = `
        <div class = "text-right">
        <div class="font-bold text-slate-900 dark: text-white">${user.username}</div>
        <div class="text-slate-300 dark:text-slate-700">|</div>
        <button id="logout-btn" class="text-primary hover:underline font-bold uppercase">Logout</button>
        `;
    checkIfLogout(widget);
}

function checkIfLogout(widget){
    widget.querySelector('#logout-btn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    })
}

function checkIfLoggedIn(isLoginPage, isRegisterPage, widget){
     if (!isLoginPage && !isRegisterPage) {
         widget.innerHTML = `
             <a href="login.html" class="text-primary hover:underline font-bold uppercase">Login</a>
             <div class="text-slate-300 dark:text-slate-700">|</div>
             <a href="register.html" class="text-primary hover:underline font-bold uppercase">Register</a>
         `;
    }
}
