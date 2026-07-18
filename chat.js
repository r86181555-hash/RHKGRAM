import {initializeApp}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
getDocs,
query,
where,
orderBy,
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



const currentUser=localStorage.getItem("RHKUser");



const receiver=document.getElementById("receiver");

const messageBox=document.getElementById("messages");

const input=document.getElementById("messageText");

const send=document.getElementById("sendBtn");





send.onclick=async()=>{


let text=input.value.trim();

let user=receiver.value.trim().toLowerCase();



if(!text || !user){

return;

}



await addDoc(

collection(db,"messages"),

{


sender:currentUser,


receiver:user,


text:text,


time:serverTimestamp()


}

);



input.value="";


loadMessages();


};







async function loadMessages(){


let user=receiver.value.trim().toLowerCase();



if(!user)return;



let q=query(

collection(db,"messages"),

orderBy("time","asc")

);



let data=await getDocs(q);



messageBox.innerHTML="";



data.forEach(m=>{


let msg=m.data();



if(

(msg.sender===currentUser &&
msg.receiver===user)

||

(msg.sender===user &&
msg.receiver===currentUser)

){



messageBox.innerHTML+=`

<div class="message 
${msg.sender===currentUser?'sent':'received'}">

${msg.text}

</div>

`;



}


});


}



receiver.onchange=loadMessages;


setInterval(loadMessages,3000);
