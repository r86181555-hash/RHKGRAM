import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getFirestore,
collection,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const reelsContainer = document.getElementById("reelsContainer");

async function loadReels(){

const q = query(
collection(db,"posts"),
orderBy("createdAt","desc")
);

const snap = await getDocs(q);

reelsContainer.innerHTML="";

let found = false;

snap.forEach(doc=>{

const post = doc.data();

if(post.type==="video"){

found = true;

reelsContainer.innerHTML += `

<div class="reel">

<video
class="reelVideo"
src="${post.media}"
playsinline
loop
controls
></video>

<div class="reelOverlay">

<div class="reelUser">

<img
class="reelDP"
src="${post.dp || "https://i.pravatar.cc/150?u="+post.username}">

<div>

<h3>${post.username}</h3>

<p>${post.caption || ""}</p>

</div>

</div>

<div class="reelActions">

<button class="reelBtn">❤️</button>

<button class="reelBtn">💬</button>

<button class="reelBtn">📤</button>

</div>

</div>

</div>

`;

}

});

if(!found){

reelsContainer.innerHTML=`

<div style="
padding:60px;
text-align:center;
color:#888;
">

<h2>No Reels Yet
