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
