/* =========================================================
KENYAGRAM - MAIN JAVASCRIPT
Instagram-style social media functionality
========================================================= */

/* ================= STORAGE ================= */

const STORAGE_KEY = "kenyagram_posts";

let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

let currentUser = {
username: "kenyagram_user",
name: "Kenyagram User"
};

/* ================= HELPERS ================= */

function savePosts() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function escapeHTML(text) {
const div = document.createElement("div");
div.textContent = text;
return div.innerHTML;
}

function formatNumber(number) {
if (number >= 1000000) {
return (number / 1000000).toFixed(1) + "M";
}

```
if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
}

return number;
```

}

function generateID() {
return Date.now().toString() + Math.random().toString(36).slice(2);
}

/* ================= PAGE NAVIGATION ================= */

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll("[data-page]");

function showPage(pageName) {

```
pages.forEach(page => {
    page.classList.remove("active-page");
});

const target = document.getElementById(pageName);

if (target) {
    target.classList.add("active-page");
}

navItems.forEach(item => {
    item.classList.remove("active");

    if (item.dataset.page === pageName) {
        item.classList.add("active");
    }
});

window.scrollTo({
    top: 0,
    behavior: "smooth"
});

if (pageName === "home") {
    renderFeed();
}

if (pageName === "profile") {
    renderProfile();
}

if (pageName === "reels") {
    renderReels();
}
```

}

document.addEventListener("click", function(event) {

```
const navigationButton =
    event.target.closest("[data-page]");

if (!navigationButton) return;

const page = navigationButton.dataset.page;

if (page) {
    showPage(page);
}
```

});

/* ================= FEED ================= */

const feed = document.querySelector(".feed");

function renderFeed() {

```
if (!feed) return;

feed.innerHTML = "";

if (posts.length === 0) {

    feed.innerHTML = `
        <article class="post">

            <div class="post-header">

                <div class="user-avatar">
                    KG
                </div>

                <div class="post-user">
                    <strong>kenyagram</strong>
                    <span>Welcome to Kenyagram</span>
                </div>

                <button class="more-button">
                    •••
                </button>

            </div>

            <div class="post-media welcome-media">

                <div class="welcome-logo">
                    K
                </div>

                <h2>Welcome to Kenyagram</h2>

                <p>
                    Share your first photo or video.
                </p>

            </div>

        </article>
    `;

    return;
}


posts
    .slice()
    .reverse()
    .forEach(post => {

        const article = document.createElement("article");

        article.className = "post";

        article.dataset.id = post.id;

        const mediaHTML =
            post.type === "video"
                ? `<video src="${post.media}" controls playsinline></video>`
                : `<img src="${post.media}" alt="Kenyagram post">`;

        article.innerHTML = `

            <div class="post-header">

                <div class="user-avatar">
                    ${escapeHTML(
                        post.username
                            .slice(0, 2)
                            .toUpperCase()
                    )}
                </div>

                <div class="post-user">

                    <strong>
                        ${escapeHTML(post.username)}
                    </strong>

                    <span>
                        ${post.time || "Just now"}
                    </span>

                </div>

                <button class="more-button">
                    •••
                </button>

            </div>


            <div class="post-media">

                ${mediaHTML}

            </div>


            <div class="post-actions">

                <div class="left-actions">

                    <button
                        class="action-btn like-button ${
                            post.liked ? "liked" : ""
                        }"
                        title="Like"
                    >
                        ${post.liked ? "♥" : "♡"}
                    </button>


                    <button
                        class="action-btn comment-button"
                        title="Comment"
                    >
                        💬
                    </button>


                    <button
                        class="action-btn share-button"
                        title="Share"
                    >
                        ➤
                    </button>

                </div>


                <button
                    class="action-btn save-button ${
                        post.saved ? "saved" : ""
                    }"
                    title="Save"
                >
                    ${post.saved ? "🔖" : "🔖"}
                </button>

            </div>


            <div class="post-info">

                <strong>
                    ${formatNumber(post.likes || 0)}
                    likes
                </strong>

                <p>

                    <strong>
                        ${escapeHTML(post.username)}
                    </strong>

                    ${escapeHTML(post.caption || "")}

                </p>


                <button class="view-comments">

                    View comments

                </button>


                <div class="comment-box">

                    <input
                        class="comment-input"
                        placeholder="Add a comment..."
                        maxlength="300"
                    >

                    <button class="post-comment">
                        Post
                    </button>

                </div>

            </div>

        `;


        feed.appendChild(article);

    });
```

}

/* ================= LIKE ================= */

document.addEventListener("click", function(event) {

```
const likeButton =
    event.target.closest(".like-button");

if (!likeButton) return;

const postElement =
    likeButton.closest(".post");

if (!postElement) return;

const id = postElement.dataset.id;

const post =
    posts.find(item => item.id === id);

if (!post) return;

post.liked = !post.liked;

post.likes =
    Math.max(
        0,
        (post.likes || 0) +
        (post.liked ? 1 : -1)
    );

savePosts();

renderFeed();
```

});

