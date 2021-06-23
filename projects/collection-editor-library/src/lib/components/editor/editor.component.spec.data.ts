import { IEditorConfig } from "collection-editor-library/lib/interfaces/editor";
export let editorConfig: IEditorConfig | undefined;
editorConfig = {
    "context": {
    "framework": "test",
      "user": {
        "id": "5a587cc1-e018-4859-a0a8-e842650b9d64",
        "name": "Vaibhav",
        "orgIds": [
          "01309282781705830427"
        ]
      },
      "identifier": "do_113274017771085824116",
      "channel": "01307938306521497658",
      "authToken": " ",
      "sid": "iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV",
      "did": "7e85b4967aebd6704ba1f604f20056b6",
      "uid": "bf020396-0d7b-436f-ae9f-869c6780fc45",
      "additionalCategories": [
        {
          "value": "Textbook",
          "label": "Textbook"
        },
        {
          "value": "Lesson Plan",
          "label": "Lesson Plan"
        }
      ],
      "pdata": {
        "id": "dev.dock.portal",
        "ver": "2.8.0",
        "pid": "creation-portal"
      },
      "contextRollup": {
        "l1": "01307938306521497658"
      },
      "tags": [
        "01307938306521497658"
      ],
      "cdata": [
        {
          "id": "01307938306521497658",
          "type": "sourcing_organization"
        },
        {
          "type": "project",
          "id": "ec5cc850-3f71-11eb-aae1-fb99d9fb6737"
        },
        {
          "type": "linked_collection",
          "id": "do_113140468925825024117"
        }
      ],
      "timeDiff": 5,
      "objectRollup": {
        "l1": "do_113140468925825024117",
        "l2": "do_113140468926914560125"
      },
      "host": "",
      "defaultLicense": "CC BY 4.0",
      "endpoint": "/data/v3/telemetry",
      "env": "question_set",
      "cloudStorageUrls": [
        "https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/",
        "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/",
        "https://dockstorage.blob.core.windows.net/sunbird-content-dock/"
      ],
      "mode": "edit",
    },
    "config": {
      "mode": "edit",
      "maxDepth": 2,
      "objectType": "Collection",
      "primaryCategory": "Course",
      "isRoot": true,
      "dialcodeMinLength": 2,
      "dialcodeMaxLength": 250,
      "iconClass": "fa fa-book",
      "children": {},
      "hierarchy": {
        "level1": {
          "name": "Module",
          "type": "Unit",
          "mimeType": "application/vnd.ekstep.content-collection",
          "contentType": "CourseUnit",
          "primaryCategory": "Course Unit",
          "iconClass": "fa fa-folder-o",
          "children": {}
        },
        "level2": {
          "name": "Sub-Module",
          "type": "Unit",
          "mimeType": "application/vnd.ekstep.content-collection",
          "contentType": "CourseUnit",
          "primaryCategory": "Course Unit",
          "iconClass": "fa fa-folder-o",
          "children": {
            "Content": [
              "Explanation Content",
              "Learning Resource",
              "eTextbook",
              "Teacher Resource",
              "Course Assessment"
            ]
          }
        },
        "level3": {
          "name": "Sub-Sub-Module",
          "type": "Unit",
          "mimeType": "application/vnd.ekstep.content-collection",
          "contentType": "CourseUnit",
          "primaryCategory": "Course Unit",
          "iconClass": "fa fa-folder-o",
          "children": {
            "Content": [
              "Explanation Content",
              "Learning Resource",
              "eTextbook",
              "Teacher Resource",
              "Course Assessment"
            ]
          }
        }
      },
      "contentPolicyUrl": "/term-of-use.html"
    }
  }

