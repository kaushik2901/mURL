const http = require("http");
const express = require("express");
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.static("public"));

const guid = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);

const urls = {};

app.get("/:id", (req, res) => {
    const id = req.params.id;

    if (!urls[id]) {
        return res.status(404).json({
            message: "URL not found"
        });
    }

    res.redirect(urls[id].url);
});

app.post("/api/urls", (req, res) => {
    const url = req.body.url;
    if(!url) {
        return res.status(400).json({
            message: "\"url\" required"
        })
    }

    let id = guid();

    while (!!urls[id]) {
        id = guid();
    }

    urls[id] = {
        id,
        url
    };

    res.json(urls[id]);
});

app.get("/api/urls/:id", (req, res) => {
    const id = req.params.id;

    if (!urls[id]) {
        return res.status(404).json({
            message: "URL not found"
        });
    }

    res.json(urls[id]);
});

const port = process.env.PORT || 3000;

http
    .createServer(app)
    .listen(port, () => console.log(`Server started at ${port}`));