/* ================= SAVE ================= */

document.addEventListener("click", function(event) {

```
const saveButton =
    event.target.closest(".save-button");

if (!saveButton) return;

const postElement =
    saveButton.closest(".post");

if (!postElement) return;

const id = postElement.dataset.id;

const post =
    posts.find(item => item.id === id);

if (!post) return;

post.saved = !post.saved;

savePosts();

renderFeed();
```

});

/* ================= COMMENTS ================= */

document.addEventListener("click", function(event) {

```
const commentButton =
    event.target.closest(".post-comment");

if (!commentButton) return;

const postElement =
    commentButton.closest(".post");

const input =
    postElement.querySelector(".comment-input");

const text =
    input.value.trim();

if (!text) return;

const post =
    posts.find(
        item =>
            item.id === postElement.dataset.id
    );

if (!post) return;

if (!post.comments) {
    post.comments = [];
}

post.comments.push({
    username: currentUser.username,
    text: text
});

input.value = "";

savePosts();

alert("Comment posted!");
```

});

/* ================= SHARE ================= */

document.addEventListener("click", async function(event) {

```
const shareButton =
    event.target.closest(".share-button");

if (!shareButton) return;

const postElement =
    shareButton.closest(".post");

const url =
    window.location.href +
    "#post-" +
    postElement.dataset.id;

try {

    if (navigator.share) {

        await navigator.share({
            title: "Kenyagram",
            text: "Check out this post on Kenyagram!",
            url: url
        });

    } else {

        await navigator.clipboard.writeText(url);

        alert("Post link copied!");

    }

} catch (error) {

    console.log("Share cancelled.");

}
```

});

/* ================= CREATE POST ================= */

const fileInput =
document.getElementById("fileInput");

const uploadButton =
document.getElementById("uploadButton");

const uploadStep =
document.querySelector(".upload-step");

const editorStep =
document.querySelector(".editor-step");

const previewContainer =
document.querySelector(".editor-preview");

const captionInput =
document.getElementById("captionInput");

const publishButton =
document.getElementById("publishButton");

const cancelCreateButton =
document.getElementById("cancelCreateButton");

let selectedFile = null;
let selectedMediaURL = null;

/* OPEN FILE PICKER */

if (uploadButton && fileInput) {

```
uploadButton.addEventListener("click", function() {

    fileInput.click();

});
```

}

/* SELECT FILE */

if (fileInput) {

```
fileInput.addEventListener("change", function() {

    const file = fileInput.files[0];

    if (!file) return;

    if (
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
    ) {

        alert(
            "Please select an image or video."
        );

        fileInput.value = "";

        return;
    }


    selectedFile = file;

    selectedMediaURL =
        URL.createObjectURL(file);


    if (uploadStep) {

        uploadStep.classList.add("hidden");

    }

    if (editorStep) {

        editorStep.classList.remove("hidden");

    }


    if (previewContainer) {

        previewContainer.innerHTML = "";

        if (file.type.startsWith("video/")) {

            previewContainer.innerHTML = `
                <video
                    src="${selectedMediaURL}"
                    controls
                    autoplay
                    muted
                    playsinline
                ></video>
            `;

        } else {

            previewContainer.innerHTML = `
                <img
                    src="${selectedMediaURL}"
                    alt="Preview"
                >
            `;

        }

    }

});
```

}

/* CANCEL CREATE */

if (cancelCreateButton) {

```
cancelCreateButton.addEventListener(
    "click",
    resetCreate
);
```

}

/* RESET CREATE */

function resetCreate() {

```
selectedFile = null;

if (selectedMediaURL) {

    URL.revokeObjectURL(
        selectedMediaURL
    );

}

selectedMediaURL = null;


if (fileInput) {

    fileInput.value = "";

}

if (captionInput) {

    captionInput.value = "";

}

if (editorStep) {

    editorStep.classList.add("hidden");

}

if (uploadStep) {

    uploadStep.classList.remove("hidden");

}
```

}

/* PUBLISH */

if (publishButton) {

```
publishButton.addEventListener(
    "click",
    function() {

        if (!selectedFile) {

            alert(
                "Please choose a photo or video first."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = function(event) {

            const media =
                event.target.result;


            const newPost = {

                id: generateID(),

                username:
                    currentUser.username,

                name:
                    currentUser.name,

                media: media,

                type:
                    selectedFile.type.startsWith(
                        "video/"
                    )
                        ? "video"
                        : "image",

                caption:
                    captionInput
                        ? captionInput.value.trim()
                        : "",

                likes: 0,

                liked: false,

                saved: false,

                comments: [],

                time: "Just now",

                createdAt:
                    Date.now()

            };


            posts.push(newPost);

            savePosts();

            resetCreate();

            showPage("home");

            alert(
                "Your post has been published!"
            );

        };


        reader.readAsDataURL(
            selectedFile
        );

    }
);
```

}

