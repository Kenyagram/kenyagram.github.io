/* =====================================================
KENYAGRAM JAVASCRIPT
===================================================== */

let posts = JSON.parse(
localStorage.getItem("kenyagram_posts") || "[]"
);

/* ================= SAVE ================= */

function savePosts() {

```
localStorage.setItem(
    "kenyagram_posts",
    JSON.stringify(posts)
);
```

}

/* ================= NAVIGATION ================= */

function showPage(pageName) {

```
const pages =
    document.querySelectorAll(".page");


pages.forEach(function(page) {

    page.classList.remove(
        "active-page"
    );

});


const page =
    document.getElementById(
        pageName
    );


if (!page) {

    console.error(
        "Page not found:",
        pageName
    );

    return;

}


page.classList.add(
    "active-page"
);


const buttons =
    document.querySelectorAll(
        "[data-page]"
    );


buttons.forEach(function(button) {

    button.classList.remove(
        "active"
    );


    if (
        button.dataset.page ===
        pageName
    ) {

        button.classList.add(
            "active"
        );

    }

});


window.scrollTo(
    0,
    0
);


if (
    pageName === "home"
) {

    renderFeed();

}


if (
    pageName === "profile"
) {

    renderProfile();

}


if (
    pageName === "reels"
) {

    renderReels();

}
```

}

/* ALL NAVIGATION BUTTONS */

document.addEventListener(
"click",
function(event) {

```
    const button =
        event.target.closest(
            "[data-page]"
        );


    if (!button) return;


    event.preventDefault();


    showPage(
        button.dataset.page
    );

}
```

);

/* ================= CREATE ================= */

let selectedFile = null;

let selectedURL = null;

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

const preview =
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

/* SELECT FILE */

if (
uploadButton &&
fileInput
) {

```
uploadButton.addEventListener(
    "click",
    function() {

        fileInput.click();

    }
);
```

}

/* FILE CHANGED */

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
                "Please choose a photo or video."
            );

            return;

        }


        selectedFile =
            file;


        selectedURL =
            URL.createObjectURL(
                file
            );


        uploadStep.classList.add(
            "hidden"
        );


        editorStep.classList.remove(
            "hidden"
        );


        if (
            file.type.startsWith(
                "video/"
            )
        ) {

            preview.innerHTML = `

                <video
                    src="${selectedURL}"
                    controls
                    autoplay
                    muted
                    playsinline>
                </video>

            `;

        } else {

            preview.innerHTML = `

                <img
                    src="${selectedURL}"
                    alt="Preview">

            `;

        }

    }
);
```

}

/* ================= PUBLISH ================= */

if (publishButton) {

```
publishButton.addEventListener(
    "click",
    function() {

        if (!selectedFile) {

            alert(
                "Choose a photo or video first."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                const newPost = {

                    id:
                        Date.now(),

                    username:
                        "kenyagram_user",

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
                        captionInput.value
                            .trim(),

                    likes: 0,

                    time:
                        "Just now"

                };


                posts.push(
                    newPost
                );


                savePosts();


                alert(
                    "Your post has been published!"
                );


                resetCreate();


                showPage(
                    "home"
                );

            };


        reader.readAsDataURL(
            selectedFile
        );

    }
);
```

}

/* ================= RESET CREATE ================= */

function resetCreate() {

```
selectedFile = null;


if (selectedURL) {

    URL.revokeObjectURL(
        selectedURL
    );

}


selectedURL = null;


fileInput.value = "";


captionInput.value = "";


preview.innerHTML = "";


editorStep.classList.add(
    "hidden"
);


uploadStep.classList.remove(
    "hidden"
);
```

}

/* ================= CANCEL CREATE ================= */

const cancelButton =
document.getElementById(
"cancelCreateButton"
);

const cancelButton2 =
document.getElementById(
"cancelCreateButton2"
);

if (cancelButton) {

```
cancelButton.addEventListener(
    "click",
    function() {

        resetCreate();

        showPage(
            "home"
        );

    }
);
```

}

if (cancelButton2) {

```
cancelButton2.addEventListener(
    "click",
    function() {

        resetCreate();

    }
);
```

}

/* ================= FEED ================= */

function renderFeed() {

```
const feed =
    document.querySelector(
        ".feed"
    );


if (!feed) return;


feed.innerHTML = "";


if (
    posts.length === 0
) {

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
                        Welcome
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
                    Create your first post.
                </p>

            </div>

        </article>

    `;

    return;

}


posts
    .slice()
    .reverse()
    .forEach(
        function(post) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "post";


            const media =
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
                        alt="Post">

                  `;


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

                    ${media}

                </div>


                <div class="post-actions">

                    <div class="left-actions">

                        <button class="action-btn">
                            ♡
                        </button>

                        <button class="action-btn">
                            💬
                        </button>

                        <button class="action-btn">
                            ➤
                        </button>

                    </div>


                    <button class="action-btn">
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

        }
    );
```

}

/* ================= PROFILE ================= */

function renderProfile() {

```
const grid =
    document.querySelector(
        ".profile-grid"
    );


if (!grid) return;


const myPosts =
    posts.filter(
        function(post) {

            return (
                post.username ===
                "kenyagram_user"
            );

        }
    );


const count =
    document.querySelector(
        "[data-post-count]"
    );


if (count) {

    count.textContent =
        myPosts.length;

}


grid.innerHTML = "";


if (
    myPosts.length === 0
) {

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


myPosts
    .slice()
    .reverse()
    .forEach(
        function(post) {

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

        }
    );
```

}

/* ================= REELS ================= */

function renderReels() {

```
const container =
    document.querySelector(
        ".reels-container"
    );


if (!container) return;


const videos =
    posts.filter(
        function(post) {

            return (
                post.type ===
                "video"
            );

        }
    );


container.innerHTML = "";


if (
    videos.length === 0
) {

    container.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                ▶
            </div>

            <h2>
                No Reels Yet
            </h2>

            <p>
                Upload a video to create a Reel.
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


videos
    .slice()
    .reverse()
    .forEach(
        function(post) {

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

        }
    );
```

}

/* ================= SEARCH ================= */

const searchInput =
document.getElementById(
"searchInput"
);

const searchResults =
document.getElementById(
"searchResults"
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


        searchResults.innerHTML =
            "";


        if (!query) return;


        const users = [

            "kenyagram",

            "kenyagram_user",

            "football",

            "messi",

            "manchestercity"

        ];


        users
            .filter(
                function(user) {

                    return user
                        .toLowerCase()
                        .includes(
                            query
                        );

                }
            )
            .forEach(
                function(user) {

                    const result =
                        document.createElement(
                            "div"
                        );


                    result.className =
                        "conversation";


                    result.innerHTML = `

                        <div class="user-avatar">
                            ${user
                                .slice(0,2)
                                .toUpperCase()}
                        </div>

                        <div>

                            <strong>
                                ${user}
                            </strong>

                            <p>
                                Kenyagram user
                            </p>

                        </div>

                    `;


                    searchResults.appendChild(
                        result
                    );

                }
            );

    }
);
```

}

/* ================= START ================= */

document.addEventListener(
"DOMContentLoaded",
function() {

```
    showPage(
        "home"
    );

    renderFeed();

    renderProfile();

    renderReels();

}
```

);
