const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const bc = require("./bc.js");
const db = require("./db.js");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");
const csurf = require("csurf");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

app.use(compression());

app.use(express.static("public"));
app.use(express.json());

const cookieSessionMiddleware = cookieSession({
    secret: "learning about react!!",
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/welcome", (req, res) => {
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    bc.hash(req.body.password)
        .then((hashedPw) => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then((results) => {
                    req.session.id = results.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("error in db.addUser: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in bc.hash: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    db.getHashedPw(req.body.email)
        .then((results) => {
            req.session.id = results.rows[0].id;
            bc.compare(req.body.password, results.rows[0].password)
                .then((boolean) => {
                    if (boolean) {
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("error in bc.compare: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in db.getHashedPassword: ", err);
            res.json({ success: false });
        });
});

app.post("/step1", (req, res) => {
    req.session.email = req.body.email;
    db.checkIfUserExists(req.body.email)
        .then((results) => {
            if (results.rows[0]) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.addCode(req.body.email, secretCode)
                    .then(() => {
                        let text = `Here is your code ${secretCode}, go back to the website and reset your password!`;
                        sendEmail(req.body.email, text, "Reset Password");
                        res.json({
                            success: true,
                        });
                    })
                    .catch((err) => {
                        console.log("error in addCode: ", err);
                        res.json({ success: false });
                    });
            } else {
                console.log("didnt work");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in check: ", err);
            res.json({ success: false });
        });
});

app.post("/step2", (req, res) => {
    db.checkCode(req.session.email)
        .then((results) => {
            // console.log("results.rows[0].code :", results.rows[0].code);
            // console.log("req.body.code :", req.body.code);
            if (results.rows[0].code == req.body.code) {
                bc.hash(req.body.newPassword).then((hashedPw) => {
                    db.changePassword(req.session.email, hashedPw)
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("error in changePassword: ", err);
                            res.json({ success: false });
                        });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in checkCode: ", err);
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    db.getAllInfo(req.session.id)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getAllInfo: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("req.file from index.js post/upload: ", req.file);
    // console.log("req.body from index.js post/upload: ", req.body);
    const { filename } = req.file;
    const url = s3Url + filename;

    // if (req.file) {
    //     res.json({
    //         success: true,
    //     });
    // } else {
    //     res.json({
    //         success: false,
    //     });
    // }

    db.addItem(url, req.body.description, req.body.address, req.session.id)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addItem: ", err);
        });
});

app.get("/last-items", (req, res) => {
    db.getLastItems()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getLastItems: ", err);
        });
});

app.get("/get-search/:search", (req, res) => {
    db.getSearch(req.params.search)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getSearch: ", err);
        });
});

app.get("/get-item/:itemId", (req, res) => {
    db.getItem(req.params.itemId)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("err in getItem: ", err);
        });
});

app.post("/save-search", (req, res) => {
    db.addSearch(req.body.search, req.session.id)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in addSearch:", err);
            res.json({ success: false });
        });
});

app.get("/saved-searches", (req, res) => {
    db.getSaved(req.session.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getSaved:", err);
            res.json({ success: false });
        });
});

app.post("/remove-from-search", (req, res) => {
    console.log("hit server route");
    db.removeFromSearch(req.body.item)
        .then(() => {
            db.getSaved(req.session.id)
                .then((results) => {
                    res.json(results.rows);
                })
                .catch((err) => {
                    console.log("error in getSaved:", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in removeFromSearch:", err);
            res.json({ success: false });
        });
});

app.get("/is-it-fav/:itemId", (req, res) => {
    const userId = req.session.id;
    const itemId = req.params.itemId;
    db.isItFav(userId, itemId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in isItFav:", err);
            res.json({ success: false });
        });
});

app.post("/make-it-fav", (req, res) => {
    const itemId = req.body.id;
    const userId = req.session.id;
    db.makeItFav(userId, itemId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in makeItFav:", err);
            res.json({ success: false });
        });
});

app.post("/delete-fav", (req, res) => {
    const itemId = req.body.id;
    const userId = req.session.id;
    db.deleteFav(userId, itemId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in makeItFav:", err);
            res.json({ success: false });
        });
});

app.get("/get-favs", (req, res) => {
    const userId = req.session.id;
    db.getFavs(userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getFavs:", err);
            res.json({ success: false });
        });
});

///things I probably don't need!!!
app.post("/bio", (req, res) => {
    db.addBio(req.body.bio, req.session.id)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addBio: ", err);
        });
});

