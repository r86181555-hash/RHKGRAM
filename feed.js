import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

// Authentication Guard Interceptor
const activeUser = localStorage.getItem("RHKUser");
if (!activeUser) {
    window.location.href = "index.html";
}

const feedElement = document.getElementById("feed");

async function renderTimelineFeed() {
    try {
        feedElement.innerHTML = `
            <div style="text-align:center; padding: 40px; color: #737373;">
                <p>Synchronizing feed stream...</p>
            </div>
        `;

        const feedQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const feedSnapshot = await getDocs(feedQuery);

        feedElement.innerHTML = "";

        if (feedSnapshot.empty) {
            feedElement.innerHTML = `
                <div style="text-align:center; padding:60px 20px; color:#737373;">
                    <span style="font-size: 40px;">📭</span>
                    <h3 style="color:#fff; margin-top:10px; font-size:18px;">No Posts Available</h3>
                    <p style="font-size:14px; margin-top:4px;">Be the baseline voice and publish first.</p>
                </div>
            `;
            return;
        }

        feedSnapshot.forEach(documentInstance => {
            const dataNode = documentInstance.data();
            const fallbackAvatar = `https://i.pravatar.cc/150?u=${dataNode.username || 'default'}`;
            
            const cardMarkup = `
                <article class="post-card">
                    <div class="post-user-bar">
                        <img class="post-user-avatar" src="${fallbackAvatar}" alt="Profile avatar">
                        <span class="post-username-label">${dataNode.username || 'anonymous'}</span>
                    </div>
                    
                    <div class="post-media-frame">
                        <img class="post-main-img" src="${dataNode.image}" alt="Post content visual" loading="lazy">
                    </div>
                    
                    <div class="post-engagement-bar">
                        <div class="interaction-cluster">
                            <span class="action-trigger">🤍</span>
                            <span class="action-trigger">💬</span>
                            <span class="action-trigger">📤</span>
                        </div>
                        <span class="action-trigger">🔖</span>
                    </div>
                    
                    <div class="post-narrative">
                        <b>${dataNode.username || 'anonymous'}</b>
                        <p>${escapeHTML(dataNode.caption || '')}</p>
                    </div>
                </article>
            `;
            feedElement.innerHTML += cardMarkup;
        });
    } catch (pipelineError) {
        feedElement.innerHTML = `
            <div style="text-align:center; padding:40px; color:#ff4d4d;">
                <p>Failed to populate runtime timeline stream.</p>
            </div>
        `;
    }
}

// XSS Sanitization Utility
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Terminal Connection Disconnect Action Handling
const runtimeLogout = document.getElementById("headerLogoutBtn");
if (runtimeLogout) {
    runtimeLogout.addEventListener("click", () => {
        localStorage.removeItem("RHKUser");
        window.location.href = "index.html";
    });
}

// Core Execution Run
renderTimelineFeed();
