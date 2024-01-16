import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from "./firebase-config.js";
const signup = () => {
    event.preventDefault();
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const emailInput = document.getElementById('signupEmailInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!firstNameInput.value.trim()) {
        displayValidation('Please enter your first name', firstNameInput);
    }

    else if (firstNameInput.value.length < 3) {
        displayValidation('First name should be at least 3 characters long', firstNameInput);
    }

    else if (!lastNameInput.value.trim()) {
        displayValidation('Please enter your last name', lastNameInput);
    }
    else if (!emailInput.value.trim()) {
        displayValidation('Please enter your email address', emailInput);
    }
    else if (emailInput.value.trim() && !emailRegex.test(emailInput.value)) {
        displayValidation('Invalid email address', emailInput)
    }
    else if (!passwordInput.value.trim()) {
        const confirmPasswordInput = document.getElementById('confirmPasswordInput');
        confirmPasswordInput.nextElementSibling.innerText === 'Password and Confirm Password not match' && confirmPasswordInput.nextElementSibling.remove();
        displayValidation('Please enter your password', passwordInput);
    }
    else if (passwordInput.value.trim().length < 8) {
        const confirmPasswordInput = document.getElementById('confirmPasswordInput');
        confirmPasswordInput.nextElementSibling.innerText === 'Password and Confirm Password not match' && confirmPasswordInput.nextElementSibling.remove();
        displayValidation('Password length must be atleast 8 characters', passwordInput);
    }
    else if (!confirmPasswordInput.value.trim()) {
        displayValidation('Please confirm your password', confirmPasswordInput);
    }
    else if (passwordInput.value.trim() !== confirmPasswordInput.value.trim() && passwordInput.nextElementSibling.nodeName === 'INPUT') {
        let validationText = document.createElement('p');
        validationText.setAttribute('class', 'validatnText');
        validationText.innerText = 'Password and Confirm Password not match';
        confirmPasswordInput.nextElementSibling.nodeName != 'P' && confirmPasswordInput.after(validationText);
        confirmPasswordInput.addEventListener('keyup', () => {
            if (!confirmPasswordInput.value.trim()) {
                displayValidation('Please confirm your password', confirmPasswordInput);
            } else {
                validationText.remove();
                if (!confirmPasswordInput.value.trim()) {
                    validationText.innerText = 'Please confirm your password';
                    confirmPasswordInput.nextElementSibling.nodeName != 'P' && confirmPasswordInput.after(validationText);
                }
            }
        })
    }
    else {
        createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
            .then((userCredential) => { })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/network-request-failed') {
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

const displayValidation = (message, inputElement) => {
    let validationText = document.createElement('p');
    validationText.setAttribute('class', 'validatnText');
    validationText.innerText = message;
    if (inputElement.nextElementSibling.nodeName === 'INPUT' || inputElement.nextElementSibling.nodeName === 'BUTTON') {
        inputElement.after(validationText);
    }
    inputElement.addEventListener('keyup', () => {
        if (inputElement.value.trim()) {
            validationText.remove();
            if ((message === 'First name should be at least 3 characters long' || message === 'Please enter your first name') && (inputElement.value.length < 3 && inputElement.value.length != 0)) {
                validationText.innerText = 'First name should be at least 3 characters long';
                inputElement.nextElementSibling.nodeName === 'INPUT' && inputElement.after(validationText);
            }
            if ((message === 'Password length must be atleast 8 characters' || message === 'Please enter your password') && (inputElement.value.length < 8 && inputElement.value.length != 0)) {
                const confirmPasswordInput = document.getElementById('confirmPasswordInput');
                confirmPasswordInput.nextElementSibling.innerText === 'Password and Confirm Password not match' && confirmPasswordInput.nextElementSibling.remove();
                validationText.innerText = 'Password length must be atleast 8 characters';
                inputElement.nextElementSibling.nodeName === 'INPUT' && inputElement.after(validationText);
            }
        }
        else {
            if (message === 'First name should be at least 3 characters long') {
                message = 'Please enter your first name'
            }
            if (message === 'Invalid email address') {
                message = 'Please enter your email address';
            }

            if (message === 'Password length must be atleast 8 characters') {
                message = 'Please enter your password';
            }

            validationText.innerText = message;
            if (inputElement.nextElementSibling.nodeName === 'INPUT' || inputElement.nextElementSibling.nodeName === 'BUTTON') {
                inputElement.after(validationText);
            }
        }
    });
}

const signupForm = document.getElementById('signupForm');
signupForm && signupForm.addEventListener('submit', signup);


