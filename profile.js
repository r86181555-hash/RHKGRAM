import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getFirestore,
doc,
getDoc,
updateDoc,
collection,
getDocs,
query,
where
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

const username = localStorage.getItem("RHKUser");

if (!username) {
    location.href = "index.html";
}

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const profileDP = document.getElementById("profileDP");
const usernameText = document.getElementById("username");
const profileUsername = document.getElementById("profileUsername");
const profileBio = document.getElementById("profileBio");
const postCount = document.getElementById("postCount");
const myPosts = document.getElementById("myPosts");

async function loadProfile(){

const userRef = doc(db,"users",username);
const userSnap = await getDoc(userRef);

if(userSnap.exists()){

const data = userSnap.data();

usernameText.innerHTML = data.username;
profileUsername.innerHTML = data.username;

profileDP.src = data.dp || "https://i.pravatar.cc/150";

profileBio.innerHTML = data.bio || "";

}

const q = query(
collection(db,"posts"),
where("username","==",username)
);

const result = await getDocs(q);

postCount.innerHTML = result.size;

myPosts.innerHTML="";

result.forEach(post=>{

const data = post.data();

if(data.type==="video"){

myPosts.innerHTML += `
<video controls>
<source src="${data.media}">
</video>
`;

}else{

myPosts.innerHTML += `
<img src="${data.media}">
`;

}

});

}

loadProfile();

document.getElementById("saveProfile").onclick = async()=>{

const bio = document.getElementById("bioInput").value;

let imageURL = null;

const file = document.getElementById("dpUpload").files[0];

if(file){

const form = new FormData();

form.append("file",file);

form.append("upload_preset",UPLOAD_PRESET);

const upload = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
{
method:"POST",
body:form
}
);

const cloud = await upload.json();

imageURL = cloud.secure_url;

}

const update = {};

if(bio!="") update.bio = bio;

if(imageURL) update.dp = imageURL;

await updateDoc(
doc(db,"users",username),
update
);

alert("Profile Updated");

loadProfile();

};
