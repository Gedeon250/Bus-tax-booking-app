import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { doc, setDoc, getFirestore, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from './firebase.js';

// Register new user
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = registerForm['email'].value;
      const password = registerForm['password'].value;
      const name = registerForm['name'].value;
      const phone = registerForm['phone'].value;
      const userType = registerForm['user-type'].value;
      
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Add user to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          phone: phone,
          userType: userType,
          createdAt: new Date()
        });
        
        // Redirect based on user type
        window.location.href = userType === 'company' ? 'admin.html' : 'dashboard.html';
      } catch (error) {
        console.error("Error registering user:", error);
        alert(error.message);
      }
    });
  }
  
  // Login existing user
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = loginForm['email'].value;
      const password = loginForm['password'].value;
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const userData = userDoc.data();
        
        // Redirect based on user type
        window.location.href = userData.userType === 'company' ? 'admin.html' : 'dashboard.html';
      } catch (error) {
        console.error("Error logging in:", error);
        alert(error.message);
      }
    });
  }
});
