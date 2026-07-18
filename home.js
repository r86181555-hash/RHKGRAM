import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getFirestore,
collection,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig={
apiKey:"YOUR_API_KEY",
authDomain:"YOUR_AUTH_DOMAIN",
projectId:"YOUR_PROJECT_ID",
storageBucket:"YOUR_STORAGE_BUCKET",
messagingSenderId:"YOUR_SENDER_ID",
appId:"YOUR_APP_ID"
};

const app=initializeApp(firebaseConfig);
const db=getFirestore(app);

const feed=document.getElementById("feed");
const stories=document.getElementById("stories");

if(!localStorage.getItem("RHKUser")){
location.href="index.html";
}

async function loadStories(){

const users=await getDocs(collection(db,"users"));

stories.innerHTML="";

users.forEach(doc=>{

const u=doc.data();

stories.innerHTML+=`

<div class="story">

<img src="${u.dp || "https://i.pravatar.cc/150?u="+u.username}">

<p>${u.username}</p>

</div>

`;

});

}

async function loadFeed(){

const q=query(
collection(db,"posts"),
orderBy("createdAt","desc")
);

const snap=await getDocs(q);

feed.innerHTML="";

snap.forEach(post=>{

const data=post.data();

let media="";

if(data.type==="video"){

media=`

<div class="media">

<video
src="${data.media}"
controls
playsinline
></video>

</div>

`;

}else{

media=`

<div class="media">

<img src="${data.image || data.media}">

</div>

`;

}

feed.innerHTML+=`

<div class="post">

<div class="user">

<img src="https://i.pravatar.cc/150?u=${data.username}">

<b>${data.username}</b>

</div>

${media}

<div class="actions">

<div>

<span>🤍</span>

<span>💬</span>

<span>📤</span>

</div>

<span>🔖</span>

</div>

<div class="caption">

<b>${data.username}</b>

${data.caption || ""}

</div>

</div>

`;

});

}

loadStories();
loadFeed();
