import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiZogum5Fc2qF8LtrCn1XpBq0IOPKCHQM",
  authDomain: "bustaxi-booking-app.firebaseapp.com",
  projectId: "bustaxi-booking-app",
  storageBucket: "bustaxi-booking-app.appspot.com",
  messagingSenderId: "872737217222",
  appId: "1:872737217222:web:4a64e852750cadd67055c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('register-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Your registration logic here
    });
  }

  document.getElementById('forgot-password-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
});