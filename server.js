var express = require('express'),
    http = require('http');
bodyParser = require('body-parser'),
    proxy = require('express-http-proxy'),
    urlHelper = require('url');
const dotenv = require('dotenv');
dotenv.config();
const latexService = require('./latexService.js')

// ENV Variables
const BASE_URL = process.env.BASE_URL;
const API_AUTH_TOKEN = process.env.AUTH_API_TOKEN;
const USER_TOKEN = process.env.USER_API_TOKEN;

var app = express();
app.set('port', 3000);
app.use(express.json())
app.get("/latex/convert", latexService.convert)
app.post("/latex/convert", bodyParser.json({ limit: '1mb' }), latexService.convert);
app.use(express.static(__dirname + '/dist/sunbird-collection-editor/'));

var publicRequestHeaders = {
    authorization: `Bearer ${API_AUTH_TOKEN}`,
    "x-authenticated-user-token": USER_TOKEN,
    "x-channel-id": '01374279726315929680',
    "user-id": 'collection-editor'
};

var contentTypeHeaders = {
    'content-type': "application/json"
}

const decoratePublicRequestHeaders = function () {
    return function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers = Object.assign({}, proxyReqOpts.headers, publicRequestHeaders, contentTypeHeaders);
        return proxyReqOpts;
    }
}

const customDecorateReqHeaders = function () {
    return function (proxyReqOpts, srcReq) {
        proxyReqOpts.headers = Object.assign({}, proxyReqOpts.headers, publicRequestHeaders);
        return proxyReqOpts;
    }
}

app.post(['/action/content/v3/upload/url/*'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "/api/");
        originalUrl = originalUrl.replace("/v3/", "/v2/");
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
})
);

app.post(['/action/content/v3/upload/:do_id', '/action/asset/v1/upload/*', '/action/collection/v1/import/*'], proxy(BASE_URL, {
    https: true,
    parseReqBody: false,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "/api/");
        originalUrl = originalUrl.replace("/v3/", "/v2/");
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: customDecorateReqHeaders()
})
);

app.use(['/action/dialcode/v1/reserve', '/action/dialcode/v1/process/status/*'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "/api/");
        originalUrl = originalUrl.replace("/v3/", "/v1/");
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
})
);

app.use(['/action/dialcode/v3/search', '/action/collection/v3/dialcode/link/*', '/action/asset/v1/create'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "/api/");
        originalUrl = originalUrl.replace("/v3/", "/v1/");
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
})
);

app.all(['/api/framework/v1/read/*',
    '/learner/framework/v1/read/*',
    '/api/channel/v1/read/*'], proxy(BASE_URL, {
        https: true,
        proxyReqPathResolver: function (req) {
            console.log('proxyReqPathResolver ', urlHelper.parse(req.url).path);
            return urlHelper.parse(req.url).path;
        },
        proxyReqOptDecorator: decoratePublicRequestHeaders()
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
    proxyReqOptDecorator: decoratePublicRequestHeaders()
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
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));

app.use(['/action/content/v3/hierarchy/*'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "/api/");
        originalUrl = originalUrl.replace("/content/v3/", "/collection/v1/");
        console.log(urlHelper.parse(originalUrl).path);
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
})
);

app.use([
    '/action/composite/v3/search', '/action/content/v3/*'
], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace("/action/", "/api/");
        originalUrl = originalUrl.replace("/v3/", "/v1/");
        console.log(urlHelper.parse(originalUrl).path);
        return urlHelper.parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
})
);

app.use(['/api', '/assets', '/action'], proxy(BASE_URL, {
    https: true,
    limit: '30mb',
    proxyReqPathResolver: function (req) {
        console.log('proxyReqPathResolver ', urlHelper.parse(req.url).path);
        return urlHelper.parse(req.url).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));

app.use(['/action/content/*'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
        let originalUrl = req.originalUrl.replace('/api/', '/api/')
        console.log('proxyReqPathResolver questionset', originalUrl, require('url').parse(originalUrl).path);
        return require('url').parse(originalUrl).path;
    },
    proxyReqOptDecorator: decoratePublicRequestHeaders()
}));
app.use(['/content/preview/*', '/content-plugins/*', '/assets/public/*'], proxy(BASE_URL, {
    https: true,
    proxyReqPathResolver: function (req) {
        return require('url').parse(`https://${BASE_URL}` + req.originalUrl).path
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        console.log('proxyReqOptDecorator 5')
        // you can update headers 
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['user-id'] = 'content-editor';
        proxyReqOpts.headers['authorization'] = `Bearer ${API_AUTH_TOKEN}`;
        return proxyReqOpts;
    }
}));
http.createServer(app).listen(app.get('port'), function () {
    console.log(`Https App started and listening on port ${app.get('port')}`);
});