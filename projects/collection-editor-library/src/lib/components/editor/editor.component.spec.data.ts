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
      "collection":{
        "maxContentsLimit": 10
      },
      "questionSet":{
        "maxQuestionsLimit": 10
      },
      "contentPolicyUrl": "/term-of-use.html"
    }
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
}
}