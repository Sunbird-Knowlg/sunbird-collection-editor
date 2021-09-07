var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const latexService = require('./latexService.js')
const host = 'dev.sunbirded.org';
const dock_host = 'dock.sunbirded.org'
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
        console.log('proxyReqOptDecorator 2')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = "connect.sid=s%3ABKvMRfrUG70gHzzCchmp44oVHpPa55Mm.%2FDxH8a4Vj5bMTEd4lhAzRSHnXq%2Ffe%2B%2BlD8J7iwQXC6E"
        proxyReqOpts.headers['authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8';
        return proxyReqOpts;
    }
}));
app.use([
    '/action/questionset/v1/*',
    '/action/question/v1/*',
    '/action/object/category/definition/v1/*',
    '/action/collection/v1/*'
    ], proxy(host, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/action/', '/api/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 3')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = "connect.sid=s%3ABKvMRfrUG70gHzzCchmp44oVHpPa55Mm.%2FDxH8a4Vj5bMTEd4lhAzRSHnXq%2Ffe%2B%2BlD8J7iwQXC6E"
        proxyReqOpts.headers['authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8';
        proxyReqOpts.headers['x-authenticated-user-token'] = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsclI0MWpJNndlZmZoQldnaUpHSjJhNlowWDFHaE53a21IU3pzdzE0R0MwIn0.eyJqdGkiOiJjYmQwNTNlYy05OTA2LTQ2MDktOTg4YS03NzRkMGFiMmQ4ZTMiLCJleHAiOjE2MjU4MjA0NzYsIm5iZiI6MCwiaWF0IjoxNjI1NzM0MDc2LCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZjo1YThhM2YyYi0zNDA5LTQyZTAtOTAwMS1mOTEzYmMwZmRlMzE6NWE1ODdjYzEtZTAxOC00ODU5LWEwYTgtZTg0MjY1MGI5ZDY0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicHJvamVjdC1zdW5iaXJkLWRldi1jbGllbnQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI2YTNkNjc1Yi0yMWQxLTQxYmEtOTQxZC1lN2Q1ZTE4MWEyYjciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LnN1bmJpcmRlZC5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6IiIsIm5hbWUiOiJOMTEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuMTFAeW9wbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiTjExIiwiZW1haWwiOiJuMSpAeW9wbWFpbC5jb20ifQ.dPv6AZRxWM78OF1OYtDQcdpwEMn5gmHyQVRnOX-qDsDTugmIM9tpUGDnNzoE8XO1x6seO2fXs7rbrLQZK5h4gXY4HkmuYn7AKKmBz0Y8O0DYH5AghFjpU_Vm_-TKA4CxOk5s8x4S-UHhRy-ykRyO-adED_srMb-AXiLofcwoUYBUR_6b3PLdGJO1emaFxTQUIaR_nuKet7_T9h-sUHLJgW6W8-kt0gDOKD6UIzLUL9Md_JjjEHqfRlnQxsfSk9S4PNOesO46wHjUYd5yBIITgBztDdoWUvuVTJknoofoD8vgx0hdbZmBuSHI-cclOMjLGBCQf_2O0y_RCx-XotAf2Q';
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
        console.log('proxyReqOptDecorator 4')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = "connect.sid=s%3ABKvMRfrUG70gHzzCchmp44oVHpPa55Mm.%2FDxH8a4Vj5bMTEd4lhAzRSHnXq%2Ffe%2B%2BlD8J7iwQXC6E"
        return proxyReqOpts;
    }
}));
app.use([
    '/action/content/*',
    ], proxy(host, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/api/', '/api/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 1')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = "connect.sid=s%3ABKvMRfrUG70gHzzCchmp44oVHpPa55Mm.%2FDxH8a4Vj5bMTEd4lhAzRSHnXq%2Ffe%2B%2BlD8J7iwQXC6E"
        return proxyReqOpts;
    }
}));
app.use(['/content/preview/*', '/content-plugins/*', '/assets/public/*'], proxy(host, {
    https: true,
    proxyReqPathResolver: function(req) {
        return require('url').parse(`https://${host}` + req.originalUrl).path
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 5')
        // you can update headers 
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = "connect.sid=s%3ABKvMRfrUG70gHzzCchmp44oVHpPa55Mm.%2FDxH8a4Vj5bMTEd4lhAzRSHnXq%2Ffe%2B%2BlD8J7iwQXC6E"
        proxyReqOpts.headers['authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8';
        return proxyReqOpts;
    }
}));
app.use(['/content/preview/*', '/content-plugins/*', '/assets/public/*'], proxy(host, {
    https: true,
    proxyReqPathResolver: function(req) {
        return require('url').parse(`https://${host}` + req.originalUrl).path
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 6')
        // you can update headers 
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = "connect.sid=s%3ABKvMRfrUG70gHzzCchmp44oVHpPa55Mm.%2FDxH8a4Vj5bMTEd4lhAzRSHnXq%2Ffe%2B%2BlD8J7iwQXC6E"
        proxyReqOpts.headers['authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8';
        return proxyReqOpts;
    }
}));
http.createServer(app).listen(app.get('port'), 3000);