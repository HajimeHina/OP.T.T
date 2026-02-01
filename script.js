// ===== Session & Auth Management =====
const loggedInUser = sessionStorage.getItem('loggedInUser');
const allUsers = ["Hemes", "002", "Kanamiz_Husband", "Aizen_Husband", "Mohamed", "TEST"];
const currentPage = window.location.pathname.split('/').pop();

// ===== ITEMS DATABASE =====
const availableItems = {
    "wallpapers": {
        "jingliu": {
            name: "🌙 Jingliu Eclipse",
            videoUrl: "https://hajimehina.github.io/Jingliu_eclipse/jingliu-eclipse-of-the-moon.3840x2160.mp4",
            previewUrl: "https://hajimehina.github.io/Jingliu_eclipse/video-capture-t0000.00seg-6889.png",
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
        "Hemes": "001", "002": "002", "Kanamiz_Husband": "003", 
        "Aizen_Husband": "004", "Mohamed": "005", "admin": "69", "TEST": "6969"
    };

    if (loggedInUser) window.location.href = 'index.html';

    function login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error');

        if(users[username] && users[username] === password) {
            sessionStorage.setItem('loggedInUser', username);
            window.location.href = 'index.html';
        } else {
            errorDiv.style.color = 'red';
            errorDiv.textContent = 'Incorrect username or password!';
        }
    }

    window.login = login;

    document.getElementById('username').addEventListener('keypress', e => { 
        if(e.key === 'Enter') login(); 
    });
    document.getElementById('password').addEventListener('keypress', e => { 
        if(e.key === 'Enter') login(); 
    });

} 
// ===== MAIN PAGE FUNCTIONALITY =====
else if (currentPage === 'index.html' || currentPage === '') {
    
    if (!loggedInUser) window.location.href = 'login.html';

    // Display username
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
            "Hemes": "001", "002": "002", "Kanamiz_Husband": "003", 
            "Aizen_Husband": "004", "Mohamed": "005", "admin": "69", "TEST": "6969"
        };
        
        if (uidEl) uidEl.textContent = users[loggedInUser] || "000";

        // Load saved profile from Firebase
        async function loadProfile() {
            try {
                const profileRef = window.db_ref(window.db, 'profiles/' + loggedInUser);
                const snapshot = await window.db_get(profileRef);
                const profileData = snapshot.val() || {};
                
                if (profileData.pic && profileData.pic !== profilePic.src) {
                    profilePic.src = profileData.pic;
                }
                if (profileData.bio && bioInput) bioInput.value = profileData.bio;
                
            } catch (error) {
                console.error('Error loading profile from Firebase:', error);
                profilePic.src = 'https://via.placeholder.com/50?text=' + loggedInUser;
            }
        }

        // Click profile pic to toggle panel
        profilePic.addEventListener('click', () => {
            profilePanel.style.display = profilePanel.style.display === 'none' ? 'block' : 'none';
            loadProfile();
        });

        // Upload new pic and convert to Base64
        picUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Please select an image file!');
                return;
            }

            if (file.size > 1024 * 1024) {
                alert('Please select an image smaller than 1MB!');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
            }
            reader.onerror = function(error) {
                console.error('Error reading file:', error);
                alert('Error reading image file!');
            }
            reader.readAsDataURL(file);
        });

        // Save profile to Firebase
        saveBtn.addEventListener('click', async () => {
            try {
                const profileRef = window.db_ref(window.db, 'profiles/' + loggedInUser);
                const profileData = {
                    pic: profilePic.src,
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

        setTimeout(() => loadProfile(), 1000);
    }

    // ===== Comprehensive Inventory System =====
    function initializeInventorySystem() {
        const inventoryBtn = document.getElementById('wallpaper-inventory-btn');
        const inventoryPanel = document.getElementById('inventory-panel');
        const closeInventoryBtn = document.getElementById('close-inventory');
        
        if (!inventoryBtn || !inventoryPanel) return;
        
        inventoryBtn.addEventListener('click', () => {
            loadComprehensiveInventory();
            inventoryPanel.style.display = 'block';
        });
        
        closeInventoryBtn.addEventListener('click', () => {
            inventoryPanel.style.display = 'none';
        });
        
        inventoryPanel.addEventListener('click', (e) => {
            if (e.target === inventoryPanel) {
                inventoryPanel.style.display = 'none';
            }
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('inventory-tab')) {
                document.querySelectorAll('.inventory-tab').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                loadInventoryTab(e.target.getAttribute('data-tab'));
            }
        });
    }

    // Load comprehensive user inventory
    async function loadComprehensiveInventory() {
        if (!loggedInUser) return;
        
        try {
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
            
            window.userInventory = { wallpapers, frames, badges, boosts };
            window.equippedItems = {
                wallpaper: userData.equippedWallpaper || 'jingliu',
                frame: userData.equippedFrame || 'none',
                badge: userData.equippedBadge || 'none'
            };
            
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
        
        contentDiv.innerHTML = itemsHtml + '</div>';
        
        // Add event listeners
        document.querySelectorAll('.equip-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                equipItem(e.target.dataset.type, e.target.dataset.id);
            });
        });
        
        document.querySelectorAll('.use-boost').forEach(btn => {
            btn.addEventListener('click', (e) => {
                useBoost(e.target.dataset.id);
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
            'Common': '#4CAF50', 'Rare': '#2196F3', 'Epic': '#9C27B0', 'Legendary': '#FF9800'
        };
        return `<span style="color: ${colors[rarity] || '#ccc'}">${rarity}</span>`;
    }

    // Equip item
    async function equipItem(type, itemId) {
        if (!loggedInUser) return;
        
        try {
            let fieldName = '';
            switch(type) {
                case 'wallpapers': fieldName = 'equippedWallpaper'; break;
                case 'frames': fieldName = 'equippedFrame'; break;
                case 'badges': fieldName = 'equippedBadge'; break;
            }
            
            if (!fieldName) return;
            
            await window.db_set(window.db_ref(window.db, 'users/' + loggedInUser), {
                [fieldName]: itemId,
                lastUpdated: new Date().toISOString()
            });
            
            if (type === 'wallpapers') {
                const wallpaper = availableItems.wallpapers[itemId];
                if (wallpaper) {
                    try {
                        await setWallpaperVideo(wallpaper);
                    } catch (error) {
                        console.error('Failed to set wallpaper:', error);
                        alert('❌ Failed to load wallpaper video!');
                    }
                }
            }
            
            const itemInfo = getItemInfo(itemId, type);
            alert(`✅ ${itemInfo?.name || 'Item'} equipped successfully!`);
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
            
            await window.db_set(window.db_ref(window.db, 'boosts/' + loggedInUser + '/' + boostId), null);
            alert(`🎯 ${boostInfo.name} activated! ${boostInfo.description}`);
            loadComprehensiveInventory();
            
        } catch (error) {
            console.error('Error using boost:', error);
            alert('❌ Error using boost!');
        }
    }

    // ===== Leaderboard Profile Tooltip System =====
    let currentOpenTooltip = null;

    // Clean up old tooltips
    function cleanupTooltips() {
        document.querySelectorAll('.profile-tooltip').forEach(tooltip => tooltip.remove());
    }

    // ===== Firebase Leaderboard =====
    function loadLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList || !window.db) return;

        cleanupTooltips();

        const leaderboardRef = window.db_ref(window.db, "leaderboard");

        window.db_get(leaderboardRef).then(snapshot => {
            const data = snapshot.val() || {};

            const fullBoard = allUsers.map(username => ({
                username: username,
                points: data[username]?.points || 0,
                souls: data[username]?.souls || 0
            }));

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

                // Create tooltip
                const tooltip = document.createElement("div");
                tooltip.className = "profile-tooltip";
                tooltip.id = `tooltip-${entry.username}`;
                tooltip.style.display = 'none';
                tooltip.innerHTML = `
                    <button class="close-btn" onclick="closeTooltip('${entry.username}')">×</button>
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

                setupLeaderboardClick(li, entry.username);
            });
        }).catch(error => {
            console.error('Error loading leaderboard:', error);
        });
    }

    // Setup click events for leaderboard items
    function setupLeaderboardClick(listItem, username) {
        listItem.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (currentOpenTooltip === username) {
                closeTooltip(username);
                return;
            }
            
            if (currentOpenTooltip) closeTooltip(currentOpenTooltip);
            openTooltip(username, listItem);
        });
    }

    // Open tooltip
    async function openTooltip(username, listItem) {
        try {
            const [profileSnapshot, leaderboardSnapshot] = await Promise.all([
                window.db_get(window.db_ref(window.db, 'profiles/' + username)),
                window.db_get(window.db_ref(window.db, 'leaderboard/' + username))
            ]);
            
            const profileData = profileSnapshot.val() || {};
            const leaderboardData = leaderboardSnapshot.val() || {};
            const tooltip = document.getElementById(`tooltip-${username}`);
            
            if (tooltip) {
                const picElement = document.getElementById(`tooltip-pic-${username}`);
                const uidElement = document.getElementById(`tooltip-uid-${username}`);
                const bioElement = document.getElementById(`tooltip-bio-${username}`);
                
                if (profileData.pic) picElement.src = profileData.pic;
                if (profileData.uid) uidElement.textContent = profileData.uid;
                bioElement.textContent = profileData.bio || "No bio yet...";
                
                // Position tooltip
                const rect = listItem.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.top = `${rect.top}px`;
                tooltip.style.right = `${window.innerWidth - rect.left + 20}px`;
                tooltip.style.display = 'block';
                tooltip.style.zIndex = '1000';
                
                // Ensure tooltip stays within viewport
                const tooltipRect = tooltip.getBoundingClientRect();
                if (tooltipRect.top < 0) tooltip.style.top = '10px';
                if (tooltipRect.bottom > window.innerHeight) {
                    tooltip.style.top = `${window.innerHeight - tooltipRect.height - 10}px`;
                }
                
                listItem.classList.add('active');
                currentOpenTooltip = username;
            }
            
        } catch (error) {
            console.error('Error loading profile for tooltip:', error);
            const bioElement = document.getElementById(`tooltip-bio-${username}`);
            if (bioElement) bioElement.textContent = "Error loading profile";
        }
    }

    // Close specific tooltip
    function closeTooltip(username) {
        const tooltip = document.getElementById(`tooltip-${username}`);
        if (tooltip) tooltip.style.display = 'none';
        
        document.querySelectorAll('.leaderboard-item').forEach(item => {
            if (item.textContent.includes(username)) item.classList.remove('active');
        });
        
        if (currentOpenTooltip === username) currentOpenTooltip = null;
    }

    // Close all tooltips
    function closeAllTooltips() {
        document.querySelectorAll('.profile-tooltip').forEach(tooltip => {
            tooltip.style.display = 'none';
        });
        document.querySelectorAll('.leaderboard-item').forEach(item => {
            item.classList.remove('active');
        });
        currentOpenTooltip = null;
    }

    // Global click handler for tooltips
    document.addEventListener('click', function(e) {
        const clickedTooltip = e.target.closest('.profile-tooltip');
        const clickedCloseBtn = e.target.closest('.close-btn');
        const clickedLeaderboardItem = e.target.closest('.leaderboard-item');
        
        if (clickedTooltip && !clickedCloseBtn) return;
        if (clickedCloseBtn) {
            const tooltip = clickedCloseBtn.closest('.profile-tooltip');
            if (tooltip) closeTooltip(tooltip.id.replace('tooltip-', ''));
            return;
        }
        if (clickedLeaderboardItem) return;
        closeAllTooltips();
    });

    // Close tooltips when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllTooltips();
    });

    // Make closeTooltip function globally available
    window.closeTooltip = closeTooltip;

    // ===== User Stats Management =====
    async function loadUserStats() {
        if (!loggedInUser) return;
        
        try {
            const userRef = window.db_ref(window.db, 'leaderboard/' + loggedInUser);
            const snapshot = await window.db_get(userRef);
            const userData = snapshot.val() || {};
            
            const pointsElement = document.getElementById('user-points');
            const soulsElement = document.getElementById('user-souls');
            
            if (pointsElement) pointsElement.textContent = userData.points || 0;
            if (soulsElement) soulsElement.textContent = userData.souls || 0;
            
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    // ===== Initialize Default Profiles =====
    async function initializeUserProfiles() {
        const users = {
            "Hemes": "001", "002": "002", "Kanamiz_Husband": "003", 
            "Aizen_Husband": "004", "Mohamed": "005", "admin": "69", "TEST": "6969"
        };

        try {
            for (const [username, uid] of Object.entries(users)) {
                const profileRef = window.db_ref(window.db, 'profiles/' + username);
                const snapshot = await window.db_get(profileRef);
                
                if (!snapshot.exists()) {
                    await window.db_set(profileRef, {
                        username: username, uid: uid,
                        pic: 'https://via.placeholder.com/80?text=' + username,
                        bio: '', created: new Date().toISOString(),
                        lastUpdated: new Date().toISOString()
                    });
                }
            }
            return true;
        } catch (error) {
            console.error('❌ Error initializing Firebase profiles:', error);
            return false;
        }
    }

    // ===== Initialize Default Items =====
    async function initializeDefaultItems() {
        const users = {
            "Hemes": "001", "002": "002", "Kanamiz_Husband": "003", 
            "Aizen_Husband": "004", "Mohamed": "005", "admin": "69", "TEST": "6969"
        };

        try {
            for (const username of Object.keys(users)) {
                const wallpaperRef = window.db_ref(window.db, 'wallpaperInventory/' + username + '/jingliu');
                const wallpaperSnapshot = await window.db_get(wallpaperRef);
                
                if (!wallpaperSnapshot.exists()) {
                    await window.db_set(wallpaperRef, {
                        acquired: new Date().toISOString(), source: "default"
                    });
                }
                
                const userRef = window.db_ref(window.db, 'users/' + username);
                const userSnapshot = await window.db_get(userRef);
                
                if (!userSnapshot.exists() || !userSnapshot.val().equippedWallpaper) {
                    await window.db_set(window.db_ref(window.db, 'users/' + username + '/equippedWallpaper'), 'jingliu');
                }
            }
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
            
            if (wallpaper) await setWallpaperVideo(wallpaper);
            
        } catch (error) {
            console.error('Error loading equipped items:', error);
            const defaultWallpaper = availableItems.wallpapers.jingliu;
            await setWallpaperVideo(defaultWallpaper);
        }
    }

    // Set wallpaper video with proper loading
    async function setWallpaperVideo(wallpaper) {
        return new Promise((resolve, reject) => {
            const videoElement = document.getElementById('bg-video');
            videoElement.innerHTML = '';
            
            const sourceElement = document.createElement('source');
            sourceElement.src = wallpaper.videoUrl;
            sourceElement.type = 'video/mp4';
            videoElement.appendChild(sourceElement);
            videoElement.style.display = 'block';
            
            videoElement.addEventListener('loadeddata', function() {
                videoElement.play().then(resolve).catch(reject);
            });
            
            videoElement.addEventListener('error', reject);
            videoElement.load();
            
            setTimeout(() => {
                if (videoElement.readyState < 2) {
                    videoElement.style.display = 'block';
                    resolve();
                }
            }, 5000);
        });
    }

    // ===== Admin Management System =====
    function setupAdminPanel() {
        const adminPanelBtn = document.getElementById('admin-panel-btn');
        const adminPanel = document.getElementById('admin-panel');
        
        if (adminPanelBtn && loggedInUser === "admin") {
            adminPanelBtn.style.display = 'inline-block';
            
            adminPanelBtn.addEventListener('click', () => {
                adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
                if (adminPanel.style.display === 'block') loadAdminPanel();
            });
            
            setupAdminTabs();
            setupAdminFunctionality();
        }
    }

    function setupAdminTabs() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-tab')) {
                document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                const tabName = e.target.getAttribute('data-tab');
                document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');
                document.getElementById(`${tabName}-tab`).style.display = 'block';
            }
        });
    }

    function setupAdminFunctionality() {
        const applyBtn = document.getElementById('admin-apply');
        if (applyBtn) applyBtn.addEventListener('click', applyAdminChanges);
        
        const closeBtn = document.getElementById('admin-close');
        const closeProfilesBtn = document.getElementById('admin-close-profiles');
        if (closeBtn) closeBtn.addEventListener('click', () => document.getElementById('admin-panel').style.display = 'none');
        if (closeProfilesBtn) closeProfilesBtn.addEventListener('click', () => document.getElementById('admin-panel').style.display = 'none');
    }

    async function loadAdminPanel() {
        await loadAdminUserSelect();
        await loadAdminProfileSelect();
    }

    async function loadAdminUserSelect() {
        const userSelect = document.getElementById('admin-user-select');
        if (!userSelect) return;
        
        userSelect.innerHTML = '<option value="">Select User</option>';
        allUsers.forEach(username => {
            const option = document.createElement('option');
            option.value = username;
            option.textContent = username;
            userSelect.appendChild(option);
        });
    }

    async function loadAdminProfileSelect() {
        const profileSelect = document.getElementById('admin-profile-select');
        if (!profileSelect) return;
        
        profileSelect.innerHTML = '<option value="">Select User</option>';
        allUsers.forEach(username => {
            const option = document.createElement('option');
            option.value = username;
            option.textContent = username;
            profileSelect.appendChild(option);
        });
        
        profileSelect.addEventListener('change', async (e) => {
            const username = e.target.value;
            if (username) await loadUserProfileForAdmin(username);
        });
    }

    async function loadUserProfileForAdmin(username) {
        const profileView = document.getElementById('admin-profile-view');
        if (!profileView) return;
        
        try {
            const [profileSnapshot, leaderboardSnapshot] = await Promise.all([
                window.db_get(window.db_ref(window.db, 'profiles/' + username)),
                window.db_get(window.db_ref(window.db, 'leaderboard/' + username))
            ]);
            
            const profileData = profileSnapshot.val() || {};
            const leaderboardData = leaderboardSnapshot.val() || {};
            
            profileView.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px;">
                    <img src="${profileData.pic || 'https://via.placeholder.com/80?text=' + username}" 
                         alt="${username}" 
                         style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #444;">
                    <h4 style="margin: 10px 0 5px 0;">${username}</h4>
                    <div style="color: #888; font-size: 12px;">UID: ${profileData.uid || 'N/A'}</div>
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Bio:</strong>
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 5px; margin-top: 5px; font-size: 13px;">
                        ${profileData.bio || 'No bio yet...'}
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1; background: rgba(76,175,80,0.2); padding: 8px; border-radius: 5px; text-align: center;">
                        <strong>🏆 Points</strong><br>${leaderboardData.points || 0}
                    </div>
                    <div style="flex: 1; background: rgba(255,215,0,0.2); padding: 8px; border-radius: 5px; text-align: center;">
                        <strong>💎 Souls</strong><br>${leaderboardData.souls || 0}
                    </div>
                </div>
                <div style="font-size: 11px; color: #888;">
                    Last Updated: ${profileData.lastUpdated ? new Date(profileData.lastUpdated).toLocaleString() : 'Never'}
                </div>
            `;
            
        } catch (error) {
            console.error('Error loading profile for admin:', error);
            profileView.innerHTML = `<div style="text-align: center; color: #f44336;">Error loading profile for ${username}</div>`;
        }
    }

    async function applyAdminChanges() {
        const userSelect = document.getElementById('admin-user-select');
        const actionSelect = document.getElementById('admin-action');
        const pointsInput = document.getElementById('admin-points');
        const soulsActionSelect = document.getElementById('admin-souls-action');
        const soulsAmountInput = document.getElementById('admin-souls-amount');
        const messageDiv = document.getElementById('admin-message');
        
        const username = userSelect.value;
        if (!username) {
            showAdminMessage('Please select a user!', 'error');
            return;
        }
        
        const points = parseInt(pointsInput.value) || 0;
        const souls = parseInt(soulsAmountInput.value) || 0;
        
        if (points < 0 || souls < 0) {
            showAdminMessage('Values cannot be negative!', 'error');
            return;
        }
        
        try {
            const userRef = window.db_ref(window.db, 'leaderboard/' + username);
            const snapshot = await window.db_get(userRef);
            const currentData = snapshot.val() || { points: 0, souls: 0 };
            
            let newPoints = currentData.points || 0;
            let newSouls = currentData.souls || 0;
            
            // Process points
            switch(actionSelect.value) {
                case 'add': newPoints += points; break;
                case 'subtract': newPoints = Math.max(0, newPoints - points); break;
                case 'set': newPoints = points; break;
            }
            
            // Process souls
            switch(soulsActionSelect.value) {
                case 'add': newSouls += souls; break;
                case 'subtract': newSouls = Math.max(0, newSouls - souls); break;
                case 'set': newSouls = souls; break;
            }
            
            await window.db_set(userRef, {
                points: newPoints,
                souls: newSouls,
                lastUpdated: new Date().toISOString()
            });
            
            showAdminMessage(`✅ Successfully updated ${username}! Points: ${newPoints}, Souls: ${newSouls}`, 'success');
            loadLeaderboard();
            if (username === loggedInUser) loadUserStats();
            
        } catch (error) {
            console.error('Error applying admin changes:', error);
            showAdminMessage('❌ Error updating user data!', 'error');
        }
    }

    function showAdminMessage(message, type) {
        const messageDiv = document.getElementById('admin-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.style.color = type === 'success' ? '#4CAF50' : '#f44336';
            messageDiv.style.fontWeight = 'bold';
            setTimeout(() => messageDiv.textContent = '', 3000);
        }
    }

    // ===== Admin Infinite Souls =====
    function setupAdminInfiniteSouls() {
        if (loggedInUser !== "admin") return;
        
        const adminPanel = document.getElementById('admin-panel');
        if (!adminPanel) return;
        
        const infiniteSoulsBtn = document.createElement('button');
        infiniteSoulsBtn.innerHTML = '♾️ Get Infinite Souls';
        infiniteSoulsBtn.style.cssText = `
            width: 100%; padding: 12px; margin-top: 10px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: black; border: none; border-radius: 8px;
            cursor: pointer; font-weight: bold; font-size: 14px;
        `;
        
        const managementTab = document.getElementById('management-tab');
        if (managementTab) managementTab.appendChild(infiniteSoulsBtn);
        
        infiniteSoulsBtn.addEventListener('click', giveAdminInfiniteSouls);
    }

    // Give admin infinite souls
    async function giveAdminInfiniteSouls() {
        if (loggedInUser !== "admin") return;
        
        try {
            await window.db_update(window.db_ref(window.db, 'leaderboard/admin'), {
                souls: 1000000,
                lastUpdated: new Date().toISOString()
            });
            alert('✅ Infinite souls granted! You now have 1,000,000 souls!');
            loadUserStats();
        } catch (error) {
            console.error('Error giving infinite souls:', error);
            alert('❌ Error granting infinite souls!');
        }
    }

    // ===== Video Error Handling =====
    function setupVideoErrorHandling() {
        const videoElement = document.getElementById('bg-video');
        if (videoElement) {
            videoElement.addEventListener('error', function(e) {
                console.error('Video error:', e);
            });
        }
    }

    // ===== Initialize Everything =====
    document.addEventListener('DOMContentLoaded', function() {
        setupVideoErrorHandling();
        loadEquippedItems();
        
        initializeUserProfiles().then(() => {
            initializeDefaultItems().then(() => {
                setTimeout(() => initializeProfileManagement(), 1500);
                initializeInventorySystem();
            });
            
            loadUserStats();
            setInterval(loadUserStats, 3000);
            loadLeaderboard();
            setInterval(loadLeaderboard, 2000);
            setupAdminPanel();
            setupAdminInfiniteSouls();
        });
    });
}

// ===== QUIZ PAGE FUNCTIONALITY =====
// ===== QUIZ LOADER FUNCTION =====
// ===== QUIZ DATA LOADER =====
async function loadQuizData(subject, quizId) {
    try {
        console.log(`Loading quiz: ${subject}/${quizId}`);
        
        // Try to load from Firebase first (optional caching)
        const firebaseQuiz = await tryLoadQuizFromFirebase(subject, quizId);
        if (firebaseQuiz) {
            console.log('Loaded quiz from Firebase');
            return firebaseQuiz;
        }
        
        // Fallback to local file
        console.log('Loading from local file...');
        const response = await fetch(`quizzes/${subject}/${quizId}.js`);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`Quiz not found: ${subject}/${quizId}`);
        }
        
        const scriptText = await response.text();
        console.log('Script loaded successfully');
        
        // Parse the quiz data from the script
        const quizData = extractQuizData(scriptText);
        
        if (!quizData) {
            throw new Error('Failed to parse quiz data');
        }
        
        // Cache in Firebase for future use
        await cacheQuizInFirebase(subject, quizId, quizData);
        
        return quizData;
        
    } catch (error) {
        console.error('Error loading quiz:', error);
        return getDefaultQuiz(subject, quizId);
    }
}

