import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
setDoc,
getDocs,
query,
orderBy,
onSnapshot
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

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){
location.href="index.html";
}

let selectedUser = "";

const usersDiv = document.getElementById("chatUsers");
const messagesDiv = document.getElementById("messages");
const chatWindow = document.getElementById("chatWindow");
const chatName = document.getElementById("chatName");
const chatDP = document.getElementById("chatDP");

async function loadUsers(){

const snap = await getDocs(collection(db,"users"));

usersDiv.innerHTML="";

snap.forEach(docu=>{

const user = docu.data();

if(user.username===currentUser) return;

usersDiv.innerHTML += `

<div class="user-card"
onclick="openChat('${user.username}','${user.dp||""}')">

<img src="${user.dp || "https://i.pravatar.cc/150?u="+user.username}">

<div>

<b>${user.username}</b><br>

<small>${user.bio || ""}</small>

</div>

</div>

`;

});

}

window.openChat = function(name,dp){

selectedUser=name;

chatWindow.style.display="block";

chatName.innerHTML=name;

chatDP.src=dp || "https://i.pravatar.cc/150?u="+name;

listenMessages();

}

function chatId(){

return [currentUser,selectedUser].sort().join("_");

}

function listenMessages(){

const q=query(
collection(db,"chats",chatId(),"messages"),
orderBy("time")
);

onSnapshot(q,(snapshot)=>{

messagesDiv.innerHTML="";

snapshot.forEach(doc=>{

const msg=doc.data();

messagesDiv.innerHTML += `

<div class="${
msg.sender===currentUser?"sent":"received"
} message">

${msg.text}

</div>

`;

});

messagesDiv.scrollTop=messagesDiv.scrollHeight;

});

}

document.getElementById("sendBtn").onclick=async()=>{

const input=document.getElementById("messageInput");

const text=input.value.trim();

if(text==="") return;

await setDoc(
doc(collection(db,"chats",chatId(),"messages")),
{
sender:currentUser,
text:text,
time:Date.now()
}
);

input.value="";

};

loadUsers();
