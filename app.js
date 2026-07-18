import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

// Logic: Map Username to email format
const getEmail = (username) => `${username.toLowerCase()}@rhk.app`;

document.getElementById('loginBtn').addEventListener('click', async () => {
    const user = getEmail(document.getElementById('username').value);
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, user, pass);
        window.location.href = "home.html"; // Redirect
    } catch {
        // Auto-signup if login fails
        await createUserWithEmailAndPassword(auth, user, pass);
        window.location.href = "home.html";
    }
});

document.getElementById('googleBtn').addEventListener('click', async () => {
    await signInWithPopup(auth, provider);
    window.location.href = "home.html";
});

