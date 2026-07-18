import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
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

const feed = document.getElementById("feed");

async function loadPosts() {

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    feed.innerHTML = "";

    if (snapshot.empty) {

        feed.innerHTML = `
        <div style="text-align:center;padding:40px;">
            <h2>No Posts Yet</h2>
            <p>Create your first post.</p>
        </div>
        `;

        return;
    }

    snapshot.forEach(doc => {

        const post = doc.data();

        feed.innerHTML += `

<div class="post">

<div class="post-header">

<img src="https://i.pravatar.cc/150?u=${post.username}">

<div class="username">

${post.username}

</div>

</div>

<img
class="post-image"
src="${post.image}"
>

<div class="post-actions">

<div class="left-actions">

<span>❤️</span>

<span>💬</span>

<span>📤</span>

</div>

<div>

🔖

</div>

</div>

<div class="post-caption">

<b>${post.username}</b>

<br><br>

${post.caption}

</div>

</div>

`;

    });

}

loadPosts();
