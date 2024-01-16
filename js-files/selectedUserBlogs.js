import { auth, onAuthStateChanged, signOut, doc, getDoc, db, query, orderBy, where, collection, getDocs } from './firebase-config.js'

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('navLinksParentDiv').innerHTML = `<a href="dashboard.html" class="dashboardBtnStyle">Dashboard</a><a href="profilePage.html" class="profileBtnStyle">${localStorage.getItem('myName') ? localStorage.getItem('myName') : 'Profile'}</a>
        <a id="logoutBtn" class="logoutBtnStyle">Logout</a>
      `
        const logoutUser = () => {
            signOut(auth).then(() => {
                location.href = './login.html';
            }).catch((error) => {
                console.log(error)
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn && logoutBtn.addEventListener('click', logoutUser);
    } else {
        document.getElementById('navLinksParentDiv').innerHTML = `<a href="login.html" class="loginBtnStyle">Login</a>`
    }
});



let urlParams = new URLSearchParams(window.location.search);
let selectedUserid = urlParams.get('userid');

const blogs_userInfo_render = async (userid) => {
    try {
        const docRef = doc(db, "Users", userid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data()) {
            const selectedUserInfo = document.querySelector('.selectedUserInfo');
            selectedUserInfo.innerHTML = `
            <a href="mailto:${docSnap.data().emailAddress}" id="userEmailAddress">${docSnap.data().emailAddress}</a>
            <h1>${docSnap.data().firstName} ${docSnap.data().lastName}</h1>
            <div>
                <img src="${docSnap.data().profilePicture}">
            </div>
            `;
            document.getElementById('blogs-mainTitle').innerText = `All from ${docSnap.data().firstName} ${docSnap.data().lastName}`;
            const blogsParentDiv = document.getElementById('blogsParentDiv');
            const q = query(collection(db, "Blogs"), where("userid", "==", userid), orderBy("blogDate", "desc"));
            const querySnapshot = await getDocs(q);
            blogsParentDiv.innerHTML = '';
            querySnapshot.forEach((doc) => {
                blogsParentDiv.innerHTML += `
            <div id="blog">
            <div>
                <div id="blogProfileImageDiv"><img src="${docSnap.data().profilePicture}"></img></div>
                <div>
                    <h4 id="blogTitle">${doc.data().blogTitle}</h4>
                    <h6 id="userName-blogDate">${docSnap.data().firstName} ${docSnap.data().lastName} -
                    ${doc.data().blogDate.toDate().toDateString()}</h6>
                </div>
            </div>
            <p id="blogDiscription">${doc.data().blogDiscription}</p>
            </div>
            `

            });
            document.getElementById('custom-container').style.display = 'block';
            document.getElementById('loader_parentDiv').style.display = 'none';
        } else {
            console.log("No such document!");
        }
    } catch (e) {
        console.log(e)
    }
}

blogs_userInfo_render(selectedUserid)

