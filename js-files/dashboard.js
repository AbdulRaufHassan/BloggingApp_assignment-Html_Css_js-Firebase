import {
    auth, signOut, db,
    collection, addDoc, doc, query, where,
    getDocs, getDoc, serverTimestamp, orderBy,
    deleteDoc, updateDoc
} from './firebase-config.js';
const logoutUser = () => {
    event.preventDefault();
    signOut(auth).then(() => {
        location.href = './login.html';
    }).catch((error) => {
        console.log(error)
    });
}

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn && logoutBtn.addEventListener('click', logoutUser);

const getAllBlogs = async (userid) => {
    try {
        const docRef = doc(db, "Users", userid);
        const docSnap = await getDoc(docRef);
        let userFullName = `${docSnap.data().firstName} ${docSnap.data().lastName}`
        const blogsParentDiv = document.getElementById('blogsParentDiv');
        const q = query(collection(db, "Blogs"), where("userid", "==", `${userid}`), orderBy("blogDate", "desc"));
        blogsParentDiv.innerHTML = '';
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            document.querySelector('#blog_main_container h1').innerHTML = 'No blogs yet';
        }
        else {
            document.querySelector('#blog_main_container h1').innerHTML = 'My Blogs';
            querySnapshot.forEach((doc) => {
                blogsParentDiv.innerHTML += `<div id="blog" data-docid="${doc.id}">
        <div>
            <div id="blogProfileImageDiv"><img src="${docSnap.data().profilePicture}"></img></div>
            <div>
                <h4 id="blogTitle">${doc.data().blogTitle}</h4>
                <h6 id="userName-blogDate">${userFullName} - ${doc.data().blogDate.toDate().toDateString()}</h6>
            </div>
        </div>
        <p id="blogDiscription">
        ${doc.data().blogDiscription}
        </p>
        <div class="blogEditDeleteBtns">
            <button class="deleteBlogBtn" onClick="deleteBlog('${doc.id}')" data-docid="${doc.id}">Delete</button>
            <button class="editBlogBtn" onClick="editBlogBtnFunc()" data-docid="${doc.id}" data-bs-toggle="modal" data-bs-target="#editBlogModal">Edit</button>
        </div>
    </div>`;
            });
        }
        document.getElementById('blogsLoad_loader').style.display = 'none';
        document.getElementById('blog_main_container').style.display = 'block';

    } catch (e) {
        console.log(e)
    }
}


const editBlogBtnFunc = () => {
    let el = event.target
    let blog = el.parentElement.parentElement;
    let title = blog.querySelector('#blogTitle');
    let discription = blog.querySelector('#blogDiscription');
    document.getElementById('editBlogTitleInput').value = title.innerText;
    document.getElementById('editBlogDiscriptionInput').value = discription.innerText;
    document.getElementById('editBlogModal').setAttribute('data-editdocid', `${el.getAttribute('data-docid')}`)
}
window.editBlogBtnFunc = editBlogBtnFunc



const deleteBlog = (id) => {
    let el = event.target.parentElement.parentElement;
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this blog?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "Blogs", id));
                el.remove();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your blog has been deleted",
                    icon: "success"
                });
                if (document.getElementById('blogsParentDiv').children.length === 0) {
                    document.querySelector('#blog_main_container h1').innerHTML = 'No blogs yet';
                }
            }
            catch (e) {
                console.log(e)
            }

        }
    });
}
window.deleteBlog = deleteBlog

