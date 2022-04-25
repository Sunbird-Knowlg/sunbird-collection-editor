var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const latexService = require('./latexService.js')
channelData = require('./data/channelReadData.json')
userData = require('./data/userData.json')

// ENV Variables
const BASE_URL = 'dev.sunbirded.org';
const API_AUTH_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6InBvcnRhbF9sb2dnZWRpbl9rZXkzIn0.eyJpc3MiOiJESUQiLCJpYXQiOjE2MzE3NzY1MTB9.djfuW6W5al8qMRKAMgIqLz-sNoB0zPQYbe-SZaeJEFXUMNLMAFWrt2pInyrdFcr6V7XegYNjSLJX5_dw6XqIGvi6FvPqpxdiJ1yVBykH9BaeyN4oFPT4KRf8bTv3rqQBcxIuYeS0Xznew0xsgokrM3ZR6FqTwj0lf6mYrE7anmqoGtZH3J8cT1yQebB0O_MwBzOzPBFYqN5JKB2s4r-I313A2x9GKqDySCl9qE_Z03W2BLiIpR8F6Ys_h28pvIyH9jnuR6lKEcSAZyKC8zUin61bHrKs91UlsphKf6ELZTRp8gIg37ohuFncKDgMDti1lRUr_RPK4gDGt0YoHGKM1A";
const PORTAL_COOKIES= "connect.sid=s%3ABfbRAFqnJyTOIn9OMqAXkRj-jHD_3SYN.m%2BCaOJK5mNZgcAOrXPnoA7EYQodQ%2B6UqIS434iHUHD8"
const USER_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsclI0MWpJNndlZmZoQldnaUpHSjJhNlowWDFHaE53a21IU3pzdzE0R0MwIn0.eyJqdGkiOiJlYmE5ODE4Yy04MTZlLTQzMDUtYmUwZS1jMWVmOWNiMTk4M2UiLCJleHAiOjE2NTA2NTk2NjMsIm5iZiI6MCwiaWF0IjoxNjUwNjE2NDYzLCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZjo1YThhM2YyYi0zNDA5LTQyZTAtOTAwMS1mOTEzYmMwZmRlMzE6NWE1ODdjYzEtZTAxOC00ODU5LWEwYTgtZTg0MjY1MGI5ZDY0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicHJvamVjdC1zdW5iaXJkLWRldi1jbGllbnQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJkNGMwOTE3ZS04YzhiLTRkMGYtYmRjMi02ZDBhNDdlYmVmMDciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LnN1bmJpcmRlZC5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6IiIsIm5hbWUiOiJOMTEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuMTFAeW9wbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiTjExIiwiZW1haWwiOiJuMSpAeW9wbWFpbC5jb20ifQ.WZ0GyvndteDQEMQpZ1ubFcr-fv1HqzGf4KfzjELSNDGxaiAh7ys25EsiwYbQNLS4PN3bJmSunXmzIMI0oSLQ2bjEbRI0jZ0SLCmuG1simvWzOQDTsouiO73paON1i6AfrS1Ib4MuALqow9yJk1fFCFIluovVbqj5-fcnsv-B6OBtWq_iIRXQOJoPTwRy67Je7PPPPg6Qym0acYZm9Qv9dpIg8WLLgMZwKrZxLG4wLpj3Ast9H-1FmII10gJ_uFaC3v6iz55RWyRN8At6wX3-aUw1NJDlxJyMO_mJPqL4Nu9ZOkNxG4XxNtrCeQTiQn0m1iMBJSe-5QTjHMnHkUHCkQ";


var app = express();
app.set('port', 3000);
app.use(express.json())
app.get("/latex/convert", latexService.convert)
app.post("/latex/convert", bodyParser.json({ limit: '1mb' }), latexService.convert);

app.all(['/api/framework/v1/read/*',
     '/learner/framework/v1/read/*'], proxy(BASE_URL, {
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
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        return proxyReqOpts;
    }
}));
app.use(['/action/questionset/v1/*',
    '/action/question/v1/*',
    '/action/collection/v1/*',
    '/action/object/category/definition/v1/*',
    '/action/collection/v1/*'
    ], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
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
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        proxyReqOpts.headers['x-authenticated-user-token'] = USER_TOKEN;
         return proxyReqOpts;
    }
}));

app.use(['/action/program/v1/*',
    '/action/question/v1/bulkUpload',
    '/action/question/v1/bulkUploadStatus'
    ], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
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
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        proxyReqOpts.headers['x-authenticated-user-token'] = USER_TOKEN;
         return proxyReqOpts;
    }
}));
app.get('/api/channel/v1/read/*', function(req, res) {
    console.log('channel');
    res.status(200).json(channelData)
});
app.post('/action/user/v1/*', function(req, res) {
    console.log('user');
    res.status(200).json(userData)
});
app.use(['/api','/assets','/action'], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function(req) {
        console.log('proxyReqPathResolver ',  urlHelper.parse(req.url).path);
        return urlHelper.parse(req.url).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 4')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        return proxyReqOpts;
    }
}));


app.use(['/action/content/*'], proxy(BASE_URL, {
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
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        return proxyReqOpts;
    }
}));
app.use(['/content/preview/*', '/content-plugins/*', '/assets/public/*'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function(req) {
        return require('url').parse(`https://${BASE_URL}` + req.originalUrl).path
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 5')
        // you can update headers 
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        return proxyReqOpts;
    }
}));
http.createServer(app).listen(app.get('port'), 3000);