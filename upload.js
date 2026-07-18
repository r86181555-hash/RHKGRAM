import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import { 
getFirestore,
collection,
addDoc,
serverTimestamp,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



const firebaseConfig = {

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



if(!username){

location.href="index.html";

}




// CLOUDINARY

const CLOUD_NAME="nhy9lfkt";

const UPLOAD_PRESET="rhk_upload";





const fileInput=document.getElementById("image");

const preview=document.getElementById("preview");

const dropzone=document.getElementById("dropzone");

const uploadBtn=document.getElementById("uploadBtn");

const status=document.getElementById("status");



let selectedFile=null;






dropzone.onclick=()=>{

fileInput.click();

};






fileInput.onchange=(e)=>{


selectedFile=e.target.files[0];



if(selectedFile){



let url=URL.createObjectURL(selectedFile);



preview.src=url;

preview.style.display="block";



}


};









uploadBtn.onclick=async()=>{



if(!selectedFile){


status.innerHTML="Select image or video";


return;


}




try{


uploadBtn.disabled=true;



status.innerHTML="Uploading media...";





let form=new FormData();



form.append(
"file",
selectedFile
);



form.append(
"upload_preset",
UPLOAD_PRESET
);






let upload=await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,

{

method:"POST",

body:form

}

);





let data=await upload.json();






if(!data.secure_url){


throw Error("Upload failed");


}







let userRef=doc(
db,
"users",
username
);



let userData=await getDoc(userRef);





await addDoc(
collection(db,"posts"),

{


username:username,


dp:userData.data()?.dp || "",



media:data.secure_url,



type:selectedFile.type.startsWith("video")

?

"video"

:

"image",




caption:
document
.getElementById("caption")
.value,



likes:0,


comments:[],



createdAt:serverTimestamp()


}

);







status.style.color="lightgreen";

status.innerHTML="Post uploaded successfully 🚀";





setTimeout(()=>{


location.href="home.html";


},1000);



}

catch(error){



uploadBtn.disabled=false;


status.style.color="red";


status.innerHTML=error.message;


}



};
