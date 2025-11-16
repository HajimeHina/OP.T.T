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
    
    // Profile viewing elements
    const adminProfileSelect = document.getElementById('admin-profile-select');
    const adminProfileView = document.getElementById('admin-profile-view');
    const adminCloseProfilesBtn = document.getElementById('admin-close-profiles');
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');

    // Show admin button only for admin user
    if (adminPanelBtn && loggedInUser === "admin") {
        adminPanelBtn.style.display = 'inline-block';
        
        // Populate user dropdowns
        function populateUserDropdowns() {
            adminUserSelect.innerHTML = '<option value="">Select User</option>';
            adminProfileSelect.innerHTML = '<option value="">Select User</option>';
            
            allUsers.forEach(user => {
                // Points management dropdown
                const option1 = document.createElement('option');
                option1.value = user;
                option1.textContent = user;
                adminUserSelect.appendChild(option1);
                
                // Profile viewing dropdown
                const option2 = document.createElement('option');
                option2.value = user;
                option2.textContent = user;
                adminProfileSelect.appendChild(option2);
            });
        }
        
        populateUserDropdowns();

        // Toggle admin panel
        adminPanelBtn.addEventListener('click', () => {
            adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
            // Refresh user lists when opening panel
            populateUserDropdowns();
        });

        // Tab switching
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                adminTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab contents
                adminTabContents.forEach(content => content.style.display = 'none');
                
                // Show selected tab content
                const tabName = tab.getAttribute('data-tab');
                document.getElementById(`${tabName}-tab`).style.display = 'block';
            });
        });

        // Close admin panel (points tab)
        adminCloseBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
            adminMessage.textContent = '';
        });

        // Close admin panel (profiles tab)
        adminCloseProfilesBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
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

        // View user profiles
        adminProfileSelect.addEventListener('change', async function() {
            const selectedUser = this.value;
            
            if (!selectedUser) {
                adminProfileView.innerHTML = '<div style="text-align: center; color: #888;">Select a user to view their profile</div>';
                return;
            }

            try {
                // Load profile data from localStorage
                const profileData = JSON.parse(localStorage.getItem(`profile_${selectedUser}`)) || {};
                
                // Load points data from Firebase
                const userRef = window.db_ref(window.db, 'leaderboard/' + selectedUser);
                const snapshot = await window.db_get(userRef);
                const pointsData = snapshot.val() || {};
                const userPoints = pointsData.points || 0;

                // Get UID
                const users = {
                    "Amr": "001",
                    "002": "002", 
                    "Kanamiz_Husband": "003",
                    "Aizen_Husband": "004",
                    "Mohamed": "005",
                    "admin": "69",
                    "TEST": "6969"
                };
                const userUID = users[selectedUser] || "000";

                // Display profile
                adminProfileView.innerHTML = `
                    <div class="profile-view">
                        <img src="${profileData.pic || 'https://via.placeholder.com/80'}" 
                             alt="${selectedUser}'s Profile" 
                             class="profile-picture">
                        <h4 style="text-align: center; margin-bottom: 10px; color: #764ba2;">${selectedUser}</h4>
                        
                        <div class="profile-stats">
                            <span>UID: ${userUID}</span>
                            <span>Points: ${userPoints}</span>
                        </div>
                        
                        <div class="profile-bio">
                            <strong>Bio:</strong><br>
                            ${profileData.bio || '<em>No bio set</em>'}
                        </div>
                        
                        <div style="font-size: 11px; color: #888; text-align: center;">
                            Last updated: ${profileData.bio ? 'Profile saved' : 'No profile data'}
                        </div>
                    </div>
                `;

            } catch (error) {
                console.error('Error loading profile:', error);
                adminProfileView.innerHTML = `
                    <div class="no-profile">
                        ❌ Error loading profile for ${selectedUser}<br>
                        <small>${error.message}</small>
                    </div>
                `;
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
