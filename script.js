import { auth, googleProvider } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const DUMMY_DOMAIN = "@rhkapp.com";

// Login with Username
document.getElementById('loginBtn').addEventListener('click', async () => {
  const user = document.getElementById('username').value + DUMMY_DOMAIN;
  const pass = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, user, pass);
    window.location.href = "home.html"; // Redirect
  } catch (e) {
    // If user doesn't exist, try creating one
    await createUserWithEmailAndPassword(auth, user, pass);
    window.location.href = "home.html";
  }
});

// Google Login
document.getElementById('googleBtn').addEventListener('click', async () => {
  await signInWithPopup(auth, googleProvider);
  window.location.href = "home.html";
});

