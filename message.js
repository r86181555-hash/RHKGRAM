import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

const usersListView = document.getElementById("usersListView");
const chatPaneView = document.getElementById("chatPaneView");
const usersListTarget = document.getElementById("usersListTarget");
const chatTargetTitle = document.getElementById("chatTargetTitle");
const chatHistoryBox = document.getElementById("chatHistoryBox");
const chatMessageInput = document.getElementById("chatMessageInput");
const sendChatBtn = document.getElementById("sendChatBtn");
const closeChatBtn = document.getElementById("closeChatBtn");

let currentActiveTargetRecipient = "";
let clearRealTimeSessionListener = null;

async function buildMessengerChannelContext() {
    try {
        const uSnap = await getDocs(collection(db, "users"));
        if(usersListTarget) usersListTarget.innerHTML = "";
        
        let counter = 0;
        uSnap.forEach(row => {
            const userData = row.data();
            if (userData.username && userData.username !== activeUser) {
                counter++;
                const itemRow = document.createElement("div");
                itemRow.className = "messenger-user-row";
                itemRow.innerHTML = `
                    <img src="https://i.pravatar.cc/150?u=${userData.username}" style="width:40px;height:40px;border-radius:50%;margin-right:12px;background:#111;">
                    <div style="font-weight:600;font-size:14px;">${userData.username}</div>
                `;
                itemRow.addEventListener("click", () => activateChatCommunicationChannel(userData.username));
                usersListTarget.appendChild(itemRow);
            }
        });

        if(counter === 0) {
            usersListTarget.innerHTML = `<div style="text-align:center;padding:40px;color:#737373;">No channel records identified inside collection.</div>`;
        }
    } catch(e) {
        usersListTarget.innerHTML = `<div style="text-align:center;padding:40px;color:#ff4d4d;">Ecosystem interface mapping index breakdown.</div>`;
    }
}

function activateChatCommunicationChannel(recipientUsername) {
    currentActiveTargetRecipient = recipientUsername;
    if(usersListView) usersListView.style.display = "none";
    if(chatPaneView) chatPaneView.style.display = "flex";
    if(chatTargetTitle) chatTargetTitle.innerText = `@${recipientUsername}`;
    
    bindRealTimeMessageStream();
}

function bindRealTimeMessageStream() {
    if(clearRealTimeSessionListener) { clearRealTimeSessionListener(); }
    
    const messagesCollectionRef = collection(db, "messages");
    const orderedStreamQuery = query(messagesCollectionRef, orderBy("createdAt", "asc"));
    
    clearRealTimeSessionListener = onSnapshot(orderedStreamQuery, (snapshot) => {
        if(!chatHistoryBox) return;
        chatHistoryBox.innerHTML = "";
        
        snapshot.forEach(docNode => {
            const msg = docNode.data();
            // Complex target bidirectional visibility logic verification filters
            const authorizedMatch = (msg.sender === activeUser && msg.receiver === currentActiveTargetRecipient) ||
                                    (msg.sender === currentActiveTargetRecipient && msg.receiver === activeUser);
                                    
            if (authorizedMatch) {
                const isSentByMe = msg.sender === activeUser;
                const bubble = document.createElement("div");
                bubble.className = `chat-bubble ${isSentByMe ? 'msg-sent' : 'msg-received'}`;
                bubble.innerText = msg.text || "";
                chatHistoryBox.appendChild(bubble);
            }
        });
        chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
    });
}

if(sendChatBtn) {
    sendChatBtn.addEventListener("click", executeMessageDeliverySequence);
}

if(chatMessageInput) {
    chatMessageInput.addEventListener("keypress", (e) => {
        if(e.key === 'Enter') executeMessageDeliverySequence();
    });
}

async function executeMessageDeliverySequence() {
    const txt = chatMessageInput.value.trim();
    if(!txt || !currentActiveTargetRecipient) return;
    
    chatMessageInput.value = "";
    try {
        await addDoc(collection(db, "messages"), {
            sender: activeUser,
            receiver: currentActiveTargetRecipient,
            text: txt,
            createdAt: serverTimestamp()
        });
    } catch(e) {
        alert("Real-time pipeline data submission delivery error occurred.");
    }
}

if(closeChatBtn) {
    closeChatBtn.addEventListener("click", () => {
        if(clearRealTimeSessionListener) { clearRealTimeSessionListener(); clearRealTimeSessionListener = null; }
        if(chatPaneView) chatPaneView.style.display = "none";
        if(usersListView) usersListView.style.display = "flex";
        buildMessengerChannelContext();
    });
}

buildMessengerChannelContext();

