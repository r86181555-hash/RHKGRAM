import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

const activeUser = localStorage.getItem("RHKUser");
if (!activeUser) { window.location.href = "index.html"; }

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const avatarUploadTrigger = document.getElementById("avatarUploadTrigger");
const profileFileInput = document.getElementById("profileFileInput");
const profileDisplayImage = document.getElementById("profileDisplayImage");
const profileUsernameTitle = document.getElementById("profileUsernameTitle");
const profileBio = document.getElementById("profileBio");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const profileStatus = document.getElementById("profileStatus");

let activeUploadedUrl = "";

async function fetchAndPopulateProfile() {
    if(profileUsernameTitle) profileUsernameTitle.innerText = `@${activeUser}`;
    try {
        const pRef = doc(db, "profiles", activeUser);
        const pSnap = await getDoc(pRef);
        
        if (pSnap.exists()) {
            const data = pSnap.data();
            if (data.avatar) profileDisplayImage.src = data.avatar;
            if (data.bio) profileBio.value = data.bio;
            activeUploadedUrl = data.avatar || "";
        }
    } catch(e) {
        profileStatus.innerText = "Error syncing initialization metadata profiles.";
    }
}

if(avatarUploadTrigger) {
    avatarUploadTrigger.addEventListener("click", () => profileFileInput.click());
}

if(profileFileInput) {
    profileFileInput.addEventListener("change", async (e) => {
        const targetFile = e.target.files[0];
        if(!targetFile) return;

        try {
            profileStatus.style.color = "#a8a8a8";
            profileStatus.innerText = "Uploading configuration DP image block...";
            
            const dataPack = new FormData();
            dataPack.append("file", targetFile);
            dataPack.append("upload_preset", UPLOAD_PRESET);

            const serverRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST", body: dataPack
            });
            const resJson = await serverRes.json();
            
            if(resJson.secure_url) {
                activeUploadedUrl = resJson.secure_url;
                profileDisplayImage.src = activeUploadedUrl;
                profileStatus.style.color = "lightgreen";
                profileStatus.innerText = "DP layout preview generated.";
            }
        } catch(err) {
            profileStatus.style.color = "#ff4d4d";
            profileStatus.innerText = "Image engine delivery pipeline asset fault.";
        }
    });
}

if(saveProfileBtn) {
    saveProfileBtn.addEventListener("click", async () => {
        try {
            saveProfileBtn.disabled = true;
            profileStatus.style.color = "#a8a8a8";
            profileStatus.innerText = "Writing system document attributes context...";
            
            const pRef = doc(db, "profiles", activeUser);
            await setDoc(pRef, {
                username: activeUser,
                avatar: activeUploadedUrl || `https://i.pravatar.cc/150?u=${activeUser}`,
                bio: profileBio.value.trim()
            }, { merge: true });

            profileStatus.style.color = "lightgreen";
            profileStatus.innerText = "System parameters synchronized successfully.";
            setTimeout(() => { window.location.href = "home.html"; }, 1000);
        } catch(e) {
            saveProfileBtn.disabled = false;
            profileStatus.style.color = "#ff4d4d";
            profileStatus.innerText = "Write transmission operational crash execution profile.";
        }
    });
}

fetchAndPopulateProfile();

