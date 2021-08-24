export const csvExport = {
    successExport: {
        "id": "api.collection.export",
        "ver": "4.0",
        "ts": "2021-07-05T09:58:51ZZ",
        "params": {
            "resmsgid": "0801c119-ad94-4eb9-809c-998ed95789ea",
            "msgid": null,
            "err": null,
            "status": "successful",
            "errmsg": null
        },
        "responseCode": "OK",
        "result": {
            "collection": {
                "tocUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/course/toc/do_11331579492804198413_untitled-course_1625465046239.csv",
                "ttl": "54000"
            }
        }
    },
    errorExport: {
        "id": "api.collection.export",
        "ver": "4.0",
        "ts": "2021-07-05T10:25:41ZZ",
        "params": {
            "resmsgid": "19a77469-4de8-41b6-857c-d0bea04db7f4",
            "msgid": null,
            "err": "COLLECTION_CHILDREN_NOT_EXISTS",
            "status": "failed",
            "errmsg": "No Children Exists for given Collection."
        },
        "responseCode": "CLIENT_ERROR",
        "result": {
            "messages": null
        }
    },
}
export const csvImport = {
    importError: {
        "id": "api.collection.import",
        "ver": "4.0",
        "ts": "2021-07-05T11:51:48ZZ",
        "params": {
            "resmsgid": "341d4c9d-625b-470c-8b2f-b5d6626d548a",
            "msgid": null,
            "err": "INVALID_CSV_FILE",
            "status": "failed",
            "errmsg": "Please provide valid csv file. Please check for data columns without headers."
        },
        "responseCode": "CLIENT_ERROR",
        "result": {
            "messages": null
        }
    },
    successImport: {
        "id": "api.collection.export",
        "ver": "4.0",
        "ts": "2021-07-05T09:58:51ZZ",
        "params": {
            "resmsgid": "0801c119-ad94-4eb9-809c-998ed95789ea",
            "msgid": null,
            "err": null,
            "status": "successful",
            "errmsg": null
        },
        "responseCode": "OK",
        "result": {
        }
    },
    fileUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/hierarchy/do_113316577504272384141/blank.csv'
};
export const preSignedUrl = {
    succes: {
        "id": "api.content.upload.url",
        "ver": "3.0",
        "ts": "2021-07-09T09:29:55ZZ",
        "params": {
            "resmsgid": "1ae2eef7-72a6-4b8c-96a4-cc89940f5970",
            "msgid": null,
            "err": null,
            "status": "successful",
            "errmsg": null
        },
        "responseCode": "OK",
        "result": {
            "identifier": "do_113301063790198784120",
            "url_expiry": "54000",
            "pre_signed_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/hierarchy/do_113301063790198784120/10_correct_file_format.csv?sv=2017-04-17&se=2021-07-10T00%3A29%3A55Z&sr=b&sp=w&sig=k0kpWNrtkh1lDwkD0XM9LyHhwj6mP%2Bpr/Uy1/sxY2NU%3D"
        }
    },
    error: {
        id: 'api.error',
        ver: '1.0',
        ts: '2021-07-05 03:57:14:915+0000',
        params: {
            resmsgid: '158fce40-dd45-11eb-adbf-81ddba34dfdd',
            msgid: null,
            status: 'failed',
            err: 'FORBIDDEN_ERROR',
            errmsg: 'Forbidden: API WHITELIST Access is denied'
        },
        responseCode: 'FORBIDDEN',
        result: {}
    }
};

