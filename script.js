/* =========================================================
KENYAGRAM - SCRIPT.JS
Navigation + Create Post + Feed
========================================================= */

const STORAGE_KEY = "kenyagram_posts";

let posts = JSON.parse(
localStorage.getItem(STORAGE_KEY) || "[]"
);

const currentUser = {
username: "kenyagram_user",
name: "Kenyagram User"
};

/* =========================================================
SAVE POSTS
========================================================= */

function savePosts() {
localStorage.setItem(
STORAGE_KEY,
JSON.stringify(posts)
);
}

/* =========================================================
PAGE NAVIGATION
========================================================= */

function openPage(pageName) {

```
const pages = document.querySelectorAll(".page");

pages.forEach(function(page) {

    page.classList.remove("active-page");

    page.style.display = "none";

});


const selectedPage =
    document.getElementById(pageName);


if (!selectedPage) {

    console.log(
        "Page does not exist:",
        pageName
    );

    return;

}


selectedPage.classList.add("active-page");

selectedPage.style.display = "block";


/* Update active icon */

const buttons =
    document.querySelectorAll(
        "[data-page]"
    );


buttons.forEach(function(button) {

    button.classList.remove("active");


    if (
        button.getAttribute("data-page")
        === pageName
    ) {

        button.classList.add("active");

    }

});


window.scrollTo(0, 0);


/* Refresh pages */

if (
    pageName === "home" &&
    typeof renderFeed === "function"
) {

    renderFeed();

}


if (
    pageName === "profile" &&
    typeof renderProfile === "function"
) {

    renderProfile();

}


if (
    pageName === "reels" &&
    typeof renderReels === "function"
) {

    renderReels();

}
```

}

/* =========================================================
MAKE ALL NAVIGATION BUTTONS WORK
========================================================= */

document.addEventListener(
"click",
function(event) {

```
    const button =
        event.target.closest(
            "[data-page]"
        );


    if (!button) return;


    const page =
        button.getAttribute(
            "data-page"
        );


    if (!page) return;


    event.preventDefault();


    openPage(page);

}
```

);

/* =========================================================
CREATE POST
========================================================= */

let selectedFile = null;

let selectedMediaURL = null;

const fileInput =
document.getElementById(
"fileInput"
);

const uploadButton =
document.getElementById(
"uploadButton"
);

const uploadStep =
document.querySelector(
".upload-step"
);

const editorStep =
document.querySelector(
".editor-step"
);

const previewContainer =
document.querySelector(
".editor-preview"
);

const captionInput =
document.getElementById(
"captionInput"
);

const publishButton =
document.getElementById(
"publishButton"
);

/* OPEN FILE SELECTOR */

if (uploadButton && fileInput) {

```
uploadButton.addEventListener(
    "click",
    function() {

        fileInput.click();

    }
);
```

}

/* SELECT IMAGE OR VIDEO */

if (fileInput) {

```
fileInput.addEventListener(
    "change",
    function() {

        const file =
            fileInput.files[0];


        if (!file) return;


        if (
            !file.type.startsWith(
                "image/"
            ) &&
            !file.type.startsWith(
                "video/"
            )
        ) {

            alert(
                "Please select an image or video."
            );

            return;

        }


        selectedFile = file;


        selectedMediaURL =
            URL.createObjectURL(
                file
            );


        if (uploadStep) {

            uploadStep.classList.add(
                "hidden"
            );

        }


        if (editorStep) {

            editorStep.classList.remove(
                "hidden"
            );

        }


        if (previewContainer) {

            previewContainer.innerHTML = "";


            if (
                file.type.startsWith(
                    "video/"
                )
            ) {

                previewContainer.innerHTML = `

                    <video
                        src="${selectedMediaURL}"
                        controls
                        autoplay
                        muted
                        playsinline>
                    </video>

                `;

            } else {

                previewContainer.innerHTML = `

                    <img
                        src="${selectedMediaURL}"
                        alt="Selected photo">

                `;

            }

        }

    }
);
```

}

/* =========================================================
PUBLISH POST
========================================================= */

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


        reader.onload =
            function(event) {

                const post = {

                    id:
                        Date.now().toString(),

                    username:
                        currentUser.username,

                    name:
                        currentUser.name,

                    media:
                        event.target.result,

                    type:
                        selectedFile.type
                            .startsWith(
                                "video/"
                            )
                            ? "video"
                            : "image",

                    caption:
                        captionInput
                            ? captionInput.value
                                .trim()
                            : "",

                    likes: 0,

                    liked: false,

                    saved: false,

                    comments: [],

                    time: "Just now",

                    createdAt:
                        Date.now()

                };


                posts.push(post);

                savePosts();


                resetCreate();


                alert(
                    "Your post has been published!"
                );


                openPage("home");

            };


        reader.readAsDataURL(
            selectedFile
        );

    }
);
```

}

/* =========================================================
RESET CREATE PAGE
========================================================= */

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


if (previewContainer) {

    previewContainer.innerHTML = "";

}


if (editorStep) {

    editorStep.classList.add(
        "hidden"
    );

}


if (uploadStep) {

    uploadStep.classList.remove(
        "hidden"
    );

}
```

}

