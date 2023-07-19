export const courseEditorConfig = {
  "context": {
    "identifier": "", // Change here : do_2138418885537628161102
    "channel": "01374279726315929680",
    "authToken": "",
    "sid": "Vqf78G5k7MaLTR3_qbPgkRDrq12YHTHl",
    "did": "cf12d0f27fd45724627b0e694c60873d",
    "uid": "2cdbb99b-1dfd-48e1-b282-a7e8b37102fe",
    "additionalCategories": {},
    "host": "https://staging.sunbirded.org",
    "pdata": {
      "id": "staging.sunbird.portal",
      "ver": "6.0.0",
      "pid": "sunbird-portal"
    },
    "actor": {
      "id": "2cdbb99b-1dfd-48e1-b282-a7e8b37102fe",
      "type": "User"
    },
    "contextRollup": {
      "l1": "01374279726315929680"
    },
    "tags": [
      "01374279726315929680",
      "01374279726315929680"
    ],
    "timeDiff": -0.238,
    "endpoint": "/data/v3/telemetry",
    "env": "collection_editor",
    "user": {
      "id": "2cdbb99b-1dfd-48e1-b282-a7e8b37102fe",
      "orgIds": [
        "01374279726315929680"
      ],
      "organisations": {},
      "fullName": "bccreator_table1_mar2023 bccreator_table1_lname",
      "firstName": "bccreator_table1_mar2023",
      "lastName": "bccreator_table1_lname",
      "isRootOrgAdmin": false
    },
    "channelData": {},
    "cloudStorageUrls": [
      "https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/",
      "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/",
      "https://sunbirdstagingpublic.blob.core.windows.net/sunbird-content-staging/",
      "https://obj.stage.sunbirded.org/sunbird-content-staging/"
    ],
    "cloudStorage": {
      "presigned_headers": {
        "x-ms-blob-type": "BlockBlob"
      }
    },
    "framework": "ekstep_ncert_k-12",
    "targetFWIds": [
      "ekstep_ncert_k-12"
    ]
  },
  config: {
    mode: 'edit', // edit / review / read 
    maxDepth: 4,
    objectType: 'Collection',
    primaryCategory: 'Course',
    isRoot: true,
    dialcodeMinLength: 2,
    dialcodeMaxLength: 250,
    collection: {
      "maxContentsLimit": 1200
    },
    iconClass: 'fa fa-book',
    showAddCollaborator: false,
    enableBulkUpload: false,
    contentPolicyUrl: '/term-of-use.html',
    publicStorageAccount: "https://sunbirdstagingpublic.blob.core.windows.net/",
    children: {},
    hierarchy: {
      "level1": {
        "name": "Course Unit",
        "type": "Unit",
        "mimeType": "application/vnd.ekstep.content-collection",
        "contentType": "CourseUnit",
        "primaryCategory": "Course Unit",
        "iconClass": "fa fa-folder-o",
        "children": {
          "Content": []
        }
      },
      "level2": {
        "name": "Course Unit",
        "type": "Unit",
        "mimeType": "application/vnd.ekstep.content-collection",
        "contentType": "CourseUnit",
        "primaryCategory": "Course Unit",
        "iconClass": "fa fa-folder-o",
        "children": {
          "Content": []
        }
      },
      "level3": {
        "name": "Course Unit",
        "type": "Unit",
        "mimeType": "application/vnd.ekstep.content-collection",
        "contentType": "CourseUnit",
        "primaryCategory": "Course Unit",
        "iconClass": "fa fa-folder-o",
        "children": {
          "Content": []
        }
      },
      "level4": {
        "name": "Course Unit",
        "type": "Unit",
        "mimeType": "application/vnd.ekstep.content-collection",
        "contentType": "CourseUnit",
        "primaryCategory": "Course Unit",
        "iconClass": "fa fa-folder-o",
        "children": {
          "Content": []
        }
      }
    }
  }
};