import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

const activeSession = localStorage.getItem("RHKUser");
if (!activeSession) { window.location.href = "index.html"; }

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("image");
const imagePreview = document.getElementById("preview");
const dropzoneText = document.getElementById("dropzoneText");
const uploadBtn = document.getElementById("uploadBtn");
const processStatus = document.getElementById("status");

if(dropzone) dropzone.addEventListener("click", () => fileInput.click());

if(fileInput) {
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                imagePreview.src = evt.target.result;
                imagePreview.style.display = "block";
                if(dropzoneText) dropzoneText.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });
}

if(uploadBtn) {
    uploadBtn.addEventListener("click", async () => {
        const targetedFile = fileInput.files[0];
        const captionText = document.getElementById("caption").value.trim();

        if (!targetedFile) {
            processStatus.style.color = "#ff4d4d";
            processStatus.innerText = "Select image target properties first.";
            return;
        }

        try {
            uploadBtn.disabled = true;
            processStatus.style.color = "#a8a8a8";
            processStatus.innerText = "Transmitting image data package payload...";

            const dataBufferPack = new FormData();
            dataBufferPack.append("file", targetedFile);
            dataBufferPack.append("upload_preset", UPLOAD_PRESET);

            const serverResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST", body: dataBufferPack
            });

            if (!serverResponse.ok) throw new Error("Distribution engine structural allocation crash.");
            const resData = await serverResponse.json();

            processStatus.innerText = "Recording configuration document variables...";
            await addDoc(collection(db, "posts"), {
                username: activeSession,
                caption: captionText,
                image: resData.secure_url,
                createdAt: serverTimestamp()
            });

            processStatus.style.color = "lightgreen";
            processStatus.innerText = "Content updated completely inside structural node. Redirecting...";
            setTimeout(() => { window.location.href = "home.html"; }, 1300);
        } catch (err) {
            uploadBtn.disabled = false;
            processStatus.style.color = "#ff4d4d";
            processStatus.innerText = err.message;
        }
    });
}
