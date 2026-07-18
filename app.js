import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

if (!localStorage.getItem("RHKUser") && !window.location.pathname.includes("index.html") && !window.location.pathname.includes("signup.html")) {
    window.location.href = "index.html";
}

// Helper to ensure user metadata structure exists
async function initializeUserMetadata(username) {
    const metaRef = doc(db, "profiles", username);
    const metaSnap = await getDoc(metaRef);
    if (!metaSnap.exists()) {
        await setDoc(metaRef, {
            username: username,
            avatar: `https://i.pravatar.cc/150?u=${username}`,
            bio: "Hello, I am using RHK Application Network System Model."
        });
    }
}

const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
        const username = document.getElementById("signupUsername").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value.trim();
        const msg = document.getElementById("signupMessage");

        if (!username || !password) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Provide complete registration arguments.";
            return;
        }

        try {
            msg.style.color = "#a8a8a8";
            msg.innerText = "Verifying target unique identity entry availability...";
            const userRef = doc(db, "users", username);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                msg.style.color = "#ff4d4d";
                msg.innerText = "Identity record string entry key conflict.";
                return;
            }

            await setDoc(userRef, { username, password });
            await initializeUserMetadata(username);
            
            msg.style.color = "lightgreen";
            msg.innerText = "System identity operational structure active. Shifting view...";
            setTimeout(() => { window.location.href = "index.html"; }, 1200);
        } catch (err) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Transmission validation structure crash.";
        }
    });
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const username = document.getElementById("loginUsername").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value.trim();
        const msg = document.getElementById("loginMessage");

        if (!username || !password) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Credentials entry vectors missing components.";
            return;
        }

        try {
            msg.style.color = "#a8a8a8";
            msg.innerText = "Authorizing dynamic signature validations...";
            const userRef = doc(db, "users", username);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                msg.style.color = "#ff4d4d";
                msg.innerText = "Target operational database query result empty.";
                return;
            }

            if (userSnap.data().password !== password) {
                msg.style.color = "#ff4d4d";
                msg.innerText = "Security token mismatch criteria evaluated.";
                return;
            }

            await initializeUserMetadata(username);
            localStorage.setItem("RHKUser", username);
            window.location.href = "home.html";
        } catch (err) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Identity authorization pipeline interface lock fail.";
        }
    });
}
