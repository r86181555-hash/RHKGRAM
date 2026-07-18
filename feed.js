import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc, setDoc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
  authDomain: "rhk-app-e34c6.firebaseapp.com",
  projectId: "rhk-app-e34c6",
  storageBucket: "rhk-app-e34c6.firebasestorage.app",
  messagingSenderId: "1016565109006",
  appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f",
  measurementId: "G-814PTRRQVQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const activeUser = localStorage.getItem("RHKUser");
if (!activeUser) { window.location.href = "index.html"; }

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const feedElement = document.getElementById("feed");
const dynamicStoriesContainer = document.getElementById("dynamicStoriesContainer");
const storyFileInput = document.getElementById("storyFileInput");
const currentUserStoryNode = document.getElementById("currentUserStoryNode");
const currentUserStoryAvatar = document.getElementById("currentUserStoryAvatar");

// Story Viewing Modal Targets
const storyModal = document.getElementById("storyModal");
const storyModalBar = document.getElementById("storyModalBar");
const storyModalAvatar = document.getElementById("storyModalAvatar");
const storyModalUser = document.getElementById("storyModalUser");
const storyModalImage = document.getElementById("storyModalImage");
const storyModalClose = document.getElementById("storyModalClose");

let cachedProfiles = {};
let storyTimeoutId = null;

async function fetchUserProfileData(username) {
    if (cachedProfiles[username]) return cachedProfiles[username];
    try {
        const pRef = doc(db, "profiles", username);
        const pSnap = await getDoc(pRef);
        if (pSnap.exists()) {
            cachedProfiles[username] = pSnap.data();
            return cachedProfiles[username];
        }
    } catch(e) {}
    return { username, avatar: `https://i.pravatar.cc/150?u=${username}`, bio: "" };
}

async function renderLifecycleComponents() {
    const myProfile = await fetchUserProfileData(activeUser);
    if(currentUserStoryAvatar) currentUserStoryAvatar.src = myProfile.avatar;
    
    await loadStoriesTrack();
    await loadTimelineFeed();
}

async function loadStoriesTrack() {
    if(!dynamicStoriesContainer) return;
    try {
        const sQuery = query(collection(db, "stories"), orderBy("createdAt", "desc"));
        const sSnapshot = await getDocs(sQuery);
        dynamicStoriesContainer.innerHTML = "";
        
        const strictTimeBoundary = Date.now() - (24 * 60 * 60 * 1000); // 24 Hours filter context logic
        let uniqueTrackUsers = new Set();
        
        sSnapshot.forEach(item => {
            const data = item.data();
            const createdMs = data.createdAt ? data.createdAt.toMillis() : Date.now();
            
            if (createdMs > strictTimeBoundary && data.username !== activeUser) {
                if (!uniqueTrackUsers.has(data.username)) {
                    uniqueTrackUsers.add(data.username);
                    buildStoryItemUI(data.username, data.image);
                }
            }
        });
    } catch(err) {}
}

async function buildStoryItemUI(username, imageUrl) {
    const prof = await fetchUserProfileData(username);
    const node = document.createElement("div");
    node.className = "story-node";
    node.innerHTML = `
        <div class="story-ring"><img src="${prof.avatar}" alt="${username}"></div>
        <div class="story-label">${username}</div>
    `;
    node.addEventListener("click", () => activateStoryModal(username, imageUrl, prof.avatar));
    dynamicStoriesContainer.appendChild(node);
}

if(currentUserStoryNode) {
    currentUserStoryNode.addEventListener("click", () => storyFileInput.click());
}

if(storyFileInput) {
    storyFileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        
        try {
            currentUserStoryNode.style.opacity = "0.4";
            const formPack = new FormData();
            formPack.append("file", file);
            formPack.append("upload_preset", UPLOAD_PRESET);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST", body: formPack
            });
            const data = await res.json();
            
            if(data.secure_url) {
                await addDoc(collection(db, "stories"), {
                    username: activeUser,
                    image: data.secure_url,
                    createdAt: serverTimestamp()
                });
                alert("Story asset deployed successfully.");
                await loadStoriesTrack();
            }
        } catch(e) {
            alert("Story asset distribution network fault.");
        } finally {
            currentUserStoryNode.style.opacity = "1";
        }
    });
}

function activateStoryModal(username, src, avatar) {
    if(!storyModal) return;
    storyModalAvatar.src = avatar;
    storyModalUser.innerText = username;
    storyModalImage.src = src;
    storyModal.style.display = "flex";
    
    storyModalBar.style.width = "0%";
    let startTime = null;
    const duration = 4000;
    
    function animateProgress(timestamp) {
        if (!startTime) startTime = timestamp;
        const runtime = timestamp - startTime;
        const progressPct = Math.min((runtime / duration) * 100, 100);
        storyModalBar.style.width = `${progressPct}%`;
        
        if (runtime < duration) {
            storyTimeoutId = requestAnimationFrame(animateProgress);
        } else {
            closeStoryModalViewport();
        }
    }
    storyTimeoutId = requestAnimationFrame(animateProgress);
}

function closeStoryModalViewport() {
    if(storyTimeoutId) {
        cancelAnimationFrame(storyTimeoutId);
        storyTimeoutId = null;
    }
    if(storyModal) storyModal.style.display = "none";
}

if(storyModalClose) storyModalClose.addEventListener("click", closeStoryModalViewport);

async function loadTimelineFeed() {
    if(!feedElement) return;
    try {
        feedElement.innerHTML = `<div style="text-align:center;padding:40px;color:#737373;">Syncing ecosystem feed pipeline...</div>`;
        const fQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(fQuery);
        feedElement.innerHTML = "";

        if (snapshot.empty) {
            feedElement.innerHTML = `
                <div style="text-align:center; padding:60px 20px; color:#737373;">
                    <span style="font-size: 32px;">📭</span>
                    <h3 style="color:#fff; margin-top:8px; font-size:16px;">Timeline Feed Empty</h3>
                </div>
            `;
            return;
        }

        for (const docInstance of snapshot.docs) {
            const data = docInstance.data();
            const profile = await fetchUserProfileData(data.username);
            
            const cardMarkup = `
                <article class="post-card">
                    <div class="post-header">
                        <img class="post-avatar" src="${profile.avatar}" alt="DP">
                        <span class="post-user">${data.username || 'anonymous'}</span>
                    </div>
                    <div class="post-frame">
                        <img class="post-img" src="${data.image}" alt="Media Content" loading="lazy">
                    </div>
                    <div class="post-actions">
                        <div class="post-actions-left"><span>🤍</span><span>💬</span><span>📤</span></div>
                        <span>🔖</span>
                    </div>
                    <div class="post-caption">
                        <b>${data.username || 'anonymous'}</b>
                        <p>${escapeHTML(data.caption || '')}</p>
                    </div>
                </article>
            `;
            feedElement.innerHTML += cardMarkup;
        }
    } catch (e) {
        feedElement.innerHTML = `<div style="text-align:center;padding:20px;color:#ff4d4d;">Timeline compilation tracking structural fault.</div>`;
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
}

const runtimeLogout = document.getElementById("headerLogoutBtn");
if (runtimeLogout) {
    runtimeLogout.addEventListener("click", () => {
        localStorage.removeItem("RHKUser");
        window.location.href = "index.html";
    });
}

renderLifecycleComponents();

