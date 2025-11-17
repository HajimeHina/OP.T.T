// ===== Session & Auth Management =====

// Get logged in user from sessionStorage
const loggedInUser = sessionStorage.getItem('loggedInUser');
const allUsers = ["Hemes", "002", "Kanamiz_Husband", "Aizen_Husband", "Mohamed", "TEST"];

// Check if we're on login page or main page
const currentPage = window.location.pathname.split('/').pop();

// ===== ITEMS DATABASE =====
const availableItems = {
    "wallpapers": {
        "jingliu": {
            name: "🌙 Jingliu Eclipse",
            videoUrl: "https://hajimehina.github.io/Jingliu_eclipse/jingliu-eclipse-of-the-moon.3840x2160.mp4",
            previewUrl: "https://via.placeholder.com/200x100/764ba2/white?text=Jingliu+Eclipse",
            rarity: "Epic",
            type: "wallpaper"
        },
        "arona": {
            name: "🏙️ Arona Classroom",
            videoUrl: "https://hajimehina.github.io/blindfolded_girl/arona-classroom-sky-blue-archive-moewalls-com.mp4",
            previewUrl: "https://hajimehina.github.io/blindfolded_girl/Screenshot%202025-11-17%20081621.png",
            rarity: "Epic",
            type: "wallpaper"
        }
    },
    "frames": {
        "golden_frame": {
            name: "✨ Golden Frame",
            description: "Exclusive golden border for your profile",
            previewUrl: "https://via.placeholder.com/200x100/FFD700/black?text=Golden+Frame",
            rarity: "Epic",
            type: "frame"
        },
        "crystal_frame": {
            name: "💎 Crystal Frame", 
            description: "Sparkling crystal border",
            previewUrl: "https://via.placeholder.com/200x100/00BCD4/white?text=Crystal+Frame",
            rarity: "Rare",
            type: "frame"
        }
    },
    "badges": {
        "vip_badge": {
            name: "⭐ VIP Badge",
            description: "Exclusive VIP status badge",
            previewUrl: "https://via.placeholder.com/200x100/FF9800/white?text=VIP+Badge",
            rarity: "Legendary",
            type: "badge"
        },
        "star_badge": {
            name: "🌟 Star Badge",
            description: "Shining star achievement badge",
            previewUrl: "https://via.placeholder.com/200x100/FFD700/black?text=Star+Badge",
            rarity: "Rare",
            type: "badge"
        }
    },
    "boosts": {
        "double_points": {
            name: "⚡ Double Points",
            description: "2x points for 24 hours",
            previewUrl: "https://via.placeholder.com/200x100/FF5722/white?text=2X+Points",
            rarity: "Epic",
            type: "boost",
            duration: "24h"
        },
        "soul_boost": {
            name: "💎 Soul Multiplier", 
            description: "2x souls for 12 hours",
            previewUrl: "https://via.placeholder.com/200x100/673AB7/white?text=2X+Souls",
            rarity: "Rare",
            type: "boost",
            duration: "12h"
        }
    }
};

