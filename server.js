var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const latexService = require('./latexService.js')
const host = ''; // dev.sunbirded.org
var app = express();
app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))
app.get("/latex/convert", latexService.convert)
app.post("/latex/convert", bodyParser.json({ limit: '1mb' }), latexService.convert);
app.all([
    '/api/framework/v1/read/*',
     '/learner/framework/v1/read/*', 
     '/api/channel/v1/read/*'], proxy(host, {
    https: true,
    proxyReqPathResolver: function(req) {
        console.log('proxyReqPathResolver ',  urlHelper.parse(req.url).path);
        return urlHelper.parse(req.url).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['authorization'] = 'Bearer ';
        return proxyReqOpts;
    }
}));

app.use([
    '/action/questionset/v1/*',
    '/action/question/v1/*',
    '/action/object/category/definition/v1/*',
    '/action/data/v1/*'
    ], proxy(host, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '/api/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator questionset')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['authorization'] = 'Bearer ';
        return proxyReqOpts;
    }
}));

app.use(['/api','/assets','/action'], proxy(host, {
    https: true,
    proxyReqPathResolver: function(req) {
        console.log('proxyReqPathResolver ',  urlHelper.parse(req.url).path);
        return urlHelper.parse(req.url).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['authorization'] = 'Bearer ';
        proxyReqOpts.headers['x-authenticated-user-token'] = ''
        return proxyReqOpts;
    }
}));
app.use(['/content/preview/*', '/content-plugins/*', '/assets/public/*'], proxy(host, {
    https: true,
    proxyReqPathResolver: function(req) {
        return require('url').parse(`https://${host}` + req.originalUrl).path
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator')
        // you can update headers 
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['authorization'] = 'Bearer ';
        return proxyReqOpts;
    }
}));
http.createServer(app).listen(app.get('port'), 3000);