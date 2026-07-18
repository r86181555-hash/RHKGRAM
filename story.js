import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs,
query,
orderBy,
serverTimestamp
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

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const currentUser = localStorage.getItem("RHKUser");

const fileInput = document.getElementById("storyFile");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadStory");
const caption = document.getElementById("storyCaption");
const status = document.getElementById("status");
const feed = document.getElementById("storyFeed");

fileInput.onchange = () => {

const file = fileInput.files[0];

if(!file) return;

if(file.type.startsWith("image")){

preview.src = URL.createObjectURL(file);

}else{

preview.outerHTML = `
<video
id="preview"
controls
autoplay
style="
width:100%;
max-height:420px;
border-radius:15px;
">
<source src="${URL.createObjectURL(file)}">
</video>
`;

}

};

uploadBtn.onclick = async()=>{

const file = fileInput.files[0];

if(!file){

alert("Select image or video");

return;

}

status.innerHTML="Uploading...";

const form = new FormData();

form.append("file",file);

form.append("upload_preset",UPLOAD_PRESET);

const type=file.type.startsWith("video")?"video":"image";

const res = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
{
method:"POST",
body:form
}
);

const data = await res.json();

await addDoc(collection(db,"stories"),{

username:currentUser,

media:data.secure_url,

caption:caption.value,

type:type,

createdAt:serverTimestamp()

});

status.innerHTML="Story Uploaded";

loadStories();

};

async function loadStories(){

const q=query(
collection(db,"stories"),
orderBy("createdAt","desc")
);

const snap=await getDocs(q);

feed.innerHTML="";

snap.forEach(doc=>{

const s=doc.data();

feed.innerHTML += `

<div class="story">

<img
src="https://i.pravatar.cc/150?u=${s.username}">

<p>${s.username}</p>

</div>

`;

});

}

loadStories();
