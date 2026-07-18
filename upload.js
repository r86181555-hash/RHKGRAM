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

// Authentication Verification System 
const activeSessionIdentity = localStorage.getItem("RHKUser");
if (!activeSessionIdentity) {
    window.location.href = "index.html";
}

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("image");
const imagePreview = document.getElementById("preview");
const dropzoneText = document.getElementById("dropzoneText");
const uploadBtn = document.getElementById("uploadBtn");
const processStatus = document.getElementById("status");

// File Selection Management
dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const trackingFile = e.target.files[0];
    if (trackingFile) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            imagePreview.src = event.target.result;
            imagePreview.style.display = "block";
            dropzoneText.style.display = "none";
        };
        fileReader.readAsDataURL(trackingFile);
    }
});

// Transaction Controller Execution Process
uploadBtn.addEventListener("click", async () => {
    const targetedFile = fileInput.files[0];
    const extractedCaptionText = document.getElementById("caption").value.trim();

    if (!targetedFile) {
        processStatus.style.color = "#ff4d4d";
        processStatus.innerText = "Select an image file before posting.";
        return;
    }

    try {
        uploadBtn.disabled = true;
        processStatus.style.color = "#a8a8a8";
        processStatus.innerText = "Transmitting asset package to Cloudinary...";

        const dataBufferPack = new FormData();
        dataBufferPack.append("file", targetedFile);
        dataBufferPack.append("upload_preset", UPLOAD_PRESET);

        const serverResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: dataBufferPack }
        );

        if (!serverResponse.ok) throw new Error("Cloudinary engine distribution fault.");
        const resolvedJSONPayload = await serverResponse.json();

        if (!resolvedJSONPayload.secure_url) {
            throw new Error("Target file structural URL reference missing.");
        }

        processStatus.innerText = "Writing document properties to database...";

        await addDoc(collection(db, "posts"), {
            username: activeSessionIdentity,
            caption: extractedCaptionText,
            image: resolvedJSONPayload.secure_url,
            createdAt: serverTimestamp()
        });

        processStatus.style.color = "lightgreen";
        processStatus.innerText = "Post added successfully! Returning home...";

        setTimeout(() => { window.location.href = "home.html"; }, 1300);
    } catch (transactionFault) {
        uploadBtn.disabled = false;
        processStatus.style.color = "#ff4d4d";
        processStatus.innerText = transactionFault.message;
    }
});