/* ================= PROFILE ================= */

function renderProfile() {

```
const profileGrid =
    document.querySelector(".profile-grid");

if (!profileGrid) return;

profileGrid.innerHTML = "";


const userPosts =
    posts.filter(
        post =>
            post.username ===
            currentUser.username
    );


if (userPosts.length === 0) {

    profileGrid.innerHTML = `

        <div class="profile-empty">

            <div>📷</div>

            <p>
                You haven't posted anything yet.
            </p>

        </div>

    `;

    updateProfileStats(0);

    return;

}


userPosts
    .slice()
    .reverse()
    .forEach(post => {

        const item =
            document.createElement("div");

        item.className =
            "profile-grid-item";


        if (post.type === "video") {

            item.innerHTML = `
                <video
                    src="${post.media}"
                    muted
                    playsinline
                ></video>
            `;

        } else {

            item.innerHTML = `
                <img
                    src="${post.media}"
                    alt="Post"
                >
            `;

        }


        profileGrid.appendChild(item);

    });


updateProfileStats(
    userPosts.length
);
```

}

/* PROFILE STATS */

function updateProfileStats(postCount) {

```
const postStat =
    document.querySelector(
        "[data-post-count]"
    );

if (postStat) {

    postStat.textContent =
        postCount;

}
```

}

/* ================= REELS ================= */

function renderReels() {

```
const reelsContainer =
    document.querySelector(
        ".reels-container"
    );

if (!reelsContainer) return;


const reels =
    posts.filter(
        post =>
            post.type === "video"
    );


if (reels.length === 0) {

    reelsContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                ▶
            </div>

            <h2>
                No Reels Yet
            </h2>

            <p>
                Share your first video.
            </p>

            <button
                class="primary-button"
                data-page="create"
            >
                Create Reel
            </button>

        </div>

    `;

    return;

}


reelsContainer.innerHTML = "";


reels
    .slice()
    .reverse()
    .forEach(post => {

        const reel =
            document.createElement("div");

        reel.className = "post";


        reel.innerHTML = `

            <div class="post-header">

                <div class="user-avatar">
                    ${escapeHTML(
                        post.username
                            .slice(0, 2)
                            .toUpperCase()
                    )}
                </div>

                <div class="post-user">

                    <strong>
                        ${escapeHTML(
                            post.username
                        )}
                    </strong>

                </div>

            </div>


            <div class="post-media">

                <video
                    src="${post.media}"
                    controls
                    playsinline
                    style="width:100%;max-height:750px;"
                ></video>

            </div>


            <div class="post-info">

                <strong>
                    ${formatNumber(
                        post.likes || 0
                    )}
                    likes
                </strong>

                <p>
                    ${escapeHTML(
                        post.caption || ""
                    )}
                </p>

            </div>

        `;


        reelsContainer.appendChild(reel);

    });
```

}

/* ================= SEARCH ================= */

const searchInput =
document.querySelector(
".search-box input"
);

if (searchInput) {

```
searchInput.addEventListener(
    "input",
    function() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const results =
            document.querySelector(
                ".search-results"
            );


        if (!results) return;


        if (!query) {

            results.innerHTML = "";

            return;

        }


        const usernames = [
            "kenyagram",
            "football",
            "messi",
            "manchestercity"
        ];


        const filtered =
            usernames.filter(
                username =>
                    username
                        .toLowerCase()
                        .includes(query)
            );


        results.innerHTML =
            filtered.map(
                username => `

                    <div class="search-user">

                        <div class="user-avatar">
                            ${username
                                .slice(0,2)
                                .toUpperCase()}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    username
                                )}
                            </strong>

                            <p>
                                Kenyagram user
                            </p>

                        </div>

                        <button>
                            Follow
                        </button>

                    </div>

                `
            ).join("");

    }
);
```

}

/* ================= MODAL COMMENTS ================= */

const commentModal =
document.querySelector(".modal");

const commentsList =
document.querySelector(".comments-list");

const modalClose =
document.querySelector(".modal-close");

function closeCommentModal() {

```
if (commentModal) {

    commentModal.classList.remove(
        "show"
    );

}
```

}

if (modalClose) {

```
modalClose.addEventListener(
    "click",
    closeCommentModal
);
```

}

if (commentModal) {

```
commentModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            commentModal
        ) {

            closeCommentModal();

        }

    }
);
```

}

/* ================= INITIALIZE ================= */

document.addEventListener(
"DOMContentLoaded",
function() {

```
    renderFeed();

    renderProfile();

    renderReels();

    showPage("home");

}
```

);

/* =========================================================
KENYAGRAM READY
========================================================= */