export const configServiceData = {
    "urlConFig": {
        "URLS": {
            "QuestionSet": {
                "HIERARCHY_READ": "questionset/v1/hierarchy",
                "READ": "questionset/v1/read",
                "HIERARCHY_UPDATE": "questionset/v1/hierarchy/update",
                "CONTENT_REVIEW": "questionset/v1/review/",
                "CONTENT_REJECT": "questionset/v1/reject/",
                "CONTENT_PUBLISH": "questionset/v1/publish/",
                "DEFAULT_PARAMS_FIELDS": "instructions"
            },
            "Collection": {
                "HIERARCHY_READ": "content/v3/hierarchy",
                "HIERARCHY_UPDATE": "content/v3/hierarchy/update",
                "CONTENT_REVIEW": "content/v3/review/",
                "CONTENT_REJECT": "content/v3/reject/",
                "CONTENT_PUBLISH": "content/v3/publish/"
            },
            "COMPOSITE": {
                "SEARCH": "composite/v3/search"
            },
            "DIALCODE": {
                "RESERVE": "dialcode/v1/reserve/",
                "PROCESS": "dialcode/v1/process/status/",
                "SEARCH": "dialcode/v3/search",
                "LINK": "collection/v3/dialcode/link/"
            },
            "ContentPolicyUrl": "/term-of-use.html"
        },
        "default": {
            "URLS": {
                "QuestionSet": {
                    "HIERARCHY_READ": "questionset/v1/hierarchy",
                    "READ": "questionset/v1/read",
                    "HIERARCHY_UPDATE": "questionset/v1/hierarchy/update",
                    "CONTENT_REVIEW": "questionset/v1/review/",
                    "CONTENT_REJECT": "questionset/v1/reject/",
                    "CONTENT_PUBLISH": "questionset/v1/publish/",
                    "DEFAULT_PARAMS_FIELDS": "instructions"
                },
                "Collection": {
                    "HIERARCHY_READ": "content/v3/hierarchy",
                    "HIERARCHY_UPDATE": "content/v3/hierarchy/update",
                    "CONTENT_REVIEW": "content/v3/review/",
                    "CONTENT_REJECT": "content/v3/reject/",
                    "CONTENT_PUBLISH": "content/v3/publish/"
                },
                "COMPOSITE": {
                    "SEARCH": "composite/v3/search"
                },
                "DIALCODE": {
                    "RESERVE": "dialcode/v1/reserve/",
                    "PROCESS": "dialcode/v1/process/status/",
                    "SEARCH": "dialcode/v3/search",
                    "LINK": "collection/v3/dialcode/link/"
                },
                "ContentPolicyUrl": "/term-of-use.html"
            }
        }
    },
    "categoryConfig": {
        "QuestionSet": "questionSet",
        "Collection": "content",
        "additionalCategories": {
            "QuestionSet": "contentAdditionalCategories",
            "Collection": "collectionAdditionalCategories"
        },
        "default": {
            "QuestionSet": "questionSet",
            "Collection": "content",
            "additionalCategories": {
                "QuestionSet": "contentAdditionalCategories",
                "Collection": "collectionAdditionalCategories"
            }
        }
    },
    "labelConfig": {
        "button_labels": {
            "preview_collection_btn_label": "Preview",
            "preview_collection_btn_icon": "icon eye",
            "save_collection_btn_label": "Save as Draft",
            "save_collection_btn_icon": "",
            "submit_collection_btn_label": "Send for Review",
            "submit_collection_btn_icon": "",
            "reject_collection_btn_label": "Reject",
            "reject_collection_btn_icon": "",
            "publish_collection_btn_label": "Publish",
            "publish_collection_btn_icon": "",
            "edit_question_btn_label": "Edit",
            "edit_question_btn_icon": "icon edit",
            "preview_question_btn_label": "Preview",
            "preview_question_btn_icon": "icon eye",
            "cancel_question_btn_label": "Cancel",
            "cancel_question_btn_icon": "",
            "save_question_btn_label": "Save",
            "save_question_btn_icon": "",
            "send_back_for_correction_collection_btn_label": "Send Back For Corrections",
            "send_back_for_correction_collection_btn_icon": "",
            "sourcing_approve_collection_btn_label": "Approve",
            "sourcing_approve_collection_btn_icon": "",
            "sourcing_reject_collection_btn_label": "Reject",
            "sourcing_reject_collection_btn_icon": ""
        },
        "lbl": {
            "search": "Search",
            "subject": "Subject",
            "medium": "Medium",
            "gradeLevel": "Class",
            "contentType": "Content Type",
            "reset": "Reset",
            "apply": "apply",
            "filterText": "Change Filters",
            "Questiondetails": "Question details",
            "selectContent": "Select content",
            "noMatchingContent": "Sorry there is no matching content",
            "changeFilterMessage": "Changing filter helps you find more content",
            "changeFilter": "Change filters",
            "whereDoYouWantToAddThisContent": "Where do you want to add this content?",
            "selectContentToAdd": "Use search and filters above to find more content",
            "addedToCollection": "Added to collection",
            "changingFilters": "Changing filters make you find more content",
            "ChangeFilters": "Change filters",
            "addFromLibrary": "Add from Library",
            "showContentAddedToCollection": "Show content added to collection",
            "addContent": "Add content",
            "sortBy": "Sort By",
            "sortlabel": "A - Z",
            "viewOnOrigin": "View Content on consumption"
        },
        "err": {
            "somethingWentWrong": "Something went wrong",
            "contentNotFoundonOrigin": "The content not found in consumption"
        },
        "termsAndConditions": {
            "001": "I understand and confirm that all resources and assets created through the content editor or uploaded on the platform shall be available for free and public use without limitations on the platform (web portal, applications and any other end user interface that the platform would enable) and will be licensed under terms & conditions and policy guidelines of the platform. In doing so, the copyright and license of the original author is not infringed."
        },
        "messages": {
            "error": {
                "001": "Something went wrong, Please try later",
                "002": "Sending for review failed. Please try again...",
                "003": "Rejecting failed. Please try again...",
                "004": "Publishing failed. Please try again...",
                "005": "Please fill the required metadata",
                "006": "Fetch question set template failed. Please try again...",
                "007": "Sorry, this operation is not allowed...",
                "008": "Please fill the required fields",
                "009": "File is required to upload",
                "010": "No external link allowed",
                "011": "Unable to read the Video, Please Try Again",
                "012": "QR code(s) updating failed!",
                "013": "No new QR Codes have been generated!",
                "014": "The number should be at least {number}",
                "015": "The number should be greater than {number}",
                "016": "No images found, please try searching for something else",
                "017": "No videos found, please try searching for something else"
            },
            "success": {
                "001": "Content is saved",
                "002": "Content is sent for review",
                "003": "Content is sent back for corrections",
                "004": "Content is published",
                "005": "Content is added to the folder",
                "006": "Asset Successfully Uploaded...",
                "007": "Question is created sucessfully",
                "008": "Question is updated sucessfully",
                "009": "QR code(s) updated successfully",
                "010": "QR code generated.",
                "011": "QR codes downloaded"
            },
            "warning": {
                "001": "Errors found in linked QR Codes. Please check and correct.",
                "002": "Unable to update some of the QR codes."
            },
            "info": {
                "001": "QR code image generation is in progress. Please try downloading after sometime"
            }
        },
        "default": {
            "button_labels": {
                "preview_collection_btn_label": "Preview",
                "preview_collection_btn_icon": "icon eye",
                "save_collection_btn_label": "Save as Draft",
                "save_collection_btn_icon": "",
                "submit_collection_btn_label": "Send for Review",
                "submit_collection_btn_icon": "",
                "reject_collection_btn_label": "Reject",
                "reject_collection_btn_icon": "",
                "publish_collection_btn_label": "Publish",
                "publish_collection_btn_icon": "",
                "edit_question_btn_label": "Edit",
                "edit_question_btn_icon": "icon edit",
                "preview_question_btn_label": "Preview",
                "preview_question_btn_icon": "icon eye",
                "cancel_question_btn_label": "Cancel",
                "cancel_question_btn_icon": "",
                "save_question_btn_label": "Save",
                "save_question_btn_icon": "",
                "send_back_for_correction_collection_btn_label": "Send Back For Corrections",
                "send_back_for_correction_collection_btn_icon": "",
                "sourcing_approve_collection_btn_label": "Approve",
                "sourcing_approve_collection_btn_icon": "",
                "sourcing_reject_collection_btn_label": "Reject",
                "sourcing_reject_collection_btn_icon": ""
            },
            "lbl": {
                "search": "Search",
                "subject": "Subject",
                "medium": "Medium",
                "gradeLevel": "Class",
                "contentType": "Content Type",
                "reset": "Reset",
                "apply": "apply",
                "filterText": "Change Filters",
                "Questiondetails": "Question details",
                "selectContent": "Select content",
                "noMatchingContent": "Sorry there is no matching content",
                "changeFilterMessage": "Changing filter helps you find more content",
                "changeFilter": "Change filters",
                "whereDoYouWantToAddThisContent": "Where do you want to add this content?",
                "selectContentToAdd": "Use search and filters above to find more content",
                "addedToCollection": "Added to collection",
                "changingFilters": "Changing filters make you find more content",
                "ChangeFilters": "Change filters",
                "addFromLibrary": "Add from Library",
                "showContentAddedToCollection": "Show content added to collection",
                "addContent": "Add content",
                "sortBy": "Sort By",
                "sortlabel": "A - Z",
                "viewOnOrigin": "View Content on consumption"
            },
            "err": {
                "somethingWentWrong": "Something went wrong",
                "contentNotFoundonOrigin": "The content not found in consumption"
            },
            "termsAndConditions": {
                "001": "I understand and confirm that all resources and assets created through the content editor or uploaded on the platform shall be available for free and public use without limitations on the platform (web portal, applications and any other end user interface that the platform would enable) and will be licensed under terms & conditions and policy guidelines of the platform. In doing so, the copyright and license of the original author is not infringed."
            },
            "messages": {
                "error": {
                    "001": "Something went wrong, Please try later",
                    "002": "Sending for review failed. Please try again...",
                    "003": "Rejecting failed. Please try again...",
                    "004": "Publishing failed. Please try again...",
                    "005": "Please fill the required metadata",
                    "006": "Fetch question set template failed. Please try again...",
                    "007": "Sorry, this operation is not allowed...",
                    "008": "Please fill the required fields",
                    "009": "File is required to upload",
                    "010": "No external link allowed",
                    "011": "Unable to read the Video, Please Try Again",
                    "012": "QR code(s) updating failed!",
                    "013": "No new QR Codes have been generated!",
                    "014": "The number should be at least {number}",
                    "015": "The number should be greater than {number}",
                    "016": "No images found, please try searching for something else",
                    "017": "No videos found, please try searching for something else"
                },
                "success": {
                    "001": "Content is saved",
                    "002": "Content is sent for review",
                    "003": "Content is sent back for corrections",
                    "004": "Content is published",
                    "005": "Content is added to the folder",
                    "006": "Asset Successfully Uploaded...",
                    "007": "Question is created sucessfully",
                    "008": "Question is updated sucessfully",
                    "009": "QR code(s) updated successfully",
                    "010": "QR code generated.",
                    "011": "QR codes downloaded"
                },
                "warning": {
                    "001": "Errors found in linked QR Codes. Please check and correct.",
                    "002": "Unable to update some of the QR codes."
                },
                "info": {
                    "001": "QR code image generation is in progress. Please try downloading after sometime"
                }
            }
        }
    },
    "playerConfig": {
        "playerConfig": {
            "context": {
                "mode": "play",
                "partner": [],
                "pdata": {
                    "id": "sunbird.portal",
                    "ver": "1.8.0",
                    "pid": "sunbird-portal"
                }
            },
            "config": {
                "showEndPage": false,
                "endPage": [
                    {
                        "template": "assessment",
                        "contentType": [
                            "SelfAssess"
                        ]
                    }
                ],
                "showStartPage": true,
                "host": "",
                "overlay": {
                    "showUser": false
                },
                "splash": {
                    "text": "",
                    "icon": "",
                    "bgImage": "assets/icons/splacebackground_1.png",
                    "webLink": ""
                },
                "sideMenu": {
                    "showDownload": true,
                    "showExit": false,
                    "showShare": true
                },
                "apislug": "/action",
                "repos": [
                    "/sunbird-plugins/renderer"
                ],
                "plugins": [
                    {
                        "id": "org.sunbird.iframeEvent",
                        "ver": 1,
                        "type": "plugin"
                    },
                    {
                        "id": "org.sunbird.player.endpage",
                        "ver": 1.1,
                        "type": "plugin"
                    }
                ]
            }
        },
        "contentType": {
            "Course": "Course"
        },
        "MIME_TYPE": {
            "collection": "application/vnd.ekstep.content-collection",
            "ecmlContent": "application/vnd.ekstep.ecml-archive",
            "genericMimeType": [
                "application/pdf",
                "video/mp4",
                "video/x-youtube",
                "video/youtube",
                "application/vnd.ekstep.html-archive",
                "application/epub",
                "application/vnd.ekstep.h5p-archive",
                "video/webm",
                "text/x-url"
            ],
            "pdf": "application/pdf",
            "mp4": "video/mp4",
            "youtube": "video/x-youtube",
            "pYoutube": "video/youtube",
            "html": "application/vnd.ekstep.html-archive",
            "ePub": "application/epub",
            "h5p": "application/vnd.ekstep.h5p-archive",
            "webm": "video/webm",
            "xUrl": "text/x-url"
        },
        "playerType": {
            "pdf-player": [
                "application/pdf"
            ],
            "video-player": [
                "video/mp4",
                "video/webm"
            ]
        },
        "baseURL": "/content/preview/preview.html?webview=true",
        "localBaseUrl": "/contentPlayer/preview/preview.html?",
        "cdnUrl": "/content/preview/preview_cdn.html?webview=true",
        "threshold": 2,
        "default": {
            "playerConfig": {
                "context": {
                    "mode": "play",
                    "partner": [],
                    "pdata": {
                        "id": "sunbird.portal",
                        "ver": "1.8.0",
                        "pid": "sunbird-portal"
                    }
                },
                "config": {
                    "showEndPage": false,
                    "endPage": [
                        {
                            "template": "assessment",
                            "contentType": [
                                "SelfAssess"
                            ]
                        }
                    ],
                    "showStartPage": true,
                    "host": "",
                    "overlay": {
                        "showUser": false
                    },
                    "splash": {
                        "text": "",
                        "icon": "",
                        "bgImage": "assets/icons/splacebackground_1.png",
                        "webLink": ""
                    },
                    "sideMenu": {
                        "showDownload": true,
                        "showExit": false,
                        "showShare": true
                    },
                    "apislug": "/action",
                    "repos": [
                        "/sunbird-plugins/renderer"
                    ],
                    "plugins": [
                        {
                            "id": "org.sunbird.iframeEvent",
                            "ver": 1,
                            "type": "plugin"
                        },
                        {
                            "id": "org.sunbird.player.endpage",
                            "ver": 1.1,
                            "type": "plugin"
                        }
                    ]
                }
            },
            "contentType": {
                "Course": "Course"
            },
            "MIME_TYPE": {
                "collection": "application/vnd.ekstep.content-collection",
                "ecmlContent": "application/vnd.ekstep.ecml-archive",
                "genericMimeType": [
                    "application/pdf",
                    "video/mp4",
                    "video/x-youtube",
                    "video/youtube",
                    "application/vnd.ekstep.html-archive",
                    "application/epub",
                    "application/vnd.ekstep.h5p-archive",
                    "video/webm",
                    "text/x-url"
                ],
                "pdf": "application/pdf",
                "mp4": "video/mp4",
                "youtube": "video/x-youtube",
                "pYoutube": "video/youtube",
                "html": "application/vnd.ekstep.html-archive",
                "ePub": "application/epub",
                "h5p": "application/vnd.ekstep.h5p-archive",
                "webm": "video/webm",
                "xUrl": "text/x-url"
            },
            "playerType": {
                "pdf-player": [
                    "application/pdf"
                ],
                "video-player": [
                    "video/mp4",
                    "video/webm"
                ]
            },
            "baseURL": "/content/preview/preview.html?webview=true",
            "localBaseUrl": "/contentPlayer/preview/preview.html?",
            "cdnUrl": "/content/preview/preview_cdn.html?webview=true",
            "threshold": 2
        }
    },
    "editorConfig": {
        "rejectCommentsMaxLength": 500,
        "setDefaultCopyRight": true,
        "showOriginPreviewUrl": false,
        "showSourcingStatus": false,
        "showCorrectionComments": false,
        "assetConfig": {
            "image": {
                "size": "1",
                "accepted": "png, jpeg"
            },
            "video": {
                "size": "50",
                "accepted": "mp4, webm"
            }
        },
        "default": {
            "rejectCommentsMaxLength": 500,
            "setDefaultCopyRight": true,
            "showOriginPreviewUrl": false,
            "showSourcingStatus": false,
            "showCorrectionComments": false,
            "assetConfig": {
                "image": {
                    "size": "1",
                    "accepted": "png, jpeg"
                },
                "video": {
                    "size": "50",
                    "accepted": "mp4, webm"
                }
            },
            "mode": "edit",
            "maxDepth": 2,
            "objectType": "Collection",
            "primaryCategory": "Course",
            "isRoot": true,
            "dialcodeMinLength": 2,
            "dialcodeMaxLength": 250,
            "iconClass": "fa fa-book",
            "children": {},
            "hierarchy": {
                "level1": {
                    "name": "Module",
                    "type": "Unit",
                    "mimeType": "application/vnd.ekstep.content-collection",
                    "contentType": "CourseUnit",
                    "primaryCategory": "Course Unit",
                    "iconClass": "fa fa-folder-o",
                    "children": {}
                },
                "level2": {
                    "name": "Sub-Module",
                    "type": "Unit",
                    "mimeType": "application/vnd.ekstep.content-collection",
                    "contentType": "CourseUnit",
                    "primaryCategory": "Course Unit",
                    "iconClass": "fa fa-folder-o",
                    "children": {
                        "Content": [
                            "Explanation Content",
                            "Learning Resource",
                            "eTextbook",
                            "Teacher Resource",
                            "Course Assessment"
                        ]
                    }
                },
                "level3": {
                    "name": "Sub-Sub-Module",
                    "type": "Unit",
                    "mimeType": "application/vnd.ekstep.content-collection",
                    "contentType": "CourseUnit",
                    "primaryCategory": "Course Unit",
                    "iconClass": "fa fa-folder-o",
                    "children": {
                        "Content": [
                            "Explanation Content",
                            "Learning Resource",
                            "eTextbook",
                            "Teacher Resource",
                            "Course Assessment"
                        ]
                    }
                }
            },
            "contentPolicyUrl": "/term-of-use.html"
        }
    },
    "sessionContext": [
        "board",
        "medium",
        "gradeLevel",
        "subject",
        "topic",
        "author",
        "channel",
        "framework",
        "copyright",
        "attributions",
        "audience",
        "license"
    ]
}