const addBlog = async () => {
    const blogTitleInput = document.getElementById('blogTitleInput');
    const blogDiscriptionInput = document.getElementById('blogDiscriptionInput');
    const blogsParentDiv = document.getElementById('blogsParentDiv');
    const validationText = document.createElement('p');
    validationText.setAttribute('class', 'validatnText');
    if (!blogTitleInput.value.trim()) {
        validationText.innerText = 'Please enter your blog title';
        blogTitleInput.nextElementSibling.nodeName === 'TEXTAREA' && blogTitleInput.after(validationText);
        blogTitleInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else if (blogTitleInput.value.trim().length < 5) {
        validationText.innerText = 'Blog title should be at least 5 characters long';
        blogTitleInput.nextElementSibling.nodeName === 'TEXTAREA' && blogTitleInput.after(validationText);
        blogTitleInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else if (!blogDiscriptionInput.value.trim()) {
        validationText.innerText = 'Please enter your blog discription';
        blogDiscriptionInput.nextElementSibling.nodeName === 'BUTTON' && blogDiscriptionInput.after(validationText);
        blogDiscriptionInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else if (blogDiscriptionInput.value.trim().length < 30) {
        validationText.innerText = 'Blog discription should be at least 30 characters long';
        blogDiscriptionInput.nextElementSibling.nodeName === 'BUTTON' && blogDiscriptionInput.after(validationText);
        blogDiscriptionInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    }
    else {
        try {
            const docRef = await addDoc(collection(db, "Blogs"), {
                blogTitle: blogTitleInput.value.trim(),
                blogDiscription: blogDiscriptionInput.value.trim(),
                userid: auth.currentUser.uid,
                blogDate: serverTimestamp()
            });
            getAllBlogs(auth.currentUser.uid)
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Blog added successfully!",
                showConfirmButton: false,
                timer: 1500
            });
            blogTitleInput.value = '';
            blogDiscriptionInput.value = '';
        } catch (e) {
            console.log(e)
        }
    }
}

const addBlogBtn = document.getElementById('addBlogBtn');
addBlogBtn && addBlogBtn.addEventListener('click', addBlog);

const editBlog = async () => {
    const editBlogTitleInput = document.getElementById('editBlogTitleInput');
    const editBlogDiscriptionInput = document.getElementById('editBlogDiscriptionInput');
    const validationText = document.createElement('p');
    validationText.setAttribute('class', 'validatnText');
    if (!editBlogTitleInput.value.trim()) {
        validationText.innerText = 'Please enter your blog title';
        editBlogTitleInput.nextElementSibling.nodeName === 'TEXTAREA' && editBlogTitleInput.after(validationText);
        editBlogTitleInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else if (editBlogTitleInput.value.trim().length < 5) {
        validationText.innerText = 'Blog title should be at least 5 characters long';
        editBlogTitleInput.nextElementSibling.nodeName === 'TEXTAREA' && editBlogTitleInput.after(validationText);
        editBlogTitleInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else if (!editBlogDiscriptionInput.value.trim()) {
        validationText.style.marginTop = '5px';
        validationText.innerText = 'Please enter your blog discription';
        !editBlogDiscriptionInput.nextElementSibling && editBlogDiscriptionInput.after(validationText);
        editBlogDiscriptionInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else if (editBlogDiscriptionInput.value.trim().length < 30) {
        validationText.style.marginTop = '5px';
        validationText.innerText = 'Blog discription should be at least 30 characters long';
        !editBlogDiscriptionInput.nextElementSibling && editBlogDiscriptionInput.after(validationText);
        editBlogDiscriptionInput.addEventListener('keyup', () => {
            validationText.remove()
        })
    } else {
        try {
            let docid = document.getElementById('editBlogModal').getAttribute('data-editdocid');
            const docRef = doc(db, 'Blogs', docid);
            const updateDoc_ = await updateDoc(docRef, {
                blogTitle: editBlogTitleInput.value,
                blogDiscription: editBlogDiscriptionInput.value,
                blogDate: serverTimestamp()
            });
            document.getElementById('editBlogModalCloseBtn').click();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your blog has been successfully edited",
                showConfirmButton: false,
                timer: 1500
            });
            getAllBlogs(auth.currentUser.uid)
        }
        catch (e) {
            console.log(e);
        }
    }
}
const saveEditChangesBtn = document.getElementById('saveEditChangesBtn');
saveEditChangesBtn && saveEditChangesBtn.addEventListener('click', editBlog)

export { getAllBlogs }

