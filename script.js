// ===== Session & Auth Management =====

// Get logged in user from sessionStorage
const loggedInUser = sessionStorage.getItem('loggedInUser');

// Redirect to login page if not logged in (except on login.html)
if (!loggedInUser && !window.location.href.includes('login.html')) {
    window.location.href = 'login.html';
}

// Display username if element exists
const userInfoEl = document.getElementById('user-info');
if (userInfoEl && loggedInUser) {
    userInfoEl.textContent = `Welcome, ${loggedInUser}!`;
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });
}

// ===== Login Handling (on login.html only) =====
if (window.location.href.includes('login.html')) {
    const users = {
        "Amr": "001",
        "002": "002",
        "Kanamiz_Husband": "003",
        "Aizen_Husband": "004",
        "Mohamed": "005",
        "admin": "69",
        "TEST": "6969"
    };

    const loginButton = document.querySelector('button');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('error');

    function login() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if(users[username] && users[username] === password) {
            // Save session immediately
            sessionStorage.setItem('loggedInUser', username);
            // Redirect immediately
            window.location.href = 'index.html';
        } else {
            errorDiv.style.color = 'red';
            errorDiv.textContent = 'Incorrect username or password!';
        }
    }

    loginButton.addEventListener('click', login);

    // Allow Enter key to submit
    usernameInput.addEventListener('keypress', e => { if(e.key === 'Enter') login(); });
    passwordInput.addEventListener('keypress', e => { if(e.key === 'Enter') login(); });

    // Redirect if already logged in
    if(loggedInUser) window.location.href = 'index.html';
}
// Only if logged in and profile elements exist
if (loggedInUser && document.getElementById('profile-panel')) {
    const profilePic = document.getElementById('profile-pic');
    const profilePanel = document.getElementById('profile-panel');
    const picUpload = document.getElementById('pic-upload');
    const bioInput = document.getElementById('bio');
    const saveBtn = document.getElementById('save-profile');
    const uidEl = document.getElementById('uid');

    const users = {
        "Amr": "001",
        "002": "002",
        "Kanamiz_Husband": "003",
        "Aizen_Husband": "004",
        "Mohamed": "005",
        "admin": "69",
        "TEST": "6969"
    };
    uidEl.textContent = users[loggedInUser];

    // Load saved profile
    const savedProfile = JSON.parse(localStorage.getItem(`profile_${loggedInUser}`)) || {};
    if (savedProfile.pic) profilePic.src = savedProfile.pic;
    if (savedProfile.bio) bioInput.value = savedProfile.bio;

    // Click profile pic to toggle panel
    profilePic.addEventListener('click', () => {
        profilePanel.style.display = profilePanel.style.display === 'none' ? 'block' : 'none';
    });

    // Upload new pic
    picUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic.src = e.target.result;
        }
        reader.readAsDataURL(file);
    });

    // Save profile
    saveBtn.addEventListener('click', () => {
        const profileData = {
            pic: profilePic.src,
            bio: bioInput.value
        };
        localStorage.setItem(`profile_${loggedInUser}`, JSON.stringify(profileData));
        alert('Profile saved successfully!');
        profilePanel.style.display = 'none';
    });
}
