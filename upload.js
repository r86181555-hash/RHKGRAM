import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

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
const storage = getStorage(app);

const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", async () => {

const image = document.getElementById("image").files[0];

const caption = document.getElementById("caption").value;

const status = document.getElementById("status");

if (!image) {
status.innerText = "Please choose an image.";
return;
}

try {

status.innerText = "Uploading...";

const imageRef = ref(storage, "posts/" + Date.now() + "_" + image.name);

await uploadBytes(imageRef, image);

const imageURL = await getDownloadURL(imageRef);

await addDoc(collection(db, "posts"), {

image: imageURL,

caption: caption,

username: localStorage.getItem("RHKUser"),

createdAt: serverTimestamp()

});

status.style.color = "lightgreen";
status.innerText = "Post uploaded successfully!";

setTimeout(() => {
window.location = "home.html";
}, 1500);

} catch (err) {

status.style.color = "red";
status.innerText = err.message;

}

});