// ===== LOGIN PAGE FUNCTIONALITY =====
if (currentPage === 'login.html') {
    const users = {
        "Hemes": "001",
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
    function initializeProfileManagement() {
        if (!loggedInUser || !document.getElementById('profile-panel')) return;
        
        const profilePic = document.getElementById('profile-pic');
        const profilePanel = document.getElementById('profile-panel');
        const picUpload = document.getElementById('pic-upload');
        const bioInput = document.getElementById('bio');
        const saveBtn = document.getElementById('save-profile');
        const uidEl = document.getElementById('uid');

        const users = {
            "Hemes": "001",
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
                console.log('Loading profile for:', loggedInUser);
                const profileRef = window.db_ref(window.db, 'profiles/' + loggedInUser);
                const snapshot = await window.db_get(profileRef);
                const profileData = snapshot.val() || {};
                
                console.log('Profile data loaded:', profileData);
                
                if (profileData.pic && profileData.pic !== profilePic.src) {
                    profilePic.src = profileData.pic;
                    console.log('Profile picture updated to:', profileData.pic);
                }
                if (profileData.bio && bioInput) bioInput.value = profileData.bio;
                
            } catch (error) {
                console.error('Error loading profile from Firebase:', error);
                // Set default placeholder if there's an error
                profilePic.src = 'https://via.placeholder.com/50?text=' + loggedInUser;
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

        // Load profile automatically - but wait a bit for Firebase to be ready
        setTimeout(() => {
            loadProfile();
        }, 1000);
    }

    // ===== Comprehensive Inventory System =====
    function initializeInventorySystem() {
        const inventoryBtn = document.getElementById('wallpaper-inventory-btn');
        const inventoryPanel = document.getElementById('inventory-panel');
        const closeInventoryBtn = document.getElementById('close-inventory');
        
        if (!inventoryBtn || !inventoryPanel) {
            console.log('Inventory elements not found');
            return;
        }
        
        // Open inventory
        inventoryBtn.addEventListener('click', () => {
            loadComprehensiveInventory();
            inventoryPanel.style.display = 'block';
        });
        
        // Close inventory
        closeInventoryBtn.addEventListener('click', () => {
            inventoryPanel.style.display = 'none';
        });
        
        // Close when clicking outside
        inventoryPanel.addEventListener('click', (e) => {
            if (e.target === inventoryPanel) {
                inventoryPanel.style.display = 'none';
            }
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('inventory-tab')) {
                // Remove active class from all tabs
                document.querySelectorAll('.inventory-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                // Add active class to clicked tab
                e.target.classList.add('active');
                
                // Load the selected tab
                const tabName = e.target.getAttribute('data-tab');
                loadInventoryTab(tabName);
            }
        });
    }

    // Load comprehensive user inventory
    async function loadComprehensiveInventory() {
        if (!loggedInUser) return;
        
        try {
            // Load all inventory types
            const inventoryPromises = [
                window.db_get(window.db_ref(window.db, 'wallpaperInventory/' + loggedInUser)),
                window.db_get(window.db_ref(window.db, 'profileFrames/' + loggedInUser)),
                window.db_get(window.db_ref(window.db, 'badges/' + loggedInUser)),
                window.db_get(window.db_ref(window.db, 'boosts/' + loggedInUser)),
                window.db_get(window.db_ref(window.db, 'users/' + loggedInUser))
            ];
            
            const results = await Promise.all(inventoryPromises);
            
            const wallpapers = results[0].val() || {};
            const frames = results[1].val() || {};
            const badges = results[2].val() || {};
            const boosts = results[3].val() || {};
            const userData = results[4].val() || {};
            
            const equippedWallpaper = userData.equippedWallpaper || 'jingliu';
            const equippedFrame = userData.equippedFrame || 'none';
            const equippedBadge = userData.equippedBadge || 'none';
            
            // Store for use in display functions
            window.userInventory = {
                wallpapers, frames, badges, boosts
            };
            window.equippedItems = {
                wallpaper: equippedWallpaper,
                frame: equippedFrame,
                badge: equippedBadge
            };
            
            // Load default tab
            loadInventoryTab('wallpapers');
            
        } catch (error) {
            console.error('Error loading comprehensive inventory:', error);
        }
    }

    // Load specific inventory tab
    async function loadInventoryTab(tabName) {
        const contentDiv = document.getElementById('inventory-content');
        if (!contentDiv) return;
        
        let items = [];
        let equippedId = '';
        
        switch(tabName) {
            case 'wallpapers':
                items = Object.entries(window.userInventory?.wallpapers || {});
                equippedId = window.equippedItems?.wallpaper;
                break;
            case 'frames':
                items = Object.entries(window.userInventory?.frames || {});
                equippedId = window.equippedItems?.frame;
                break;
            case 'badges':
                items = Object.entries(window.userInventory?.badges || {});
                equippedId = window.equippedItems?.badge;
                break;
            case 'boosts':
                items = Object.entries(window.userInventory?.boosts || {});
                break;
        }
        
        if (items.length === 0) {
            contentDiv.innerHTML = `
                <div style="text-align: center; color: #888; padding: 40px;">
                    No ${tabName} in your inventory yet.<br>
                    <a href="souls.html" style="color: #764ba2; text-decoration: underline;">Visit the Souls Shop</a> to purchase some!
                </div>
            `;
            return;
        }
        
        let itemsHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">';
        
        items.forEach(([itemId, itemData]) => {
            const isEquipped = itemId === equippedId;
            const itemInfo = getItemInfo(itemId, tabName);
            
            if (!itemInfo) return;
            
            itemsHtml += `
                <div class="inventory-item" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; text-align: center; border: 2px solid ${isEquipped ? '#FFD700' : '#444'};">
                    <img src="${itemInfo.previewUrl}" alt="${itemInfo.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                    <div style="font-weight: bold; margin-bottom: 5px; color: white;">${itemInfo.name}</div>
                    <div style="font-size: 12px; color: #ccc; margin-bottom: 5px;">${getRarityColor(itemInfo.rarity)}</div>
                    ${itemInfo.description ? `<div style="font-size: 11px; color: #aaa; margin-bottom: 10px;">${itemInfo.description}</div>` : ''}
                    ${itemInfo.duration ? `<div style="font-size: 11px; color: #4CAF50; margin-bottom: 10px;">⏰ ${itemInfo.duration}</div>` : ''}
                    ${tabName !== 'boosts' ? 
                        `<button class="equip-btn" data-type="${tabName}" data-id="${itemId}" ${isEquipped ? 'disabled' : ''}
                         style="width: 100%; padding: 8px; background: ${isEquipped ? '#4CAF50' : '#764ba2'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            ${isEquipped ? '✅ Equipped' : 'Equip'}
                        </button>` :
                        `<button class="use-boost" data-id="${itemId}"
                         style="width: 100%; padding: 8px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Use Boost
                        </button>`
                    }
                </div>
            `;
        });
        
        itemsHtml += '</div>';
        contentDiv.innerHTML = itemsHtml;
        
        // Add equip event listeners
        document.querySelectorAll('.equip-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const id = e.target.dataset.id;
                equipItem(type, id);
            });
        });
        
        // Add boost use event listeners
        document.querySelectorAll('.use-boost').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                useBoost(id);
            });
        });
    }

    // Helper function to get item info
    function getItemInfo(itemId, type) {
        return availableItems[type]?.[itemId] || null;
    }

    // Helper function to get rarity color
    function getRarityColor(rarity) {
        const colors = {
            'Common': '#4CAF50',
            'Rare': '#2196F3', 
            'Epic': '#9C27B0',
            'Legendary': '#FF9800'
        };
        return `<span style="color: ${colors[rarity] || '#ccc'}">${rarity}</span>`;
    }

    // Equip item
    async function equipItem(type, itemId) {
        if (!loggedInUser) return;
        
        try {
            let fieldName = '';
            switch(type) {
                case 'wallpapers':
                    fieldName = 'equippedWallpaper';
                    break;
                case 'frames':
                    fieldName = 'equippedFrame';
                    break;
                case 'badges':
                    fieldName = 'equippedBadge';
                    break;
            }
            
            if (!fieldName) return;
            
            // Save equipped item to user profile
            await window.db_set(window.db_ref(window.db, 'users/' + loggedInUser), {
                [fieldName]: itemId,
                lastUpdated: new Date().toISOString()
            });
            
            // If it's a wallpaper, change the background
            if (type === 'wallpapers') {
                const wallpaper = availableItems.wallpapers[itemId];
                if (wallpaper) {
                    const videoElement = document.getElementById('bg-video');
                    const sourceElement = videoElement.querySelector('source');
                    sourceElement.src = wallpaper.videoUrl;
                    videoElement.load();
                }
            }
            
            // Show success message
            const itemInfo = getItemInfo(itemId, type);
            alert(`✅ ${itemInfo?.name || 'Item'} equipped successfully!`);
            
            // Reload inventory to update equipped status
            loadComprehensiveInventory();
            
        } catch (error) {
            console.error('Error equipping item:', error);
            alert('❌ Error equipping item!');
        }
    }

    // Use boost
    async function useBoost(boostId) {
        if (!loggedInUser) return;
        
        try {
            const boostInfo = availableItems.boosts[boostId];
            if (!boostInfo) return;
            
            // Remove boost from inventory
            const boostRef = window.db_ref(window.db, 'boosts/' + loggedInUser + '/' + boostId);
            await window.db_set(boostRef, null);
            
            // Apply boost effect (you can implement boost logic here)
            alert(`🎯 ${boostInfo.name} activated! ${boostInfo.description}`);
            
            // Reload inventory
            loadComprehensiveInventory();
            
        } catch (error) {
            console.error('Error using boost:', error);
            alert('❌ Error using boost!');
        }
    }

    // ===== Leaderboard Profile Tooltip System =====
    
    // Clean up old tooltips
    function cleanupTooltips() {
        const oldTooltips = document.querySelectorAll('.profile-tooltip');
        oldTooltips.forEach(tooltip => {
            tooltip.remove();
        });
    }

    // ===== Firebase Leaderboard =====
    function loadLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList || !window.db) return;

        // Clean up old tooltips first
        cleanupTooltips();

        const leaderboardRef = window.db_ref(window.db, "leaderboard");

        window.db_get(leaderboardRef).then(snapshot => {
            const data = snapshot.val() || {};

            // Build full leaderboard including 0-point users
            const fullBoard = allUsers.map(username => {
                return {
                    username: username,
                    points: data[username]?.points || 0,
                    souls: data[username]?.souls || 0
                };
            });

            // Sort by points descending (ranking based on points only)
            fullBoard.sort((a, b) => b.points - a.points);

            leaderboardList.innerHTML = "";

            fullBoard.forEach((entry, index) => {
                const li = document.createElement("li");
                li.className = "leaderboard-item";
                li.style.padding = "8px 0";
                li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
                li.style.position = "relative";
                li.style.cursor = "pointer";
                
                li.innerHTML = `
                    <strong>${index + 1}. ${entry.username}</strong><br>
                    🏆 ${entry.points} pts | 💎 ${entry.souls} souls
                `;
                leaderboardList.appendChild(li);

                // Create tooltip as a separate fixed element
                const tooltip = document.createElement("div");
                tooltip.className = "profile-tooltip";
                tooltip.id = `tooltip-${entry.username}`;
                tooltip.style.display = 'none';
                tooltip.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <img id="tooltip-pic-${entry.username}" src="https://via.placeholder.com/60?text=Loading" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 12px; border: 2px solid #444;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: white;">${entry.username}</h4>
                            <div class="uid" style="font-size: 12px; color: #888;">UID: <span id="tooltip-uid-${entry.username}">Loading...</span></div>
                        </div>
                    </div>
                    <div class="bio" id="tooltip-bio-${entry.username}" style="font-size: 13px; color: #ccc; line-height: 1.4;">Loading profile...</div>
                `;
                document.body.appendChild(tooltip);

                // Add hover events
                setupLeaderboardHover(li, entry.username);
            });
        }).catch(error => {
            console.error('Error loading leaderboard:', error);
        });
    }

    // Setup hover events for leaderboard items
    function setupLeaderboardHover(listItem, username) {
        let hoverTimeout;
        
        listItem.addEventListener('mouseenter', function(e) {
            hoverTimeout = setTimeout(() => {
                loadUserProfileForTooltip(username, listItem);
            }, 300);
        });
        
        listItem.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            const tooltip = document.getElementById(`tooltip-${username}`);
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });

        // Also handle tooltip hover to keep it visible
        const tooltip = document.getElementById(`tooltip-${username}`);
        if (tooltip) {
            tooltip.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
            });
            
            tooltip.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
            });
        }
    }

    // Load user profile for tooltip display
    async function loadUserProfileForTooltip(username, listItem) {
        try {
            const profileRef = window.db_ref(window.db, 'profiles/' + username);
            const snapshot = await window.db_get(profileRef);
            const profileData = snapshot.val() || {};
            
            const tooltip = document.getElementById(`tooltip-${username}`);
            const picElement = document.getElementById(`tooltip-pic-${username}`);
            const uidElement = document.getElementById(`tooltip-uid-${username}`);
            const bioElement = document.getElementById(`tooltip-bio-${username}`);
            
            if (profileData.pic) {
                picElement.src = profileData.pic;
            }
            
            if (profileData.uid) {
                uidElement.textContent = profileData.uid;
            }
            
            if (profileData.bio) {
                bioElement.textContent = profileData.bio;
            } else {
                bioElement.textContent = "No bio yet...";
            }
            
            // Position the tooltip relative to the list item
            if (tooltip && listItem) {
                const rect = listItem.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.top = `${rect.top}px`;
                tooltip.style.right = `${window.innerWidth - rect.left + 20}px`;
                tooltip.style.display = 'block';
                tooltip.style.zIndex = '1000';
            }
            
        } catch (error) {
            console.error('Error loading profile for tooltip:', error);
            const bioElement = document.getElementById(`tooltip-bio-${username}`);
            if (bioElement) {
                bioElement.textContent = "Error loading profile";
            }
        }
    }

    // ===== User Stats Management =====
    async function loadUserStats() {
        if (!loggedInUser) return;
        
        try {
            // Load both points and souls from leaderboard
            const userRef = window.db_ref(window.db, 'leaderboard/' + loggedInUser);
            const snapshot = await window.db_get(userRef);
            const userData = snapshot.val() || {};
            
            const userPoints = userData.points || 0;
            const userSouls = userData.souls || 0;
            
            console.log(`Loaded stats for ${loggedInUser}: ${userPoints} points, ${userSouls} souls`);
            
            // Update the display
            const pointsElement = document.getElementById('user-points');
            const soulsElement = document.getElementById('user-souls');
            
            if (pointsElement) pointsElement.textContent = userPoints;
            if (soulsElement) soulsElement.textContent = userSouls;
            
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    // ===== Initialize Default Profiles =====
    async function initializeUserProfiles() {
        const users = {
            "Hemes": "001",
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
            return true;
        } catch (error) {
            console.error('❌ Error initializing Firebase profiles:', error);
            return false;
        }
    }

    // ===== Initialize Default Items =====
    async function initializeDefaultItems() {
        const users = {
            "Hemes": "001",
            "002": "002",
            "Kanamiz_Husband": "003",
            "Aizen_Husband": "004",
            "Mohamed": "005",
            "admin": "69",
            "TEST": "6969"
        };

        try {
            console.log('Initializing default items for users...');
            
            for (const username of Object.keys(users)) {
                // Give Jingliu wallpaper to all users by default
                const wallpaperRef = window.db_ref(window.db, 'wallpaperInventory/' + username + '/jingliu');
                const wallpaperSnapshot = await window.db_get(wallpaperRef);
                
                if (!wallpaperSnapshot.exists()) {
                    await window.db_set(wallpaperRef, {
                        acquired: new Date().toISOString(),
                        source: "default"
                    });
                    console.log(`✅ Gave Jingliu wallpaper to ${username}`);
                }
                
                // Set default equipped wallpaper if not set
                const userRef = window.db_ref(window.db, 'users/' + username);
                const userSnapshot = await window.db_get(userRef);
                
                if (!userSnapshot.exists() || !userSnapshot.val().equippedWallpaper) {
                    await window.db_set(window.db_ref(window.db, 'users/' + username + '/equippedWallpaper'), 'jingliu');
                    console.log(`✅ Set default wallpaper for ${username}`);
                }
            }
            console.log('Default items initialization completed!');
        } catch (error) {
            console.error('❌ Error initializing default items:', error);
        }
    }

    // ===== Load Equipped Items =====
    async function loadEquippedItems() {
        if (!loggedInUser) return;
        
        try {
            const userRef = window.db_ref(window.db, 'users/' + loggedInUser);
            const snapshot = await window.db_get(userRef);
            const userData = snapshot.val() || {};
            
            const equippedWallpaper = userData.equippedWallpaper || 'jingliu';
            const wallpaper = availableItems.wallpapers[equippedWallpaper];
            
            if (wallpaper) {
                const videoElement = document.getElementById('bg-video');
                const sourceElement = videoElement.querySelector('source');
                if (sourceElement.src !== wallpaper.videoUrl) {
                    sourceElement.src = wallpaper.videoUrl;
                    videoElement.load();
                }
            }
            
        } catch (error) {
            console.error('Error loading equipped items:', error);
        }
    }

    // ===== Admin Management =====
    function setupAdminPanel() {
        const adminPanelBtn = document.getElementById('admin-panel-btn');
        const adminPanel = document.getElementById('admin-panel');
        
        // Show admin button only for admin user
        if (adminPanelBtn && loggedInUser === "admin") {
            adminPanelBtn.style.display = 'inline-block';
            
            adminPanelBtn.addEventListener('click', () => {
                adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
            });
        }
    }

    // ===== Admin Infinite Souls =====
    function setupAdminInfiniteSouls() {
        if (loggedInUser !== "admin") return;
        
        // Add infinite souls button to admin panel
        const adminPanel = document.getElementById('admin-panel');
        if (!adminPanel) return;
        
        // Create infinite souls button
        const infiniteSoulsBtn = document.createElement('button');
        infiniteSoulsBtn.innerHTML = '♾️ Get Infinite Souls';
        infiniteSoulsBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: black;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
            font-size: 14px;
        `;
        
        // Add it to the management tab
        const managementTab = document.getElementById('management-tab');
        if (managementTab) {
            managementTab.appendChild(infiniteSoulsBtn);
        }
        
        // Add click event
        infiniteSoulsBtn.addEventListener('click', giveAdminInfiniteSouls);
    }

    // Give admin infinite souls
    async function giveAdminInfiniteSouls() {
        if (loggedInUser !== "admin") return;
        
        try {
            const adminRef = window.db_ref(window.db, 'leaderboard/admin');
            
            // Set souls to a very high number (1 million)
            await window.db_update(adminRef, {
                souls: 1000000,
                lastUpdated: new Date().toISOString()
            });
            
            alert('✅ Infinite souls granted! You now have 1,000,000 souls!');
            loadUserStats(); // Refresh the display
            
        } catch (error) {
            console.error('Error giving infinite souls:', error);
            alert('❌ Error granting infinite souls!');
        }
    }

    // ===== Initialize Everything =====
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing application...');
        
        // Initialize profiles for all users
        initializeUserProfiles().then(() => {
            console.log('User profiles initialized, now setting up other features...');
            
            // Initialize default items
            initializeDefaultItems().then(() => {
                // Initialize profile management with a delay to ensure Firebase is ready
                setTimeout(() => {
                    initializeProfileManagement();
                }, 1500);
                
                // Initialize comprehensive inventory system
                initializeInventorySystem();
                
                // Load equipped items
                loadEquippedItems();
            });
            
            // Load user stats
            loadUserStats();
            
            // Refresh stats every 3 seconds
            setInterval(loadUserStats, 3000);
            
            // Load leaderboard and refresh every 2 seconds
            loadLeaderboard();
            setInterval(loadLeaderboard, 2000);

            // Setup admin panel if user is admin
            setupAdminPanel();
            
            // Setup infinite souls for admin
            setupAdminInfiniteSouls();
        });
    });
}
