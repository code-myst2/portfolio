# এডমিন প্যানেল — সেটআপ গাইড

## ফাইল স্ট্রাকচার
প্রতিটা HTML পেজের ভেতরেই তার CSS আর JS বসানো আছে (single-file) — শুধু `track.js` আলাদা থাকে, কারণ ওটা তোমার আসল পোর্টফোলিও সাইটে বসানোর জন্য:
```
admin-panel/
├── login.html          লগইন পেজ (CSS + JS সহ, single-file)
├── admin.html           ড্যাশবোর্ড — CSS + JS সহ, single-file
├── blog.html             ব্লগ ম্যানেজমেন্ট — CSS + JS সহ, single-file
├── project.html          প্রজেক্ট ম্যানেজমেন্ট — CSS + JS সহ, single-file
├── inbox.html            মেসেঞ্জারের মতো ইনবক্স — CSS + JS সহ, single-file
├── setting.html          সাইট সেটিংস — CSS + JS সহ, single-file
├── analysis.html         ভিজিটর এনালিটিক্স — CSS + JS সহ, single-file
└── track.js              🌐 পোর্টফোলিও সাইটে বসানোর জন্য (এনালিটিক্স ট্র্যাকার) — এটা আলাদা থাকে
```
প্রতিটা পেজে Firebase কনফিগ (`test-pro-portfolio`) আর Cloudinary প্রিসেট (cloud name: `dak8rgroe`, preset: `portfolio`) ইতিমধ্যে বসানো আছে — নতুন করে কিছু বসাতে হবে না।

## ধাপ ১ — Firebase প্রজেক্ট (আগে থেকেই সেট করা)
তোমার `test-pro-portfolio` Firebase প্রজেক্টের কনফিগ ইতিমধ্যে প্রতিটা HTML পেজে বসানো আছে। শুধু নিশ্চিত করো:
1. https://console.firebase.google.com এ গিয়ে **Build > Firestore Database** চালু আছে কিনা (Production mode)
2. **Build > Authentication > Sign-in method** থেকে "Email/Password" চালু আছে কিনা
3. **Authentication > Users** থেকে নিজের জন্য একটা ইউজার বানানো আছে কিনা (এই ইমেইল/পাসওয়ার্ড দিয়ে `login.html`-এ লগইন করবে)

নতুন Firebase প্রজেক্টে সুইচ করতে চাইলে প্রতিটা HTML ফাইলের ভেতরের `<script type="module">` ব্লকে থাকা `firebaseConfig` অবজেক্টটা বদলে দিতে হবে (৭টা ফাইলেই একই জায়গায় আছে)।

## ধাপ ২ — Cloudinary (আগে থেকেই সেট করা)
Cloud name (`dak8rgroe`) আর upload preset (`portfolio`) ইতিমধ্যে `blog.html` ও `project.html`-এর ভেতরে বসানো আছে (এই দুটো পেজেই ছবি আপলোড হয়)। শুধু নিশ্চিত করো:
1. https://cloudinary.com ড্যাশবোর্ডে **Settings > Upload > Upload presets**-এ `portfolio` নামের প্রিসেটটা **Unsigned** মোডে আছে

নতুন Cloudinary একাউন্টে সুইচ করতে চাইলে `blog.html` ও `project.html`-এর ভেতরের `cloudinaryConfig` অবজেক্টটা বদলে দিতে হবে।

## ধাপ ৩ — Firestore সিকিউরিটি রুলস
Firestore > Rules ট্যাবে গিয়ে এটা বসান, তারপর Publish করুন:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() { return request.auth != null; }

    match /blogs/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /projects/{id} { allow read: if true; allow write: if isAdmin(); }
    match /settings/{id} { allow read: if true; allow write: if isAdmin(); }

    match /conversations/{id} {
      allow read: if isAdmin();
      allow create: if true;            // ভিজিটর নতুন কথোপকথন শুরু করতে পারবে
      allow update, delete: if isAdmin();
      match /messages/{msgId} {
        allow read: if isAdmin();
        allow create: if true;          // ভিজিটর ও এডমিন উভয়ই মেসেজ পাঠাতে পারবে
      }
    }

    match /analytics_events/{id} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

## ধাপ ৪ — লোকালি চালানো
প্লেইন HTML/JS ফাইল হওয়ায় সরাসরি ব্রাউজারে খুললে ES modules কাজ করবে না — একটা লোকাল সার্ভার লাগবে:
```
cd admin-panel
python3 -m http.server 5500
```
তারপর ব্রাউজারে `http://localhost:5500/login.html` খুলুন।

## ধাপ ৫ — হোস্টিং
Firebase Hosting সবচেয়ে সহজ (ফ্রি):
```
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## এনালিটিক্স ডেটা পেতে
`track.js` ফাইলটা (সম্পূর্ণ self-contained, আর কিছু কপি করতে হবে না) আপনার **আসল পোর্টফোলিও ওয়েবসাইটে** কপি করে প্রতিটা পেজের `</body>` এর আগে এই লাইনটা বসান:
```html
<script type="module" src="track.js"></script>
```
তাহলে প্রতিটা ভিজিট `analysis.html`-এ দেখা যাবে।

## এখনো যা বাকি (পরের ধাপ)
- ইনবক্সে ভিজিটরদের মেসেজ পাঠানোর জন্য পাবলিক সাইটে একটা চ্যাট উইজেট বানানো
- পাবলিক পোর্টফোলিও সাইট, যা `blogs` ও `projects` কালেকশন থেকে ডেটা দেখাবে
