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
    axios
        .get(`https://t.nhentai.net/galleries/${request.params.id}/${request.params.file}`, {
            responseType: 'arraybuffer'
        })
        .then(response => {
            reply.header('Content-Type', 'image/jpeg')
                .header('filename',request.params.file)
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