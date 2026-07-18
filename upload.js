import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
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

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", async () => {

    const imageFile = document.getElementById("image").files[0];
    const caption = document.getElementById("caption").value.trim();
    const status = document.getElementById("status");

    if (!imageFile) {
        status.innerText = "Please select an image.";
        return;
    }

    try {

        status.innerText = "Uploading image...";

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!data.secure_url) {
            throw new Error("Image upload failed.");
        }

        await addDoc(collection(db, "posts"), {
            username: localStorage.getItem("RHKUser"),
            caption: caption,
            image: data.secure_url,
            createdAt: serverTimestamp()
        });

        status.style.color = "lightgreen";
        status.innerText = "Post uploaded successfully.";

        setTimeout(() => {
            window.location = "home.html";
        }, 1500);

    } catch (error) {

        status.style.color = "red";
        status.innerText = error.message;

    }

});
