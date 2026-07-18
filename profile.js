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



if(!username){

location.href="index.html";

}




const dp=document.getElementById("profileDP");

const name=document.getElementById("profileUsername");

const bio=document.getElementById("profileBio");

const posts=document.getElementById("myPosts");





async function loadProfile(){


let ref=doc(db,"users",username);


let snap=await getDoc(ref);



if(snap.exists()){


let data=snap.data();


name.innerHTML=data.username;


dp.src=data.dp;


bio.innerHTML=data.bio;


}





let q=query(

collection(db,"posts"),

where("username","==",username)

);



let result=await getDocs(q);



posts.innerHTML="";



document.getElementById("postCount")
.innerHTML=result.size+" Posts";



result.forEach(p=>{


let data=p.data();


if(data.type==="video"){


posts.innerHTML+=`

<video src="${data.media}"></video>

`;

}


else{


posts.innerHTML+=`

<img src="${data.media}">

`;

}


});


}



loadProfile();





// SAVE PROFILE


document
.getElementById("saveProfile")
.onclick=async()=>{



let bioText=document
.getElementById("bioInput")
.value;



await updateDoc(

doc(db,"users",username),

{


bio:bioText


}


);



location.reload();


};
