const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("There is not any range");
    }

    const videoPath = "demo.mp4";
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK = 5 * 10 ** 5;
    // const start = Number(range.replace(/\D/g, ""));
    const start = parseInt(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK, videoSize - 1);

    const videoLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": videoLength,
        "Content-type": "video/mp4",
    }

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(port, () => {
    console.log("server started at port number 3000");
})
