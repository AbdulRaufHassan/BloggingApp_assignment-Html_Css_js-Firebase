import { auth, onAuthStateChanged, deleteUser, db, doc, getDoc, setDoc } from "./firebase-config.js";
import { getAllBlogs } from "./dashboard.js";
const checkuserAuth = () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            localStorage.setItem('myId', user.uid);
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.data()) {
                localStorage.setItem('myName',`${docSnap.data().firstName} ${docSnap.data().lastName}`);
                if (location.pathname === '/screens/login.html' || location.pathname === '/screens/signup.html') {
                    document.getElementById('login-signup-body').style.display = 'none';
                    document.getElementById('login-signup-loader').style.display = 'flex';
                    if (location.pathname != '/screens/dashboard.html') {
                        location.href = './dashboard.html'
                    }
                }
                if (location.pathname != '/screens/login.html' && location.pathname != '/screens/signup.html') {
                    if (location.pathname == '/screens/dashboard.html') {
                        const userName = document.getElementById('userName');
                        userName.innerText = `${docSnap.data().firstName} ${docSnap.data().lastName}`;
                        getAllBlogs(user.uid);
                    }
                    if (location.pathname == '/screens/profilePage.html') {
                        document.getElementById('profilePictureShowEl').src = docSnap.data().profilePicture;
                        document.getElementById('userNameShow').innerText = `${docSnap.data().firstName} ${docSnap.data().lastName}`;
                    }
                    document.getElementById('other-pages-body').style.display = 'block'
                    document.getElementById('other-pages-loader').style.display = 'none'
                }
            } else {
                const firstNameInput = document.getElementById('firstNameInput');
                const lastNameInput = document.getElementById('lastNameInput');
                const emailInput = document.getElementById('signupEmailInput');
                const passwordInput = document.getElementById('passwordInput');
                const docRef = await setDoc(doc(db, "Users", user.uid), {
                    firstName: firstNameInput.value.trim(),
                    lastName: lastNameInput.value.trim(),
                    emailAddress: emailInput.value.trim(),
                    password: passwordInput.value,
                    profilePicture: 'https://firebasestorage.googleapis.com/v0/b/blogging-app-assignment-1b6e4.appspot.com/o/default-profile-picture.png?alt=media&token=c8bdb845-3028-4aff-9f51-d3c2c9f4ad26'
                });
                location.href = './dashboard.html'
            }
        } else {
            document.getElementById('login-signup-body') ? document.getElementById('login-signup-body').style.display = 'block' : '';
            document.getElementById('login-signup-loader') ? document.getElementById('login-signup-loader').style.display = 'none' : '';
            if (location.pathname != '/screens/login.html' && location.pathname != '/screens/signup.html') {
                location.href = './login.html'
            }
        }
    });
}
window.onload = checkuserAuth;