const cors = require('cors');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const server = express();
const HOST = "localhost";
const PORT = 3000;
const API_SERVICE_URL = 'https://nhentai.net'
server.use(cors())
server.use('*', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
 }));
 server.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });