import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDsDfz6JhuFAv97zEe1UWT5JmUfeTmwRWY",
      authDomain: "patheticai.firebaseapp.com",
      projectId: "patheticai",
      storageBucket: "patheticai.firebasestorage.app",
      messagingSenderId: "879461950480",
      appId: "1:879461950480:web:571ab4f5ea4d9792205695",
      measurementId: "G-5WQ52J5ZYY"
    };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "John Doe",
      email: "john.doe@example.com",
      age: 30
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

addUser();
