import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
query,
orderBy,
doc,
updateDoc,
arrayUnion
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



const firebaseConfig = {

apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",

authDomain: "rhk-app-e34c6.firebaseapp.com",

projectId: "rhk-app-e34c6",

storageBucket: "rhk-app-e34c6.firebasestorage.app",

messagingSenderId: "1016565109006",

appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f"

};



const app = initializeApp(firebaseConfig);

const db=getFirestore(app);



const user=localStorage.getItem("RHKUser");


if(!user){

location.href="index.html";

}



const feed=document.getElementById("feed");





async function loadPosts(){


try{


let q=query(
collection(db,"posts"),
orderBy("createdAt","desc")
);



let result=await getDocs(q);



feed.innerHTML="";



if(result.empty){


feed.innerHTML=`

<div style="padding:50px;text-align:center">

<h3>No posts yet</h3>

<p>Upload first post 🚀</p>

</div>

`;

return;


}





result.forEach(post=>{


let data=post.data();



let media="";



if(data.type==="video"){


media=`

<video class="post-main-video" controls>

<source src="${data.media}">

</video>

`;

}


else{


media=`

<img class="post-main-img" src="${data.media}">

`;

}





let likes=data.likes || 0;


let comments=data.comments || [];



feed.innerHTML += `



<article class="post-card">



<div class="post-user-bar">


<img class="post-user-avatar"

src="${data.dp || 'https://i.pravatar.cc/150'}">


<span class="post-username-label">

${data.username}

</span>


</div>





<div class="post-media-frame">


${media}


</div>






<div class="post-engagement-bar">


<div>


<span class="action-trigger like-btn"

data-id="${post.id}">

❤️ ${likes}

</span>



<span class="action-trigger">

💬

</span>



</div>



<span>

🔖

</span>


</div>







<div class="post-narrative">


<b>${data.username}</b>

<p>${escapeHTML(data.caption || "")}</p>


</div>






<div class="comment-list">


${

comments.map(c=>`

<p>

<b>${c.user}</b> ${c.text}

</p>

`).join("")

}


</div>






<div class="comment-box">


<input 

id="comment-${post.id}"

placeholder="Add comment...">



<button 

onclick="addComment('${post.id}')">

Send

</button>



</div>






</article>


`;



});





document.querySelectorAll(".like-btn")
.forEach(btn=>{


btn.onclick=async()=>{


let id=btn.dataset.id;


let ref=doc(db,"posts",id);


await updateDoc(ref,{

likes:likes+1

});


loadPosts();


};



});




}


catch(e){


feed.innerHTML="Unable to load feed";


}



}







window.addComment=async function(id){


let input=document.getElementById(
"comment-"+id
);


let text=input.value.trim();



if(!text)return;



let ref=doc(db,"posts",id);



await updateDoc(ref,{


comments:arrayUnion({

user:user,

text:text

})


});



input.value="";


loadPosts();



}








function escapeHTML(str){


return str.replace(/[&<>'"]/g,

c=>({

"&":"&amp;",

"<":"&lt;",

">":"&gt;",

"'":"&#39;",

'"':"&quot;"

}[c])

);


}






document
.getElementById("headerLogoutBtn")
?.addEventListener("click",()=>{


localStorage.removeItem("RHKUser");

location.href="index.html";


});





loadPosts();
