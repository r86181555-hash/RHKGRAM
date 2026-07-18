import {initializeApp}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
getDocs,
serverTimestamp

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



const user=localStorage.getItem("RHKUser");



const CLOUD_NAME="nhy9lfkt";

const UPLOAD_PRESET="rhk_upload";



const file=document.getElementById("storyFile");

const btn=document.getElementById("uploadStory");

const status=document.getElementById("storyStatus");



btn.onclick=async()=>{


let selected=file.files[0];


if(!selected){

status.innerHTML="Select image/video";

return;

}



try{


status.innerHTML="Uploading...";



let form=new FormData();


form.append("file",selected);


form.append(
"upload_preset",
UPLOAD_PRESET
);



let res=await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,

{

method:"POST",

body:form

}

);



let data=await res.json();



await addDoc(

collection(db,"stories"),

{


username:user,


media:data.secure_url,


type:selected.type.startsWith("video")

?"video":"image",


createdAt:serverTimestamp()


}

);



status.innerHTML="Story added ✅";


}


catch(e){

status.innerHTML=e.message;

}


};






async function loadStories(){


let result=await getDocs(
collection(db,"stories")
);



let box=document.getElementById("storyView");


box.innerHTML="";



result.forEach(s=>{


let data=s.data();



if(data.type==="video"){


box.innerHTML+=`

<div>

<h3>${data.username}</h3>

<video 
src="${data.media}"
controls
style="
width:100%;
height:400px;
object-fit:cover;
">

</video>

</div>

`;


}

else{


box.innerHTML+=`

<div>

<h3>${data.username}</h3>

<img 
src="${data.media}"
style="
width:100%;
height:400px;
object-fit:cover;
">

</div>

`;


}


});


}



loadStories();
