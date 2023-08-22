const webcam = require("node-webcam");
const sharp = require('sharp');
const express = require('express');
const path = require('path');
const fs = require('fs');

const opts = {
    width: 1280,
    height: 720,
    quality: 100,
    // Number of frames to capture
    // More the frames, longer it takes to capture
    // Use higher framerate for quality. Ex: 60
    frames: 10,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,
    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: "location",
    verbose: true
};

//Creates webcam instance
const cam = webcam.create(opts);
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const name = `picture_${(Date.now() / 1000) | 0}`;
    cam.capture(name, async function (err, data) {
        res.sendFile(path.resolve(data));
    });
});

app.get('/file/:file', (req, res) => {
    res.sendFile(path.resolve(req.params.file));
});

app.get('/all', (req, res) => {

    const files = fs.readdirSync(path.resolve('./'))
        .filter(f => f.includes('.jpg'))
        .sort((a, b) => a.localeCompare(b));

    cam.capture(`picture_${(Date.now() / 1000) | 0}`, function (err, data) {
        res.send(`
<html>
<head>
    <style>
        img {
            width: 200px;
        }
    </style>
</head>
    <body>
        ${files.map(f => `<img src='/file/${f}'>`).join('')}
    </body>
</html>`);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});