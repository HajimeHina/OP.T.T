// ===== Session & Auth Management =====

// Get logged in user from sessionStorage
const loggedInUser = sessionStorage.getItem('loggedInUser');
const allUsers = ["Amr", "002", "Kanamiz_Husband", "Aizen_Husband", "Mohamed", "TEST"];

// Check if we're on login page or main page
const currentPage = window.location.pathname.split('/').pop();

// ===== LOGIN PAGE FUNCTIONALITY =====
if (currentPage === 'login.html') {
    const users = {
        "Amr": "001",
        "002": "002",
        "Kanamiz_Husband": "003",
        "Aizen_Husband": "004",
        "Mohamed": "005",
        "admin": "69",
        "TEST": "6969"
    };

    // Redirect if already logged in
    if (loggedInUser) {
        window.location.href = 'index.html';
    }

    function login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error');

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

    // Make login function available globally for the onclick
    window.login = login;

    // Allow Enter key to submit
    document.getElementById('username').addEventListener('keypress', e => { 
        if(e.key === 'Enter') login(); 
    });
    document.getElementById('password').addEventListener('keypress', e => { 
        if(e.key === 'Enter') login(); 
    });

} 
// ===== MAIN PAGE FUNCTIONALITY =====
else if (currentPage === 'index.html' || currentPage === '') {
    
    // Redirect to login page if not logged in
    if (!loggedInUser) {
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

    // ===== Profile Management =====
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
        
        if (uidEl) uidEl.textContent = users[loggedInUser] || "000";

        // Load saved profile
        const savedProfile = JSON.parse(localStorage.getItem(`profile_${loggedInUser}`)) || {};
        if (savedProfile.pic) profilePic.src = savedProfile.pic;
        if (savedProfile.bio && bioInput) bioInput.value = savedProfile.bio;

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

    // ===== Firebase Leaderboard =====
    function updateScore(username, points) {
        if (!window.db) {
            console.error('Database not initialized');
            return;
        }
        
        const userRef = window.db_ref(window.db, 'leaderboard/' + username);
        window.db_update(userRef, {
            points: (points || 0) + 1
        }).catch(error => {
            console.error('Error updating score:', error);
        });
    }

    function loadLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList || !window.db) return;

        const leaderboardRef = window.db_ref(window.db, "leaderboard");

        window.db_get(leaderboardRef).then(snapshot => {
            const data = snapshot.val() || {};

            // Build full leaderboard including 0-point users
            const fullBoard = allUsers.map(username => {
                return {
                    username: username,
                    points: data[username]?.points || 0
                };
            });

            // Sort by points descending
            fullBoard.sort((a, b) => b.points - a.points);

            leaderboardList.innerHTML = "";

            fullBoard.forEach((entry, index) => {
                const li = document.createElement("li");
                li.textContent = `${index + 1}. ${entry.username}: ${entry.points} pts`;
                leaderboardList.appendChild(li);
            });
        }).catch(error => {
            console.error('Error loading leaderboard:', error);
        });
    }


    // Initialize leaderboard when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
    // Load leaderboard and refresh every 2 seconds
    loadLeaderboard();
    setInterval(loadLeaderboard, 2000);

    // Setup admin panel if user is admin
    setupAdminPanel();

    // ===== Reset button =====
    const resetBtn = document.getElementById('reset-leaderboard');
    if (resetBtn && loggedInUser === "admin") {
        resetBtn.style.display = 'inline-block';
        
        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset the leaderboard?")) {
                window.db_set(window.db_ref(window.db, "leaderboard"), {})
                    .then(() => {
                        alert("Leaderboard has been reset!");
                        loadLeaderboard();
                    })
                    .catch(error => {
                        console.error('Error resetting leaderboard:', error);
                        alert("Error resetting leaderboard!");
                    });
            }
        });
    }
});
}


// ===== Admin Point Management =====
function setupAdminPanel() {
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const adminPanel = document.getElementById('admin-panel');
    const adminCloseBtn = document.getElementById('admin-close');
    const adminApplyBtn = document.getElementById('admin-apply');
    const adminUserSelect = document.getElementById('admin-user-select');
    const adminPointsInput = document.getElementById('admin-points');
    const adminActionSelect = document.getElementById('admin-action');
    const adminMessage = document.getElementById('admin-message');

    // Show admin button only for admin user
    if (adminPanelBtn && loggedInUser === "admin") {
        adminPanelBtn.style.display = 'inline-block';
        
        // Populate user dropdown
        adminUserSelect.innerHTML = '<option value="">Select User</option>';
        allUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            adminUserSelect.appendChild(option);
        });

        // Toggle admin panel
        adminPanelBtn.addEventListener('click', () => {
            adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
        });

        // Close admin panel
        adminCloseBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
            adminMessage.textContent = '';
        });

        // Apply points changes
        adminApplyBtn.addEventListener('click', async () => {
            const selectedUser = adminUserSelect.value;
            const points = parseInt(adminPointsInput.value);
            const action = adminActionSelect.value;

            if (!selectedUser) {
                adminMessage.textContent = 'Please select a user!';
                adminMessage.style.color = 'red';
                return;
            }

            if (isNaN(points) || points < 0) {
                adminMessage.textContent = 'Please enter a valid points value!';
                adminMessage.style.color = 'red';
                return;
            }

            try {
                const userRef = window.db_ref(window.db, 'leaderboard/' + selectedUser);
                const snapshot = await window.db_get(userRef);
                const currentData = snapshot.val() || {};
                const currentPoints = currentData.points || 0;

                let newPoints;
                switch (action) {
                    case 'add':
                        newPoints = currentPoints + points;
                        break;
                    case 'subtract':
                        newPoints = Math.max(0, currentPoints - points);
                        break;
                    case 'set':
                        newPoints = points;
                        break;
                    default:
                        newPoints = currentPoints;
                }

                await window.db_set(userRef, {
                    points: newPoints,
                    lastUpdated: new Date().toISOString(),
                    username: selectedUser
                });

                adminMessage.textContent = `✅ ${action === 'add' ? 'Added' : action === 'subtract' ? 'Subtracted' : 'Set'} ${points} points for ${selectedUser}. New total: ${newPoints}`;
                adminMessage.style.color = 'lightgreen';
                
                // Refresh leaderboard
                loadLeaderboard();

            } catch (error) {
                console.error('Admin panel error:', error);
                adminMessage.textContent = `❌ Error: ${error.message}`;
                adminMessage.style.color = 'red';
            }
        });
    }
}

// Also update the reset leaderboard button to show for admin
if (loggedInUser === "admin") {
    const resetBtn = document.getElementById('reset-leaderboard');
    if (resetBtn) {
        resetBtn.style.display = 'inline-block';
    }
}
