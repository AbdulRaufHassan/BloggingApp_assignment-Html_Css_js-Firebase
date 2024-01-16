import { auth, reauthenticateWithCredential, storage, ref, uploadBytesResumable, getDownloadURL, updatePassword, doc, db, getDoc, updateDoc, EmailAuthProvider } from "./firebase-config.js";

let userImageUrl;
let isUserImageSelect = false;
document.getElementById('profilePictureShowEl').addEventListener('load', () => {
    if (!isUserImageSelect) {
        userImageUrl = document.getElementById('profilePictureShowEl').src
    }
});
const addImageInStorage = (file) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `Users_profileImages/${auth.currentUser.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })
}
const profilePictureSelect = document.getElementById('ProfilePictureSelect');
profilePictureSelect && profilePictureSelect.addEventListener('change', () => {
    let reader = new FileReader();
    reader.onload = function (e) {
        var imageDataUrl = e.target.result;
        document.getElementById('profilePictureShowEl').src = `${imageDataUrl}`;
        isUserImageSelect = true;
    };
    reader.readAsDataURL(profilePictureSelect.files[0]);
    document.getElementById('selectProfielImageBtn').style.display = 'none';
    const save_cancel_Btns = document.getElementById('save_cancel_Btns');
    save_cancel_Btns.style.display = 'flex';
    document.getElementById('saveProfileImage').addEventListener('click', () => {
        isUserImageSelect = false;
        let promise = addImageInStorage(profilePictureSelect.files[0]);
        promise.then(async (url) => {
            const docRef = doc(db, "Users", auth.currentUser.uid);
            await updateDoc(docRef, {
                profilePicture: url
            });
        })
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Profile picture saved successfully",
            showConfirmButton: false,
            timer: 1500
        });
        save_cancel_Btns.style.display = 'none';
        document.getElementById('selectProfielImageBtn').style.display = 'block';
        profilePictureSelect.value = '';
    })
    document.getElementById('cancelImageSave').addEventListener('click', () => {
        document.getElementById('profilePictureShowEl').src = userImageUrl;
        save_cancel_Btns.style.display = 'none';
        document.getElementById('selectProfielImageBtn').style.display = 'block';
        profilePictureSelect.value = '';
    })
})

let name = localStorage.getItem('myName');
document.getElementById('userFirstNameChngInput').value = `${name.slice(0, name.lastIndexOf(' '))}`
document.getElementById('userLastNameChngInput').value = `${name.slice(name.indexOf(' '))}`
document.getElementById('editNameBtn').addEventListener('click', () => {
    const firstNameInput = document.getElementById('userFirstNameChngInput');
    const lastNameInput = document.getElementById('userLastNameChngInput');
    const validationText = document.createElement('p');
    validationText.setAttribute('class', 'validatnText');
    if (!firstNameInput.value.trim()) {
        validationText.innerText = 'Please enter your first name';
        firstNameInput.nextElementSibling.nodeName === 'INPUT' && firstNameInput.after(validationText);
        firstNameInput.addEventListener('keyup', () => {
            if (firstNameInput.value.trim().length < 3 && firstNameInput.value.trim().length != 0) {
                validationText.innerText = 'First name should be at least 3 characters long';
                firstNameInput.nextElementSibling.nodeName === 'INPUT' && firstNameInput.after(validationText);
            } else {
                validationText.remove()
            }
        })
    } else if (firstNameInput.value.trim().length < 3) {
        validationText.innerText = 'First name should be at least 3 characters long';
        firstNameInput.nextElementSibling.nodeName === 'INPUT' && firstNameInput.after(validationText);
        firstNameInput.addEventListener('keyup', () => {
            if (firstNameInput.value.trim().length < 3 && firstNameInput.value.trim().length != 0) {
                validationText.innerText = 'First name should be at least 3 characters long';
                firstNameInput.nextElementSibling.nodeName === 'INPUT' && firstNameInput.after(validationText);
            } else {
                validationText.remove()
            }
        })
    } else if (!lastNameInput.value.trim()) {
        validationText.innerText = 'Please enter your last name';
        !lastNameInput.nextElementSibling && lastNameInput.after(validationText);
        lastNameInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else {
        (async () => {
            try {
                const docRef = doc(db, 'Users', auth.currentUser.uid);
                await updateDoc(docRef, {
                    firstName: firstNameInput.value.trim(),
                    lastName: lastNameInput.value.trim()
                });
                document.getElementById('editNameModalCloseBtn').click();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Your name has been successfully edited",
                    showConfirmButton: false,
                    timer: 1500
                });
                document.getElementById('userNameShow').innerText = `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`;
                localStorage.setItem('myName', `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`)
            } catch (e) {
            }
        })()
    }
})

const reauthenticateUser = async (currentPassword) => {
    const user = auth.currentUser;
    const email = user.email;
    const credential = EmailAuthProvider.credential(email, currentPassword);
    console.log(credential)
    return reauthenticateWithCredential(user, credential).then(() => { }).catch((error) => { });
}

const changePassword = () => {
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');
    const validationText = document.createElement('p');
    validationText.setAttribute('class', 'validatnText');
    if (!newPasswordInput.value.trim()) {
        validationText.innerText = 'Please enter your new password';
        if (confirmNewPasswordInput.nextElementSibling.innerText === 'Password and Confirm Password not match') {
            confirmNewPasswordInput.nextElementSibling.remove()
        }
        newPasswordInput.nextElementSibling.nodeName === 'INPUT' && newPasswordInput.after(validationText);
        newPasswordInput.addEventListener('keyup', () => {
            if (confirmNewPasswordInput.nextElementSibling.innerText === 'Password and Confirm Password not match') {
                confirmNewPasswordInput.nextElementSibling.remove()
            }

            if (newPasswordInput.value.trim().length < 8 && newPasswordInput.value.trim().length != 0) {
                validationText.innerText = 'Password length must be atleast 8 characters';
                newPasswordInput.nextElementSibling.nodeName === 'INPUT' && newPasswordInput.after(validationText);
            }
            else {
                validationText.remove()
            }
        })
    } else if (newPasswordInput.value.trim().length < 8) {
        validationText.innerText = 'Password length must be atleast 8 characters';
        if (confirmNewPasswordInput.nextElementSibling.innerText === 'Password and Confirm Password not match') {
            confirmNewPasswordInput.nextElementSibling.remove()
        }
        newPasswordInput.nextElementSibling.nodeName === 'INPUT' && newPasswordInput.after(validationText);
        newPasswordInput.addEventListener('keyup', () => {
            if (confirmNewPasswordInput.nextElementSibling.innerText === 'Password and Confirm Password not match') {
                confirmNewPasswordInput.nextElementSibling.remove()
            }

            if (newPasswordInput.value.trim().length < 8 && newPasswordInput.value.trim().length != 0) {
                validationText.innerText = 'Password length must be atleast 8 characters';
                newPasswordInput.nextElementSibling.nodeName === 'INPUT' && newPasswordInput.after(validationText);
            }
            else {
                validationText.remove()
            }
        })
    } else if (!confirmNewPasswordInput.value.trim()) {
        validationText.innerText = 'Please confirm your password';
        confirmNewPasswordInput.nextElementSibling.nodeName === 'BUTTON' && confirmNewPasswordInput.after(validationText);
        confirmNewPasswordInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else if (confirmNewPasswordInput.value.trim() !== newPasswordInput.value.trim()) {
        validationText.innerText = 'Password and Confirm Password not match';
        confirmNewPasswordInput.nextElementSibling.nodeName === 'BUTTON' && confirmNewPasswordInput.after(validationText);
        confirmNewPasswordInput.addEventListener('keyup', () => {
            validationText.remove();
        })
    } else {
        (async () => {
            try {
                await reauthenticateUser(newPasswordInput.value.trim());
                updatePassword(auth.currentUser, newPasswordInput.value.trim()).then(() => {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Password updated successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    newPasswordInput.value = '';
                    confirmNewPasswordInput.value = '';
                    validationText.remove();
                }).catch((error) => {
                    console.log(error);
                });

            } catch (e) {
                console.log(e)
            }
        })();
    }
}

let updatePasswordBtn = document.getElementById('passwordChangeBtn');
updatePasswordBtn.addEventListener('click', changePassword)

