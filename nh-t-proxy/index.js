const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

const app = express();
const HOST = "localhost";
const PORT = 3002;
const API_SERVICE_URL = "https://t.nhentai.net";

// Logging some shit here
app.use(morgan('dev'));
// Save pictures as pictures not as a fucking html
app.get('/galleries/:id/:file', async function (request, reply) {  
    // Validate id: must be digits only (e.g., gallery number)
    // Validate file: digits + extension, no path traversal or malicious characters
    const idPattern = /^\d+$/;
    const filePattern = /^\d+\.(jpg|jpeg|png|gif)$/i;
    const id = request.params.id;
    const file = request.params.file;
    if (!idPattern.test(id) || !filePattern.test(file)) {
        return reply.status(400).send("Invalid parameters");
    }
    axios
        .get(`https://t.nhentai.net/galleries/${id}/${file}`, {
            responseType: 'arraybuffer'
        })
        .then(response => {
            reply.header('Content-Type', 'image/jpeg')
                .header('filename', file)
                .send(response.data)
        })
});
 // Proxy endpoints
 app.use('*', createProxyMiddleware({
    target: API_SERVICE_URL,
    headers: {
        accept: "image/jpeg",
        method: "GET",
    },
    changeOrigin: true,
 }));

 app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at http://${HOST}:${PORT}`);
 });