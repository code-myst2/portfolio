// ===================================================================
// এই স্ক্রিপ্টটি এডমিন প্যানেলের অংশ না — এটা আপনার আসল পোর্টফোলিও
// ওয়েবসাইটের প্রতিটা পেজে বসাতে হবে যাতে analysis.html-এ ডেটা আসে।
//
// ব্যবহার: পোর্টফোলিও সাইটের প্রতিটা HTML পেজের </body> এর আগে বসান —
//   <script type="module" src="track.js"></script>
// এই ফাইলটা সম্পূর্ণ self-contained — আলাদা কোনো ফাইল কপি করার দরকার নেই।
// ===================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN6M3FTTvy6V2JmrqbiYOZyaOM88g5Rvc",
  authDomain: "test-pro-portfolio.firebaseapp.com",
  projectId: "test-pro-portfolio",
  storageBucket: "test-pro-portfolio.firebasestorage.app",
  messagingSenderId: "368597108521",
  appId: "1:368597108521:web:ea84f26576e757ee3c5938",
  measurementId: "G-70622PC5Q4",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getVisitorId() {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("visitor_id", id);
  }
  return id;
}

try {
  await addDoc(collection(db, "analytics_events"), {
    page: window.location.pathname,
    referrer: document.referrer || "",
    visitorId: getVisitorId(),
    ts: serverTimestamp(),
  });
} catch (err) {
  console.warn("ভিজিট ট্র্যাক করা যায়নি:", err.message);
}
