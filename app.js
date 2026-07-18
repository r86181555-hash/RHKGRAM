import { 
initializeApp 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import { 
getFirestore,
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



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




// PAGE SECURITY


if(
!localStorage.getItem("RHKUser") &&
!location.pathname.includes("index.html") &&
!location.pathname.includes("signup.html")
){

location.href="index.html";

}




// SIGNUP


const signupBtn=document.getElementById("signupBtn");


if(signupBtn){


signupBtn.onclick=async()=>{


let username=document
.getElementById("signupUsername")
.value
.trim()
.toLowerCase();



let password=document
.getElementById("signupPassword")
.value
.trim();



let msg=document.getElementById("signupMessage");



if(!username || !password){

msg.innerHTML="Fill all details";

return;

}



try{


let userRef=doc(db,"users",username);


let check=await getDoc(userRef);



if(check.exists()){


msg.innerHTML="Username already exists";

return;


}





await setDoc(userRef,{


username:username,


password:password,


dp:"https://i.pravatar.cc/150",


bio:"New RHK user",


createdAt:new Date()


});



msg.style.color="lightgreen";

msg.innerHTML="Account created";



setTimeout(()=>{

location.href="index.html";

},1000);



}

catch(error){


msg.innerHTML="Error creating account";


}



};


}









// LOGIN



const loginBtn=document.getElementById("loginBtn");



if(loginBtn){



loginBtn.onclick=async()=>{



let username=document
.getElementById("loginUsername")
.value
.trim()
.toLowerCase();



let password=document
.getElementById("loginPassword")
.value
.trim();



let msg=document.getElementById("loginMessage");



if(!username || !password){

msg.innerHTML="Enter username and password";

return;

}



try{


let userRef=doc(db,"users",username);


let user=await getDoc(userRef);



if(!user.exists()){


msg.innerHTML="User not found";


return;


}




if(user.data().password !== password){


msg.innerHTML="Wrong password";


return;


}




localStorage.setItem(
"RHKUser",
username
);



location.href="home.html";



}


catch(error){


msg.innerHTML="Login error";


}



};


}
