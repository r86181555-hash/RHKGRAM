// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
  authDomain: "rhk-app-e34c6.firebaseapp.com",
  projectId: "rhk-app-e34c6",
  storageBucket: "rhk-app-e34c6.firebasestorage.app",
  messagingSenderId: "1016565109006",
  appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f",
  measurementId: "G-814PTRRQVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------- SIGN UP --------------------

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {

signupBtn.addEventListener("click", async () => {

const username = document.getElementById("signupUsername").value.trim();

const password = document.getElementById("signupPassword").value.trim();

const msg = document.getElementById("signupMessage");

if(username==="" || password===""){
msg.innerText="Fill all fields";
return;
}

const ref = doc(db,"users",username);

const check = await getDoc(ref);

if(check.exists()){
msg.innerText="Username already exists";
return;
}

await setDoc(ref,{
username:username,
password:password
});

msg.style.color="lightgreen";
msg.innerText="Account Created Successfully";

setTimeout(()=>{
window.location="index.html";
},1500);

});

}

// -------------------- LOGIN --------------------

const loginBtn=document.getElementById("loginBtn");

if(loginBtn){

loginBtn.addEventListener("click",async()=>{

const username=document.getElementById("loginUsername").value.trim();

const password=document.getElementById("loginPassword").value.trim();

const msg=document.getElementById("loginMessage");

const ref=doc(db,"users",username);

const snap=await getDoc(ref);

if(!snap.exists()){

msg.innerText="Invalid Username";

return;

}

const data=snap.data();

if(data.password!==password){

msg.innerText="Wrong Password";

return;

}

localStorage.setItem("RHKUser",username);

window.location="home.html";

});

}

// -------------------- CHECK LOGIN --------------------

if(window.location.pathname.includes("home.html")){

const user=localStorage.getItem("RHKUser");

if(!user){

window.location="index.html";

}

}

// -------------------- LOGOUT --------------------

const logout=document.getElementById("logoutBtn");

if(logout){

logout.addEventListener("click",()=>{

localStorage.removeItem("RHKUser");

window.location="index.html";

});

}
