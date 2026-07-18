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

    feed.innerHTML = "<h2 style='text-align:center'>Loading...</h2>";

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    feed.innerHTML = "";

    snap.forEach(doc => {

        const post = doc.data();

        feed.innerHTML += `

<div class="post">

<div class="post-header">

<b>${post.username}</b>

</div>

<img class="post-image"
src="${post.image}">

<div class="post-actions">

❤️ 💬 📤

</div>

<div class="post-text">

${post.caption}

</div>

</div>

`;

    });

}

loadPosts();
