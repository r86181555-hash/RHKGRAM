import {initializeApp}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc,
updateDoc,
collection,
getDocs,
query,
where
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig={
apiKey:"AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
authDomain:"rhk-app-e34c6.firebaseapp.com",
projectId:"rhk-app-e34c6",
storageBucket:"rhk-app-e34c6.firebasestorage.app",
messagingSenderId:"1016565109006",
appId:"1:1016565109006:web:eb7ec260a601a16e5ac75f"
};


const app=initializeApp(firebaseConfig);

const db=getFirestore(app);


const username=localStorage.getItem("RHKUser");


const CLOUD_NAME="nhy9lfkt";
const UPLOAD_PRESET="rhk_upload";


const dp=document.getElementById("profileDP");
const name=document.getElementById("profileUsername");
const bio=document.getElementById("profileBio");
const posts=document.getElementById("myPosts");

const dpInput=document.getElementById("dpUpload");
const save=document.getElementById("saveProfile");



async function loadProfile(){


const userRef=doc(db,"users",username);

const snap=await getDoc(userRef);


if(snap.exists()){

let data=snap.data();

name.innerHTML=data.username;

dp.src=data.dp || "https://i.pravatar.cc/150";

bio.innerHTML=data.bio || "";

}



let q=query(
collection(db,"posts"),
where("username","==",username)
);


let result=await getDocs(q);


posts.innerHTML="";


document.getElementById("postCount").innerHTML=
result.size+" Posts";



result.forEach(post=>{


let data=post.data();


if(data.type==="video"){

posts.innerHTML+=`

<video src="${data.media}"></video>

`;

}else{


posts.innerHTML+=`

<img src="${data.media}">

`;

}


});


}



loadProfile();





save.onclick=async()=>{


try{


// DP upload

let file=dpInput.files[0];


let imageURL=null;



if(file){


let form=new FormData();


form.append("file",file);

form.append(
"upload_preset",
UPLOAD_PRESET
);



let upload=await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

{

method:"POST",

body:form

}

);



let data=await upload.json();


imageURL=data.secure_url;


}





let bioText=document
.getElementById("bioInput")
.value;




let updateData={

bio:bioText

};



if(imageURL){

updateData.dp=imageURL;

}




await updateDoc(

doc(db,"users",username),

updateData

);



alert("Profile updated ✅");


location.reload();



}

catch(error){

alert(error.message);

}


};
