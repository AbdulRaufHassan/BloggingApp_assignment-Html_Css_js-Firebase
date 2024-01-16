import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, signOut,deleteUser,reauthenticateWithCredential ,updatePassword ,
    EmailAuthProvider 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    getFirestore, doc, setDoc, getDoc, getDocs,
    collection, addDoc, query, where, onSnapshot,
    serverTimestamp, orderBy, deleteDoc,updateDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyAl-8CG7ddcVFxffSuaxoUP7oXkvRDg-Dg",
    authDomain: "blogging-app-assignment-1b6e4.firebaseapp.com",
    projectId: "blogging-app-assignment-1b6e4",
    storageBucket: "blogging-app-assignment-1b6e4.appspot.com",
    messagingSenderId: "724980663612",
    appId: "1:724980663612:web:178a1bdc1878db216b0a39"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
    auth, createUserWithEmailAndPassword,reauthenticateWithCredential ,updatePassword ,
    signInWithEmailAndPassword, onAuthStateChanged, signOut,deleteUser,EmailAuthProvider,
    db, doc, setDoc, getDoc, collection, addDoc, getDocs ,
    query, where, onSnapshot, serverTimestamp, orderBy, deleteDoc,updateDoc,
    storage, ref, uploadBytesResumable, getDownloadURL
}