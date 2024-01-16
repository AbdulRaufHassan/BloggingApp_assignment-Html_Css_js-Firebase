import { auth, onAuthStateChanged, signOut, collection, doc, getDoc, getDocs, db, query, where, onSnapshot, orderBy } from "./firebase-config.js"

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('navLinksParentDiv').innerHTML = `<a href="screens/dashboard.html" class="dashboardBtnStyle">Dashboard</a><a href="screens/profilePage.html" class="profileBtnStyle">${localStorage.getItem('myName') ? localStorage.getItem('myName') : 'Profile'}</a>
        <a id="logoutBtn" class="logoutBtnStyle">Logout</a>
      `
        const logoutUser = () => {
            signOut(auth).then(() => {
                location.href = 'screens/login.html';
            }).catch((error) => {
                console.log(error)
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn && logoutBtn.addEventListener('click', logoutUser);
    } else {
        document.getElementById('navLinksParentDiv').innerHTML = `<a href="screens/login.html" class="loginBtnStyle">Login</a>`
    }
});

let hours = new Date().getHours();
let greeting;
if (hours >= 5 && hours < 12) {
    greeting = "Good Morning";
} else if (hours >= 12 && hours < 17) {
    greeting = "Good Afternoon";
} else if (hours >= 17 && hours < 20) {
    greeting = "Good Evening";
} else {
    greeting = "Good Night";
}
document.querySelector('.headrTitle').innerText = `${greeting} Readers!`;
const getAllUsersBlogs = async () => {
    const allBlogsParentDiv = document.getElementById('allBlogsParentDiv')
    allBlogsParentDiv.innerHTML = '';
    const q = query(collection(db, "Blogs"), orderBy("blogDate", "desc"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        document.getElementById('loader_parentDiv').style.display = 'none';
        document.getElementById('NoBlogsHeadng').style.display = 'flex';
    }
    else {
        querySnapshot.forEach(async (blog) => {
            const docRef = doc(db, "Users", blog.data().userid);
            const docSnap = await getDoc(docRef);
            if (blog.data().userid !== localStorage.getItem('myId')) {
                allBlogsParentDiv.innerHTML += `
                        <div id="blog" data-userid="${blog.data().userid}">
                        <div>
                            <div id="blogProfileImageDiv"><img src="${docSnap.data().profilePicture}"></img></div>
                            <div>
                                <h4 id="blogTitle">${blog.data().blogTitle}</h4>
                                <h6 id="userName-blogDate">${docSnap.data().firstName} ${docSnap.data().lastName} - ${blog.data().blogDate.toDate().toDateString()}</h6>
                            </div>
                        </div>
                        <p id="blogDiscription">${blog.data().blogDiscription}</p>
                        <div>
                            <button class="selectedUserBlogShowBtn" onClick="changePage('${blog.data().userid}')" data-userid="${blog.data().userid}">see all from this user</button>
                        </div>
                    </div>`
            }
        });
        document.getElementById('custom-container').style.display = 'block';
        document.getElementById('loader_parentDiv').style.display = 'none';
    }

}
getAllUsersBlogs()


const changePage = (id) => {
    location.href = `screens/selectedUserBlogs.html?userid=${id}`;
}

window.changePage = changePage