app.get("/other-user/:id", (req, res) => {
    const id = req.params.id;
    // console.log("id", id);
    if (id == req.session.id) {
        res.json({ sameUser: true });
    } else {
        db.getOtherUser(id)
            .then((results) => {
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("err in getOtherUser: ", err);
            });
    }
});

app.get("/newUsers", (req, res) => {
    db.getLastUsers()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getLastUsers: ", err);
        });
});

app.get("/friendship/:otherId", (req, res) => {
    const otherId = req.params.otherId;
    const myId = req.session.id;
    db.checkFriendship(otherId, myId)
        .then(({ rows }) => {
            //console.log(rows);
            if (!rows.length) {
                res.json({
                    friendship: "none",
                });
            } else {
                rows[0].myId = req.session.id;
                res.json(rows[0]);
            }
        })
        .catch((err) => {
            console.log("error in checkFriendship: ", err);
        });
});

/* app.get("/search/:search", (req, res) => {
    db.getSearch(req.params.search)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("err in getSearch: ", err);
        });
}); */

app.post("/update-friendship", (req, res) => {
    if (req.body.button == "ask friendship") {
        const sender_id = req.session.id;
        const recipient_id = req.body.otherId;
        db.addRequest(sender_id, recipient_id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in addRequest: ", err);
                res.json({ success: false });
            });
    } else if (
        req.body.button == "cancel request" ||
        req.body.button == "delete friend"
    ) {
        //delete row
        const id1 = req.body.otherId;
        const id2 = req.session.id;
        db.deleteRequest(id1, id2)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in deleteRequest: ", err);
                res.json({ success: false });
            });
    } else if (req.body.button == "accept request") {
        //set to true
        const sender_id = req.body.otherId;
        const recipient_id = req.session.id;
        db.acceptRequest(sender_id, recipient_id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in acceptRequest: ", err);
                res.json({ success: false });
            });
    }
});

app.get("/friends-wannabes", (req, res) => {
    db.getFriendsWannabes(req.session.id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in acceptRequest: ", err);
            res.json({ success: false });
        });
});

app.get("/all-posts/:id", (req, res) => {
    let id = req.params.id;
    db.getAllPosts(id)
        .then((results) => {
            if (results.rows.length) {
                res.json(results.rows);
            } else {
                console.log("no friends!");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in getAllPost: ", err);
            res.json({ success: false });
        });
});

app.post("/new-post", (req, res) => {
    const sender_id = req.session.id;
    const { newPost, id } = req.body;
    db.addPost(sender_id, newPost, id)
        .then(() => {
            db.getAllPosts(id)
                .then((results) => {
                    res.json(results.rows);
                })
                .catch((err) => {
                    console.log("error in getAllPost: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in addPost: ", err);
            res.json({ success: false });
        });
});
//// till here

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("*", function (req, res) {
    if (!req.session.id) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});

//socket.io
let usersSockets = {};

io.on("connection", (socket) => {
    const { id } = socket.request.session;

    usersSockets.id = socket.id;

    if (!id) {
        return socket.disconnect();
    }

    /* socket.on("chatMessages", () => {
        db.getLastTen()
            .then((results) => {
                return io.emit("chatMessages", results.rows);
            })
            .catch((err) => console.log("error in getLastTen: ", err));
    });

    socket.on("chatMessage", (data) => {
        db.addMessage(data, id)
            .then(() => {
                db.getLastMessage(id)
                    .then((results) => {
                        return io.emit("chatMessage", results.rows[0]);
                    })
                    .catch((err) =>
                        console.log("error in getLastMessage: ", err)
                    );
            })
            .catch((err) => console.log("error in addMessage: ", err));
    });

    socket.on("acceptRequest", () => {
        db.getRequestNum(id)
            .then((results) => {
                return io.sockets.sockets[socket.id].emit(
                    "requestNum",
                    results.rows[0].count
                );
            })
            .catch((err) => console.log("error in getRequestNum: ", err));
    });

    socket.on("sendRequest", (recipientId) => {
        const recipientSocketId = usersSockets[recipientId];
        db.getRequestNum(id)
            .then((results) => {
                return io.sockets.sockets[recipientSocketId].emit(
                    "requestNum",
                    results.rows[0].count
                );
            })
            .catch((err) => console.log("error in getRequestNum: ", err));
    });

    socket.on("request", () => {
        db.getRequestNum(id)
            .then((results) => {
                return io.sockets.sockets[socket.id].emit(
                    "requestNum",
                    results.rows[0].count
                );
            })
            .catch((err) => console.log("error in getRequestNum: ", err));
    }); */
});