// Helper function to extract quiz data from script
function extractQuizData(scriptText) {
    // Try to find the quiz variable declaration
    const match = scriptText.match(/const\s+(\w+)\s*=\s*({[\s\S]*?});/);
    
    if (match) {
        const varName = match[1];
        const jsonStr = match[2];
        
        try {
            // Create a function that returns the quiz object
            const func = new Function(`return ${jsonStr}`);
            const quizData = func();
            
            // Add the variable name to the quiz data for reference
            quizData.varName = varName;
            
            return quizData;
        } catch (e) {
            console.error('Error parsing quiz JSON:', e);
        }
    }
    
    // Fallback: try to extract from assignment
    try {
        const lines = scriptText.split('\n');
        for (const line of lines) {
            if (line.includes('const') && line.includes('Quiz') && line.includes('=')) {
                const start = line.indexOf('{');
                const end = line.lastIndexOf('}') + 1;
                if (start !== -1 && end !== -1) {
                    const jsonStr = line.substring(start, end);
                    return JSON.parse(jsonStr);
                }
            }
        }
    } catch (e) {
        console.error('Alternative parsing failed:', e);
    }
    
    return null;
}

// Optional: Cache quiz in Firebase
async function cacheQuizInFirebase(subject, quizId, quizData) {
    if (!window.db) return;
    
    try {
        const quizRef = window.db_ref(window.db, `quizCache/${subject}/${quizId}`);
        await window.db_set(quizRef, {
            ...quizData,
            cachedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Failed to cache quiz:', error);
    }
}

// Optional: Try loading from Firebase cache
async function tryLoadQuizFromFirebase(subject, quizId) {
    if (!window.db) return null;
    
    try {
        const quizRef = window.db_ref(window.db, `quizCache/${subject}/${quizId}`);
        const snapshot = await window.db_get(quizRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Remove Firebase metadata fields
            delete data.cachedAt;
            delete data.lastUpdated;
            return data;
        }
    } catch (error) {
        console.error('Error loading from Firebase cache:', error);
    }
    
    return null;
}

// Fallback default quiz
function getDefaultQuiz(subject, quizId) {
    console.log('Using default quiz');
    return {
        id: quizId,
        name: quizId.replace('-', ' ').toUpperCase(),
        subject: subject,
        author: "System",
        difficulty: "Medium",
        description: "Quiz data could not be loaded",
        questions: [
            {
                question: "Sample question 1",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct: 0,
                explanation: "This is a sample explanation",
                category: "General"
            },
            {
                question: "Sample question 2",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct: 1,
                explanation: "This is another sample explanation",
                category: "General"
            }
        ]
    };
}



// ===== UPDATED QUIZ PAGE FUNCTIONALITY =====
if (currentPage === 'quiz.html') {
    if (!loggedInUser) window.location.href = 'login.html';

    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject') || 'math';
    const quizId = urlParams.get('quiz') || 'default';
    
    let currentQuiz = null;
    let currentQuestion = 0;
    let score = 0;
    let timeStarted = null;
    let timeLimit = null;

    // Initialize quiz
    document.addEventListener('DOMContentLoaded', async function() {
        await initializeQuiz();
        setupEventListeners();
    });

    async function initializeQuiz() {
        // Load quiz data
        currentQuiz = await loadQuizData(subject, quizId);
        
        // Set up UI
        const quizTitle = document.getElementById('quiz-title');
        const quizInfo = document.getElementById('quiz-info');
        const difficultyEl = document.getElementById('quiz-difficulty');
        const authorEl = document.getElementById('quiz-author');
        const descriptionEl = document.getElementById('quiz-description');
        
        if (quizTitle) quizTitle.textContent = currentQuiz.name;
        if (quizInfo) quizInfo.textContent = `${currentQuiz.questions.length} questions • ${currentQuiz.difficulty}`;
        if (difficultyEl) {
            difficultyEl.textContent = currentQuiz.difficulty;
            difficultyEl.className = `difficulty-${currentQuiz.difficulty.toLowerCase()}`;
        }
        if (authorEl) {
            authorEl.textContent = `by ${currentQuiz.author}`;
            authorEl.className = `author-${currentQuiz.author.toLowerCase()}`;
        }
        if (descriptionEl) descriptionEl.textContent = currentQuiz.description;
        
        // Start timer
        timeStarted = new Date();
        timeLimit = calculateTimeLimit(currentQuiz.difficulty, currentQuiz.questions.length);
        
        // Display first question
        displayQuestion();
        updateProgress();
        startTimer();
    }

    function calculateTimeLimit(difficulty, questionCount) {
        const baseTime = questionCount * 60; // 60 seconds per question
        const difficultyMultiplier = {
            "Easy": 1.2,
            "Medium": 1.0,
            "Hard": 0.8
        };
        return Math.floor(baseTime * (difficultyMultiplier[difficulty] || 1));
    }

    function startTimer() {
        const timerElement = document.getElementById('quiz-timer');
        if (!timerElement) return;
        
        function updateTimer() {
            const now = new Date();
            const elapsedSeconds = Math.floor((now - timeStarted) / 1000);
            const remainingSeconds = Math.max(0, timeLimit - elapsedSeconds);
            
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (remainingSeconds <= 60) {
                timerElement.style.color = '#f44336';
            } else if (remainingSeconds <= 180) {
                timerElement.style.color = '#FF9800';
            } else {
                timerElement.style.color = '#4CAF50';
            }
            
            if (remainingSeconds <= 0) {
                endQuiz();
            }
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    function displayQuestion() {
        const questionEl = document.getElementById('question');
        const optionsEl = document.getElementById('options');
        const questionNumberEl = document.getElementById('question-number');
        const categoryEl = document.getElementById('question-category');

        if (!questionEl || !optionsEl || currentQuestion >= currentQuiz.questions.length) {
            endQuiz();
            return;
        }

        const q = currentQuiz.questions[currentQuestion];

        questionNumberEl.textContent = `Question ${currentQuestion + 1}`;
        questionEl.textContent = q.question;
        
        if (categoryEl) {
            categoryEl.textContent = q.category;
            categoryEl.style.display = 'inline-block';
        }

        optionsEl.innerHTML = '';
        q.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.innerHTML = `
                <span class="option-number">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
            `;
            button.onclick = () => selectOption(index);
            optionsEl.appendChild(button);
        });

        // Clear previous feedback
        const feedbackEl = document.getElementById('feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }

        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('explanation').style.display = 'none';
    }

    function selectOption(selectedIndex) {
        const q = currentQuiz.questions[currentQuestion];
        const options = document.querySelectorAll('.option');
        const feedbackEl = document.getElementById('feedback');
        const explanationEl = document.getElementById('explanation');

        // Disable all buttons
        options.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
        });

        // Check answer
        if (selectedIndex === q.correct) {
            score++;
            options[selectedIndex].classList.add('correct');
            if (feedbackEl) {
                feedbackEl.innerHTML = '✅ <strong>Correct!</strong>';
                feedbackEl.className = 'feedback correct';
            }
        } else {
            options[selectedIndex].classList.add('wrong');
            options[q.correct].classList.add('correct');
            if (feedbackEl) {
                feedbackEl.innerHTML = '❌ <strong>Incorrect</strong>';
                feedbackEl.className = 'feedback wrong';
            }
        }

        // Show explanation
        if (explanationEl) {
            explanationEl.innerHTML = `
                <strong>Explanation:</strong> ${q.explanation}
                ${q.category ? `<div style="margin-top: 5px; font-size: 0.9em; color: #888;">Category: ${q.category}</div>` : ''}
            `;
            explanationEl.style.display = 'block';
        }

        document.getElementById('next-btn').style.display = 'inline-block';
        updateScore();
    }

    function nextQuestion() {
        currentQuestion++;
        if (currentQuestion < currentQuiz.questions.length) {
            displayQuestion();
            updateProgress();
        } else {
            endQuiz();
        }
    }

    function updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar && progressText) {
            const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${currentQuestion + 1}/${currentQuiz.questions.length}`;
        }
    }

    function updateScore() {
        const scoreEl = document.getElementById('score');
        if (scoreEl) {
            scoreEl.textContent = `Score: ${score}`;
        }
    }

    async function endQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;
        
        const timeEnded = new Date();
        const timeTaken = Math.floor((timeEnded - timeStarted) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        
        const percentage = Math.round((score / currentQuiz.questions.length) * 100);
        
        quizContainer.innerHTML = `
            <div class="quiz-results">
                <h2>Quiz Complete! 🎉</h2>
                <div class="score-display">
                    <div class="final-score">${percentage}%</div>
                    <div class="score-details">
                        ${score} out of ${currentQuiz.questions.length} correct
                    </div>
                    <div class="time-taken">
                        ⏱️ Time: ${minutes}m ${seconds}s
                    </div>
                </div>
                
                <div class="quiz-performance">
                    <h3>${getPerformanceMessage(percentage)}</h3>
                    <p>You completed <strong>${currentQuiz.name}</strong> ${getDifficultyEmoji(currentQuiz.difficulty)}</p>
                </div>
                
                <div class="quiz-stats-grid">
                    <div class="stat-box">
                        <div class="stat-value">${percentage}%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${timeTaken}s</div>
                        <div class="stat-label">Time Taken</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${score}</div>
                        <div class="stat-label">Correct Answers</div>
                    </div>
                </div>
                
                <div class="quiz-actions">
                    <button onclick="window.location.href='quiz.html?subject=${subject}&quiz=${quizId}'" class="quiz-btn retake-btn">
                        🔄 Retake Quiz
                    </button>
                    <button onclick="window.location.href='subjects.html'" class="quiz-btn subjects-btn">
                        📚 More Quizzes
                    </button>
                    <button onclick="window.location.href='index.html'" class="quiz-btn home-btn">
                        🏠 Back to Home
                    </button>
                </div>
            </div>
        `;

        // Award points and save results
        await saveQuizResults(percentage, timeTaken);
    }

    function getPerformanceMessage(percentage) {
        if (percentage >= 90) return "🏆 Master Level! Outstanding performance!";
        if (percentage >= 75) return "🎯 Excellent! You really know your stuff!";
        if (percentage >= 60) return "👍 Good Job! Solid understanding!";
        if (percentage >= 50) return "💪 Decent effort! Keep practicing!";
        return "📚 Room for improvement! Study more and try again!";
    }

    function getDifficultyEmoji(difficulty) {
        const emojis = {
            "Easy": "😊",
            "Medium": "😐",
            "Hard": "😰"
        };
        return emojis[difficulty] || "📝";
    }

    async function saveQuizResults(percentage, timeTaken) {
        if (!loggedInUser) return;

        const pointsEarned = calculatePoints(percentage, currentQuiz.difficulty);
        
        try {
            // Save to user's quiz history
            const historyRef = window.db_ref(window.db, `quizHistory/${loggedInUser}/${currentQuiz.id}`);
            await window.db_set(historyRef, {
                quizId: currentQuiz.id,
                quizName: currentQuiz.name,
                subject: currentQuiz.subject,
                score: percentage,
                pointsEarned: pointsEarned,
                timeTaken: timeTaken,
                completedAt: new Date().toISOString(),
                attemptNumber: await getAttemptNumber()
            });

            // Update leaderboard points
            const userRef = window.db_ref(window.db, 'leaderboard/' + loggedInUser);
            const snapshot = await window.db_get(userRef);
            const currentData = snapshot.val() || { points: 0, souls: 0 };
            
            await window.db_update(userRef, {
                points: (currentData.points || 0) + pointsEarned,
                lastQuiz: new Date().toISOString(),
                totalQuizzes: (currentData.totalQuizzes || 0) + 1
            });

            // Show notification
            const notification = document.createElement('div');
            notification.className = 'points-notification';
            notification.innerHTML = `+${pointsEarned} points earned!`;
            document.querySelector('.quiz-results').appendChild(notification);
            
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    }

    function calculatePoints(percentage, difficulty) {
        const basePoints = Math.floor(percentage / 10) * 5;
        const difficultyMultiplier = {
            "Easy": 0.8,
            "Medium": 1.2,
            "Hard": 1.5
        };
        return Math.round(basePoints * (difficultyMultiplier[difficulty] || 1));
    }

    async function getAttemptNumber() {
        if (!loggedInUser) return 1;
        
        try {
            const historyRef = window.db_ref(window.db, `quizHistory/${loggedInUser}/${currentQuiz.id}`);
            const snapshot = await window.db_get(historyRef);
            return snapshot.exists() ? (snapshot.val().attemptNumber || 0) + 1 : 1;
        } catch {
            return 1;
        }
    }

    function setupEventListeners() {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', nextQuestion);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key >= '1' && e.key <= '4') {
                const index = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.option');
                if (options[index] && !options[index].disabled) {
                    selectOption(index);
                }
            }
            if (e.key === 'Enter') {
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn && nextBtn.style.display !== 'none') {
                    nextQuestion();
                }
            }
        });
    }
}
