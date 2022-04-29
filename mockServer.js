var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const latexService = require('./latexService.js')
userData = require('./data/userData.json')

// ENV Variables
const BASE_URL = 'dev.sunbirded.org';
const API_AUTH_TOKEN = "";
const PORTAL_COOKIES= "";
const USER_TOKEN = "";

var app = express();
app.set('port', 3000);
app.use(express.json())
app.get("/latex/convert", latexService.convert)
app.post("/latex/convert", bodyParser.json({ limit: '1mb' }), latexService.convert);

/*
 * Category:: /API 
 * Sub-Category:: Framework, channel API's
 */

// app.all([
//     // '/api/framework/v1/read/*',
//     '/learner/framework/v1/read/*', 
//     // '/api/channel/v1/read/*'
//     ], proxy(BASE_URL, {
//     https: true,
//     proxyReqPathResolver: function(req) {
//         console.log('proxyReqPathResolver ',  urlHelper.parse(req.url).path);
//         return urlHelper.parse(req.url).path;
//     },
//     proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
//         console.log('proxyReqOptDecorator 2')
//         // you can update headers
//         proxyReqOpts.headers['Content-Type'] = 'application/json';
//         proxyReqOpts.headers['user-id'] = 'content-editor';
//         proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
//         proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
//         return proxyReqOpts;
//     }
// }));

/*
 * Category:: /ACTION 
 * Sub-Category:: Content, Object, Composite, DIAL-Code, Collection
 *                User, Asset, telemetry API's
 */

// app.use([
//     '/action/collection/v1/*',
//     '/action/object/category/definition/v1/*'
//     ], proxy(BASE_URL, {
//     https: true,
//     limit: '30mb',
//     proxyReqPathResolver: function (req) {
//         let originalUrl = req.originalUrl.replace('/action/', '/api/')
//         console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
//         return require('url').parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
//         console.log('proxyReqOptDecorator 3')
//         // you can update headers
//         proxyReqOpts.headers['Content-Type'] = 'application/json';
//         proxyReqOpts.headers['user-id'] = 'content-editor';
//         proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
//          return proxyReqOpts;
//     }
// }));

// app.use(['/action/program/v1/*',
//     '/action/question/v1/bulkUpload',
//     '/action/question/v1/bulkUploadStatus'
//     ], proxy(BASE_URL, {
//     https: true,
//     limit: '30mb',
//     proxyReqPathResolver: function (req) {
//         let originalUrl = req.originalUrl.replace('/action/', '/api/')
//         console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
//         return require('url').parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
//         console.log('proxyReqOptDecorator 3')
//         // you can update headers
//         proxyReqOpts.headers['Content-Type'] = 'application/json';
//         proxyReqOpts.headers['user-id'] = 'content-editor';
//         proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
//         proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
//         proxyReqOpts.headers['x-authenticated-user-token'] = USER_TOKEN;
//          return proxyReqOpts;
//     }
// }));


app.post('/action/user/v1/*', function(req, res) {
    res.status(200).json(userData)
});

app.use(['/api','/assets', '/action/content/v3/*'], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function(req) {
        console.log('proxyReqOptDecorator ======> 3');
        return urlHelper.parse(req.originalUrl).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 4')
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        proxyReqOpts.headers['x-authenticated-user-token'] = USER_TOKEN;
        return proxyReqOpts;
    }
}));

app.use(['/action/dialcode/v3/search'], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function(req) {
        console.log('proxyReqOptDecorator ======> 2');
        console.log("------> ", req.originalUrl);
        let originalUrl = req.originalUrl.replace('/action/', '/api/')
         originalUrl = originalUrl.replace('/v3/', '/v1/')
        console.log("=======>", urlHelper.parse(originalUrl).path)
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        proxyReqOpts.headers['x-authenticated-user-token'] = USER_TOKEN;
        proxyReqOpts.headers['x-channel-id'] = 'ORG_001';
        return proxyReqOpts;
    }
}));

app.use(['/action'], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function(req) {
        console.log('proxyReqOptDecorator ======> 2');
        console.log("------> ", req.originalUrl);
        let originalUrl = req.originalUrl.replace('/action/', '/api/')
        console.log("=======>", urlHelper.parse(originalUrl).path)
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        proxyReqOpts.headers['x-authenticated-user-token'] = USER_TOKEN;
        proxyReqOpts.headers['x-channel-id'] = 'ORG_001';
        return proxyReqOpts;
    }
}));


// app.use(['/action/content/*'], proxy(BASE_URL, {
//     https: true,
//     proxyReqPathResolver: function (req) {
//         let originalUrl = req.originalUrl.replace('/api/', '/api/')
//         console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
//         return require('url').parse(originalUrl).path;
//     },
//     proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
//         console.log('proxyReqOptDecorator 1')
//         // you can update headers
//         proxyReqOpts.headers['Content-Type'] = 'application/json';
//         proxyReqOpts.headers['user-id'] = 'content-editor';
//         proxyReqOpts.headers['Cookie'] = PORTAL_COOKIES;
//         return proxyReqOpts;
//     }
// }));


/*
 * Category:: /GENERAL
 */

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