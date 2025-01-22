const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/product-proxy',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            headers: {
                From: 'BO'
            },
            changeOrigin: true,
        })
    );
    app.use(
        '/category-proxy',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            headers: {
                From: 'BO'
            },
            changeOrigin: true,
        })
    );
    app.use(
        '/member-proxy',
        createProxyMiddleware({
            target: 'http://localhost:8081',
            headers: {
                From: 'BO'
            },
            changeOrigin: true,
        })
    );
    app.use(
        '/review-proxy',
        createProxyMiddleware({
            target: 'http://localhost:8081',
            headers: {
                From: 'BO'
            },
            changeOrigin: true,
        })
    );
};