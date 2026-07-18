import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getFirestore,
collection,
getDocs
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

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

let users = [];

async function loadUsers(){

const snap = await getDocs(collection(db,"users"));

users = [];

snap.forEach(doc=>{

users.push(doc.data());

});

showUsers(users);

}

function showUsers(list){

results.innerHTML = "";

if(list.length==0){

results.innerHTML=`
<div style="text-align:center;padding:40px;color:#999;">
No users found
</div>
`;

return;

}

list.forEach(user=>{

results.innerHTML += `

<div class="user-card">

<img src="${user.dp || "https://i.pravatar.cc/150?u="+user.username}">

<div style="flex:1;">

<h3 style="font-size:15px;">
${user.username}
</h3>

<p style="color:#999;font-size:13px;">
${user.bio || ""}
</p>

</div>

<button
class="followBtn"
style="
width:90px;
padding:8px;
border-radius:8px;
background:#0095f6;
color:white;
border:none;
cursor:pointer;
">
Follow
</button>

</div>

`;

});

document.querySelectorAll(".followBtn").forEach(btn=>{

btn.onclick=()=>{

btn.innerHTML="Following";

btn.style.background="#333";

};

});

}

searchInput.addEventListener("input",()=>{

const value = searchInput.value.toLowerCase().trim();

const filtered = users.filter(user=>{

return user.username.toLowerCase().includes(value);

});

showUsers(filtered);

});

loadUsers();