export const nativeElement = `<div><ul id="ft-id-1" class="ui-fancytree fancytree-container fancytree-plain fancytree-ext-glyph fancytree-ext-dnd5 fancytree-connectors" tabindex="0" role="tree" aria-multiselectable="true"><li role="treeitem" aria-expanded="false" aria-selected="false" class="fancytree-lastsib"><span class="fancytree-node fancytree-folder fancytree-has-children fancytree-lastsib fancytree-exp-cl fancytree-ico-cf" draggable="true"><span role="button" class="fancytree-expander fa fa-caret-right"></span><span role="presentation" class="fancytree-custom-icon fa fa-book"></span><span class="fancytree-title" title="SB23410q" style="width:15em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden">SB23410q</span><span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0" style="display: none;"> <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id="contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addchild" class="item">Add Child</div>
  </span>
  </span></span></li></ul></div>`;

export const getCategoryDefinitionResponse = {
    "id": "api.object.category.definition.read",
    "ver": "3.0",
    "ts": "2021-06-23T11:43:39ZZ",
    "params": {
        "resmsgid": "7efb262e-1b7e-44b7-8fe8-ceddc963cf47",
        "msgid": null,
        "err": null,
        "status": "successful",
        "errmsg": null
    },
    "responseCode": "OK",
    "result": {
        "objectCategoryDefinition": {
            "identifier": "obj-cat:multiple-choice-question_question_all",
            "objectMetadata": {
                "config": {},
                "schema": {
                    "properties": {
                        "mimeType": {
                            "type": "string",
                            "enum": [
                                "application/vnd.sunbird.question"
                            ]
                        },
                        "interactionTypes": {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "choice"
                                ]
                            }
                        }
                    }
                }
            },
            "languageCode": [],
            "name": "Multiple Choice Question",
            "forms": {}
        }
    }
}

export const editorServiceSelectedChildren = {
    "mimeType": "application/vnd.sunbird.question",
    "primaryCategory": "Multiple Choice Question",
    "interactionType": "choice"
}