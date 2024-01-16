import { auth, signInWithEmailAndPassword, db, doc, getDoc } from "./firebase-config.js";
const login = () => {
    event.preventDefault();
    const emailInput = document.getElementById('loginEmailInput');
    const passwordInput = document.getElementById('LoginPasswordInput');
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let validationText = document.createElement('p');
    validationText.setAttribute('class', 'validatnText');
    if (!emailInput.value.trim()) {
        validationText.innerText = 'Please enter your email address';
        if (emailInput.nextElementSibling.nodeName === 'INPUT' || emailInput.nextElementSibling.nodeName === 'BUTTON') {
            emailInput.after(validationText);
        }
        emailInput.addEventListener('keyup', () => {
            if (!emailInput.value.trim()) {
                if (emailInput.nextElementSibling.nodeName === 'INPUT' || emailInput.nextElementSibling.nodeName === 'BUTTON') {
                    emailInput.after(validationText);
                }
            }
            else {
                validationText.remove()
            }
        })
    }
    else if (emailInput.value.trim() && !emailRegex.test(emailInput.value)) {
        validationText.innerText = 'Invalid email address';
        emailInput.nextElementSibling.nodeName === 'INPUT' && emailInput.after(validationText);

        emailInput.addEventListener('keyup', () => {
            if (!emailInput.value.trim()) {
                validationText.innerText = 'Please enter your email address';
                emailInput.nextElementSibling.nodeName === 'INPUT' && emailInput.after(validationText);
            }
            else {
                validationText.remove()
            }
        })
    }
    else if (!passwordInput.value.trim()) {
        validationText.innerText = 'Please enter your password';
        passwordInput.nextElementSibling.nodeName === 'BUTTON' && passwordInput.after(validationText);
        passwordInput.addEventListener('keyup', () => {
            if (!passwordInput.value.trim()) {
                passwordInput.nextElementSibling.nodeName === 'BUTTON' && passwordInput.after(validationText);
            }
            else {
                validationText.remove()
            }
        })
    }
    else {
        signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value.trim())
            .then(async (userCredential) => {
                document.getElementById('login-signup-body').style.display = 'none';
                document.getElementById('login-signup-loader').style.display = 'flex';
                location.href = './dashboard.html'
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message
                if (errorCode === 'auth/invalid-credential') {
                    Swal.fire({
                        position: "top-end",
                        icon: "info",
                        title: 'Your account does not exist. Please sign up to create a new account',
                        showConfirmButton: false,
                        timer: 4000
                    });
                } else if (errorCode === 'auth/network-request-failed') {
                    Swal.fire({
                        position: "top-end",
                        icon: "info",
                        title: 'Check your internet connection',
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "info",
                        title: `${errorMessage}`,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }

            });
    }
}

const loginForm = document.getElementById('loginForm');
loginForm && loginForm.addEventListener('submit', login);

