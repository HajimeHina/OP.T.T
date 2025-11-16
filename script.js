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

    // Load saved profile from Firebase
    async function loadProfile() {
        try {
            const profileRef = window.db_ref(window.db, 'profiles/' + loggedInUser);
            const snapshot = await window.db_get(profileRef);
            const profileData = snapshot.val() || {};
            
            if (profileData.pic) profilePic.src = profileData.pic;
            if (profileData.bio && bioInput) bioInput.value = profileData.bio;
            
            console.log('Profile loaded from Firebase:', profileData);
        } catch (error) {
            console.error('Error loading profile from Firebase:', error);
        }
    }

    // Click profile pic to toggle panel
    profilePic.addEventListener('click', () => {
        profilePanel.style.display = profilePanel.style.display === 'none' ? 'block' : 'none';
        loadProfile(); // Refresh profile data when opening panel
    });

    // Upload new pic and convert to Base64
    picUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file!');
            return;
        }

        // Check file size (limit to 1MB to avoid large Base64 strings)
        if (file.size > 1024 * 1024) {
            alert('Please select an image smaller than 1MB!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            // Set the preview immediately
            profilePic.src = e.target.result;
        }
        reader.onerror = function(error) {
            console.error('Error reading file:', error);
            alert('Error reading image file!');
        }
        reader.readAsDataURL(file);
    });

    // Save profile to Firebase (with Base64 image)
    saveBtn.addEventListener('click', async () => {
        try {
            const profileRef = window.db_ref(window.db, 'profiles/' + loggedInUser);
            
            const profileData = {
                pic: profilePic.src, // This is now Base64 string
                bio: bioInput.value,
                username: loggedInUser,
                uid: users[loggedInUser] || "000",
                lastUpdated: new Date().toISOString()
            };
            
            await window.db_set(profileRef, profileData);
            
            alert('Profile saved successfully to database!');
            profilePanel.style.display = 'none';
            
        } catch (error) {
            console.error('Error saving profile to Firebase:', error);
            alert('Error saving profile to database!');
        }
    });

    // Load profile on page load
    loadProfile();
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
   // Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize profiles for all users (this runs once when page loads)
    initializeUserProfiles();
    
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
       // View user profiles from Firebase
adminProfileSelect.addEventListener('change', async function() {
    const selectedUser = this.value;
    
    if (!selectedUser) {
        adminProfileView.innerHTML = '<div style="text-align: center; color: #888;">Select a user to view their profile</div>';
        return;
    }

    try {
        // Load profile data from Firebase
        const profileRef = window.db_ref(window.db, 'profiles/' + selectedUser);
        const profileSnapshot = await window.db_get(profileRef);
        const profileData = profileSnapshot.val() || {};
        
        // Load points data from Firebase
        const pointsRef = window.db_ref(window.db, 'leaderboard/' + selectedUser);
        const pointsSnapshot = await window.db_get(pointsRef);
        const pointsData = pointsSnapshot.val() || {};
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

        // Format last updated time
        let lastUpdated = 'Never';
        if (profileData.lastUpdated) {
            lastUpdated = new Date(profileData.lastUpdated).toLocaleString();
        }

        // Check if image is Base64 (starts with data:image)
        const isBase64Image = profileData.pic && profileData.pic.startsWith('data:image');
        
        // Display profile
        adminProfileView.innerHTML = `
            <div class="profile-view">
                <img src="${profileData.pic || 'https://via.placeholder.com/80'}" 
                     alt="${selectedUser}'s Profile" 
                     class="profile-picture"
                     style="width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 10px; display: block; border: 2px solid #764ba2;">
                <h4 style="text-align: center; margin-bottom: 10px; color: #764ba2;">${selectedUser}</h4>
                
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #ccc; margin-bottom: 10px;">
                    <span>UID: ${profileData.uid || userUID}</span>
                    <span>Points: ${userPoints}</span>
                </div>
                
                <div class="profile-bio" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin: 10px 0; min-height: 60px;">
                    <strong>Bio:</strong><br>
                    ${profileData.bio || '<em style="color: #888;">No bio set</em>'}
                </div>
                
                <div style="font-size: 11px; color: #888; text-align: center;">
                    Last updated: ${lastUpdated}
                </div>
                
                ${isBase64Image ? `
                <div style="font-size: 10px; color: #4CAF50; text-align: center; margin-top: 5px;">
                    ✅ Custom image (Base64)
                </div>
                ` : profileData.pic ? `
                <div style="font-size: 10px; color: #666; text-align: center; margin-top: 5px;">
                    🔗 External image
                </div>
                ` : ''}
            </div>
        `;

    } catch (error) {
        console.error('Error loading profile:', error);
        adminProfileView.innerHTML = `
            <div style="text-align: center; color: #888; padding: 20px;">
                ❌ Error loading profile for ${selectedUser}<br>
                <small>${error.message}</small>
            </div>
        `;
    }
});
    

// Also update the reset leaderboard button to show for admin
if (loggedInUser === "admin") {
    const resetBtn = document.getElementById('reset-leaderboard');
    if (resetBtn) {
        resetBtn.style.display = 'inline-block';
    }
}

    }}

    // ===== Initialize Default Profiles =====
async function initializeUserProfiles() {
    const users = {
        "Amr": "001",
        "002": "002",
        "Kanamiz_Husband": "003",
        "Aizen_Husband": "004",
        "Mohamed": "005",
        "admin": "69",
        "TEST": "6969"
    };

    try {
        console.log('Checking and initializing user profiles...');
        
        for (const [username, uid] of Object.entries(users)) {
            const profileRef = window.db_ref(window.db, 'profiles/' + username);
            const snapshot = await window.db_get(profileRef);
            
            // If profile doesn't exist, create default one
            if (!snapshot.exists()) {
                await window.db_set(profileRef, {
                    username: username,
                    uid: uid,
                    pic: 'https://via.placeholder.com/80?text=' + username,
                    bio: '',
                    created: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                });
                console.log(`✅ Created default Firebase profile for ${username}`);
            } else {
                console.log(`✅ Profile already exists for ${username}`);
            }
        }
        console.log('Profile initialization completed!');
    } catch (error) {
        console.error('❌ Error initializing Firebase profiles:', error);
    }
}
