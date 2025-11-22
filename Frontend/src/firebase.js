// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // --- REPLACE THE VALUES BELOW WITH YOUR ACTUAL KEYS ---
// // You get these from the Firebase Console: Project Settings > General > Your Apps
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY_HERE",              // e.g., "AIzaSy..."
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",             // e.g., "social-mitra-123"
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Export the Authentication and Database services so other files can use them
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAILM5bHIKT8t6iTCuNr5U73seDRmKKS_Y",
  authDomain: "alife-stable.firebaseapp.com",
  projectId: "alife-stable",
  storageBucket: "alife-stable.firebasestorage.app",
  messagingSenderId: "455812686624",
  appId: "1:455812686624:web:f9c812d21431e509fd6d45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);