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

// Direct Gateway Session Interceptor
if (!localStorage.getItem("RHKUser") && !window.location.pathname.includes("index.html") && !window.location.pathname.includes("signup.html")) {
    window.location.href = "index.html";
}

// -------------------- REGISTRATION DISPATCHER --------------------
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
        const username = document.getElementById("signupUsername").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value.trim();
        const msg = document.getElementById("signupMessage");

        if (!username || !password) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Please complete all fields.";
            return;
        }

        try {
            msg.style.color = "#a8a8a8";
            msg.innerText = "Verifying availability...";
            
            const userRef = doc(db, "users", username);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                msg.style.color = "#ff4d4d";
                msg.innerText = "Username is already taken.";
                return;
            }

            await setDoc(userRef, { username, password });
            
            msg.style.color = "lightgreen";
            msg.innerText = "Account security structured. Redirecting...";
            
            setTimeout(() => { window.location.href = "index.html"; }, 1200);
        } catch (err) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Network transmission error.";
        }
    });
}

// -------------------- AUTHENTICATION INTERACTION --------------------
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const username = document.getElementById("loginUsername").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value.trim();
        const msg = document.getElementById("loginMessage");

        if (!username || !password) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Missing input credentials.";
            return;
        }

        try {
            msg.style.color = "#a8a8a8";
            msg.innerText = "Authorizing identity...";
            
            const userRef = doc(db, "users", username);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                msg.style.color = "#ff4d4d";
                msg.innerText = "Account matching identity not found.";
                return;
            }

            if (userSnap.data().password !== password) {
                msg.style.color = "#ff4d4d";
                msg.innerText = "Incorrect security clearance password.";
                return;
            }

            localStorage.setItem("RHKUser", username);
            window.location.href = "home.html";
        } catch (err) {
            msg.style.color = "#ff4d4d";
            msg.innerText = "Authentication engine timeout.";
        }
    });
}
