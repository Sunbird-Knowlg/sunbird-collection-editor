var express = require('express'),
    http = require('http');
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const latexService = require('./latexService.js')
// channelData = require('./data/channelReadData.json')
userData = require('./data/userData.json')
// frameworkData = require('./data/frameworkData.json')
collaboratorUpdatData = require('./data/collaboratorUpdate.json')
// hierarchyUpdate = require('./data/hierarchyUpdate.json')
hierarchyRead = require('./data/hierarchyRead.json')
hierarchyAdd = require('./data/hierarchyAdd.json')
contentV3Review = require('./data/contentV3ReviewResponse.json')
categoryDefinationRead = require('./data/categoryDefinationRead.json')
contentV3Read = require('./data/contentV3Read.json')
contentV3Reject = require('./data/contentV3Reject.json')
contentV3Publish = require('./data/contentV3Publish.json')
collectionV1Export = require('./data/collectionV1Export.json')
contentV3UploadUrl = require('./data/contentV3UploadUrl.json')
dialCodeV1Reserve = require('./data/dialCodeV1Reserve.json')
dialCodeProcessStatus = require('./data/dialCodeProcessStatus.json')
dialCodeSearch = require('./data/dialCodeSearch.json')
collectionDialCodeLink = require('./data/collectionDialCodeLink.json')
assetCreate = require('./data/assetCreate.json')
contentUploadV3Url = require('./data/contentUploadV3Url.json')
collectionV1Import = require('./data/collectionV1Import.json')

// ENV Variables
const BASE_URL = 'dev.sunbirded.org';
const API_AUTH_TOKEN = "";
const PORTAL_COOKIES= ""
const USER_TOKEN = "";

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
app.get('/action/collection/v1/export/*', function(req, res) {
    console.log('collectionV1Export');
    res.status(200).json(collectionV1Export)
});
app.post('/action/collection/v1/import/*', function(req, res) {
    console.log('collectionV1Import');
    res.status(200).json(collectionV1Import)
});
// app.get('/api/channel/v1/read/*', function(req, res) {
//     console.log('channel');
//     res.status(200).json(channelData)
// });
app.post('/action/user/v1/*', function(req, res) {
    console.log('user');
    res.status(200).json(userData)
});
// app.get('/api/framework/v1/read/*', function(req, res) {
//     console.log('framework');
//     res.status(200).json(frameworkData)
// });
app.patch('/action/content/v1/collaborator/update/*', function(req, res) {
    console.log('collaboratorUpdatData');
    res.status(200).json(collaboratorUpdatData)
});
app.patch('/action/content/v3/hierarchy/update', function(req, res) {
    console.log('hierarchy Update');
    res.status(200).json(hierarchyUpdate)
});
app.patch('/action/content/v3/hierarchy/add', function(req, res) {
    console.log('hierarchy add');
    res.status(200).json(hierarchyAdd)
});

// app.get('/action/content/v3/hierarchy/*', function(req, res) {
//     console.log('hierarchyRead');
//     res.status(200).json(hierarchyRead)
// });
app.post('/action/content/v3/upload/url/*', function(req, res) {
    console.log('contentV3UploadUrl');
    res.status(200).json(contentV3UploadUrl)
});
app.post('/action/content/v3/review/*', function(req, res) {
    console.log('content/v3/review');
    res.status(200).json(contentV3Review)
});
app.post('/action/object/category/definition/v1/*', function(req, res) {
    console.log('categoryDefinationRead');
    res.status(200).json(categoryDefinationRead)
});
app.get('/action/content/v3/read/*', function(req, res) {
    console.log('content v3 read');
    res.status(200).json(contentV3Read)
});
app.post('/action/content/v3/reject/*', function(req, res) {
    console.log('content reject');
    res.status(200).json(contentV3Reject)
});
app.post('/action/content/v3/publish/*', function(req, res) {
    console.log('content publish');
    res.status(200).json(contentV3Publish)
});
app.post('/action/dialcode/v1/reserve/*', function(req, res) {
    console.log('dialCodeV1Reserve');
    res.status(200).json(dialCodeV1Reserve)
});
app.get('/action/dialcode/v1/process/status/*', function(req, res) {
    console.log('dialCodeProcessStatus');
    res.status(200).json(dialCodeProcessStatus)
});
app.post('/action/dialcode/v3/search', function(req, res) {
    console.log('dialCodeSearch');
    res.status(200).json(dialCodeSearch)
});
app.post('/action/collection/v3/dialcode/link/*', function(req, res) {
    console.log('collectionDialCodeLink');
    res.status(200).json(collectionDialCodeLink)
});
app.post('/action/asset/v1/create', function(req, res) {
    console.log('assetCreate');
    res.status(200).json(assetCreate)
});
app.post('/action/asset/v1/upload/*', function(req, res) {
    console.log('contentUploadV3Url');
    res.status(200).json(contentUploadV3Url)
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