/* =========================================================
FEED
========================================================= */

function renderFeed() {

```
const feed =
    document.querySelector(
        ".feed"
    );


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

                    <strong>
                        kenyagram
                    </strong>

                    <span>
                        Welcome to Kenyagram
                    </span>

                </div>

            </div>


            <div class="post-media welcome-media">

                <div class="welcome-logo">
                    K
                </div>

                <h2>
                    Welcome to Kenyagram
                </h2>

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
    .forEach(function(post) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "post";


        article.innerHTML = `

            <div class="post-header">

                <div class="user-avatar">
                    KG
                </div>

                <div class="post-user">

                    <strong>
                        ${post.username}
                    </strong>

                    <span>
                        ${post.time}
                    </span>

                </div>

            </div>


            <div class="post-media">

                ${
                    post.type === "video"

                    ? `

                        <video
                            src="${post.media}"
                            controls
                            playsinline>
                        </video>

                      `

                    : `

                        <img
                            src="${post.media}"
                            alt="Kenyagram post">

                      `
                }

            </div>


            <div class="post-actions">

                <div class="left-actions">

                    <button
                        class="action-btn">
                        ♡
                    </button>

                    <button
                        class="action-btn">
                        💬
                    </button>

                    <button
                        class="action-btn">
                        ➤
                    </button>

                </div>


                <button
                    class="action-btn">
                    🔖
                </button>

            </div>


            <div class="post-info">

                <strong>
                    ${post.likes} likes
                </strong>

                <p>

                    <strong>
                        ${post.username}
                    </strong>

                    ${post.caption}

                </p>

            </div>

        `;


        feed.appendChild(
            article
        );

    });
```

}

/* =========================================================
PROFILE
========================================================= */

function renderProfile() {

```
const grid =
    document.querySelector(
        ".profile-grid"
    );


if (!grid) return;


const userPosts =
    posts.filter(
        function(post) {

            return (
                post.username ===
                currentUser.username
            );

        }
    );


grid.innerHTML = "";


if (userPosts.length === 0) {

    grid.innerHTML = `

        <div class="profile-empty">

            <div>
                📷
            </div>

            <p>
                You haven't posted anything yet.
            </p>

        </div>

    `;

    return;

}


userPosts
    .slice()
    .reverse()
    .forEach(function(post) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "profile-grid-item";


        if (
            post.type === "video"
        ) {

            item.innerHTML = `

                <video
                    src="${post.media}"
                    muted
                    playsinline>
                </video>

            `;

        } else {

            item.innerHTML = `

                <img
                    src="${post.media}"
                    alt="Post">

            `;

        }


        grid.appendChild(
            item
        );

    });
```

}

/* =========================================================
REELS
========================================================= */

function renderReels() {

```
const container =
    document.querySelector(
        ".reels-container"
    );


if (!container) return;


const reels =
    posts.filter(
        function(post) {

            return (
                post.type ===
                "video"
            );

        }
    );


container.innerHTML = "";


if (reels.length === 0) {

    container.innerHTML = `

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
                data-page="create">

                Create Reel

            </button>

        </div>

    `;

    return;

}


reels
    .slice()
    .reverse()
    .forEach(function(post) {

        const reel =
            document.createElement(
                "div"
            );


        reel.className =
            "post";


        reel.innerHTML = `

            <div class="post-header">

                <div class="user-avatar">
                    KG
                </div>

                <div class="post-user">

                    <strong>
                        ${post.username}
                    </strong>

                </div>

            </div>


            <div class="post-media">

                <video
                    src="${post.media}"
                    controls
                    playsinline>
                </video>

            </div>


            <div class="post-info">

                <p>
                    ${post.caption}
                </p>

            </div>

        `;


        container.appendChild(
            reel
        );

    });
```

}

/* =========================================================
START WEBSITE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
function() {

```
    /*
     * IMPORTANT:
     * Home is the first page shown.
     */

    const allPages =
        document.querySelectorAll(
            ".page"
        );


    allPages.forEach(
        function(page) {

            page.style.display =
                "none";

            page.classList.remove(
                "active-page"
            );

        }
    );


    const home =
        document.getElementById(
            "home"
        );


    if (home) {

        home.style.display =
            "block";

        home.classList.add(
            "active-page"
        );

    }


    renderFeed();

    renderProfile();

    renderReels();

}
```

);
