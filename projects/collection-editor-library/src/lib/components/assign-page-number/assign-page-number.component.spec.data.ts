export const mockTreeData = [
    {
        "id": "do_1134460323603906561218",
        "title": "Science1",
        "tooltip": "Science1",
        "primaryCategory": "Observation With Rubrics",
        "objectType": "QuestionSet",
        "metadata": {
            "parent": "do_1134357224765685761203",
            "code": "a51c0d9f-4696-3354-062f-b2078048656c",
            "allowScoring": "Yes",
            "allowSkip": "Yes",
            "containsUserData": "No",
            "channel": "01309282781705830427",
            "language": [
                "English"
            ],
            "mimeType": "application/vnd.sunbird.questionset",
            "showHints": "No",
            "matrix": [
                [
                    "Good",
                    "1",
                    "1"
                ],
                [
                    "Average",
                    "11",
                    "1"
                ],
                [
                    "Bad",
                    "0",
                    "1"
                ]
            ],
            "createdOn": "2022-01-05T05:42:52.118+0000",
            "ecm": [],
            "objectType": "QuestionSet",
            "primaryCategory": "Observation With Rubrics",
            "contentDisposition": "inline",
            "lastUpdatedOn": "2022-10-17T10:32:55.087+0000",
            "contentEncoding": "gzip",
            "showSolutions": "No",
            "allowAnonymousAccess": "Yes",
            "identifier": "do_1134460323603906561218",
            "lastStatusChangedOn": "2022-01-05T05:42:52.118+0000",
            "requiresSubmit": "No",
            "visibility": "Parent",
            "showTimer": "No",
          
            "index": 1,
            "setType": "materialised",
            "languageCode": [
                "en"
            ],
            "version": 1,
            "versionKey": "1641361372118",
            "showFeedback": "No",
            "license": "CC BY 4.0",
            "depth": 1,
            "minPossibleScore": "32",
            "compatibilityLevel": 5,
            "name": "Science1",
            "navigationMode": "non-linear",
            "allowBranching": "Yes",
            "maxPossibleScore": "32",
            "shuffle": true,
            "attributions": [],
            "status": "Draft"
        },
        "folder": true,
        "children": [
            {
                "id": "do_1134460323602841601200",
                "title": "Chemistry",
                "tooltip": "Chemistry",
                "primaryCategory": "Observation With Rubrics",
                "objectType": "QuestionSet",
                "metadata": {
                    "parent": "do_1134460323603906561218",
                    "code": "b4c3e613-5c3f-9c8b-d61f-417f4c5d8df2",
                    "allowScoring": "Yes",
                    "allowSkip": "Yes",
                    "containsUserData": "No",
                    "channel": "01309282781705830427",
                    "branchingLogic": {
                        "do_11357626234228736013446": {
                            "target": [],
                            "source": [
                                "do_113449672558780416163"
                            ],
                            "preCondition": {
                                "and": [
                                    {
                                        "eq": [
                                            {
                                                "var": "do_113449672558780416163.response1.value",
                                                "type": "responseDeclaration"
                                            },
                                            [
                                                0
                                            ]
                                        ]
                                    }
                                ]
                            }
                        },
                        "do_113583409935081472146": {
                            "target": [],
                            "source": [
                                "do_11358056771369369615004"
                            ],
                            "preCondition": {
                                "and": [
                                    {
                                        "eq": [
                                            {
                                                "var": "do_11358056771369369615004.response1.value",
                                                "type": "responseDeclaration"
                                            },
                                            [
                                                0
                                            ]
                                        ]
                                    }
                                ]
                            }
                        },
                        "do_11357624960711065613442": {
                            "target": [],
                            "source": [
                                "do_113449672558780416163"
                            ],
                            "preCondition": {
                                "and": [
                                    {
                                        "eq": [
                                            {
                                                "var": "do_113449672558780416163.response1.value",
                                                "type": "responseDeclaration"
                                            },
                                            [
                                                0
                                            ]
                                        ]
                                    }
                                ]
                            }
                        },
                        "do_11357638131503104013481": {
                            "target": [],
                            "source": [
                                "do_113449672558780416163"
                            ],
                            "preCondition": {
                                "and": [
                                    {
                                        "ne": [
                                            {
                                                "var": "do_113449672558780416163.response1.value",
                                                "type": "responseDeclaration"
                                            },
                                            [
                                                0
                                            ]
                                        ]
                                    }
                                ]
                            }
                        },
                        "do_11358056771369369615004": {
                            "target": [
                                "do_113583409935081472146"
                            ],
                            "preCondition": {},
                            "source": []
                        },
                        "do_113449672558780416163": {
                            "target": [
                                "do_11357623678335385613440",
                                "do_11357624960711065613442",
                                "do_11357626234228736013446",
                                "do_11357638131503104013481"
                            ],
                            "preCondition": {},
                            "source": []
                        },
                        "do_11357623678335385613440": {
                            "target": [],
                            "source": [
                                "do_113449672558780416163"
                            ],
                            "preCondition": {
                                "and": [
                                    {
                                        "eq": [
                                            {
                                                "var": "do_113449672558780416163.response1.value",
                                                "type": "responseDeclaration"
                                            },
                                            [
                                                0
                                            ]
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    "description": "test",
                    "language": [
                        "English"
                    ],
                    "mimeType": "application/vnd.sunbird.questionset",
                    "showHints": "No",
                    "matrix": "",
                    "createdOn": "2022-01-05T05:42:52.106+0000",
                    "ecm": [],
                    "objectType": "QuestionSet",
                    "primaryCategory": "Observation With Rubrics",
                    "contentDisposition": "inline",
                    "lastUpdatedOn": "2022-10-17T10:11:48.683+0000",
                    "contentEncoding": "gzip",
                    "showSolutions": "No",
                    "allowAnonymousAccess": "Yes",
                    "identifier": "do_1134460323602841601200",
                    "lastStatusChangedOn": "2022-01-05T05:42:52.106+0000",
                    "requiresSubmit": "No",
                    "visibility": "Parent",
                    "showTimer": "No",
                 
                    "index": 1,
                    "setType": "materialised",
                    "languageCode": [
                        "en"
                    ],
                    "version": 1,
                    "versionKey": "1641361372106",
                    "showFeedback": "No",
                    "license": "CC BY 4.0",
                    "depth": 2,
                    "minPossibleScore": "204",
                    "compatibilityLevel": 5,
                    "name": "Chemistry",
                    "navigationMode": "non-linear",
                    "allowBranching": "Yes",
                    "maxPossibleScore": "23",
                    "shuffle": true,
                    "attributions": [],
                    "status": "Draft"
                },
                "folder": true,
                "children": [
                    {
                        "id": "do_113449672558780416163",
                        "title": "Parent Question MCQ",
                        "tooltip": "Parent Question MCQ",
                        "primaryCategory": "Multiselect Multiple Choice Question",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "d0ab14ae-9f67-41cf-dcfa-80c8432bf424",
                            "evidence": {
                                "required": "No",
                                "mimeType": [
                                    "audio"
                                ],
                                "minCount": 1,
                                "maxCount": 1,
                                "sizeLimit": "20480"
                            },
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "templateId": "mcq-vertical",
                            "createdOn": "2022-01-10T09:08:52.273+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Multiselect Multiple Choice Question",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-10T10:01:37.428+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_113449672558780416163",
                            "lastStatusChangedOn": "2022-01-10T09:08:52.273+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 1,
                            "qType": "MCQ",
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665396097434",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "choice"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "Parent Question MCQ",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "Yes"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "parent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11357638131503104013481",
                        "title": " asd",
                        "tooltip": " asd",
                        "primaryCategory": "Text",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "cbc33c95-3431-4568-101b-752e1ed51836",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-07-08T09:38:29.745+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Text",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-07-18T12:06:51.740+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11357638131503104013481",
                            "lastStatusChangedOn": "2022-07-08T09:38:29.745+0000",
                            "creator": "Vaibahv Bhuva",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 2,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1658146011745",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "text"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": " asd",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "dependent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11357626234228736013446",
                        "title": "cc",
                        "tooltip": "cc",
                        "primaryCategory": "Text",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "a9d7df75-cb28-60ca-1585-fd1d4c1f3158",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-07-08T05:36:26.705+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Text",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-07-18T12:07:46.775+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11357626234228736013446",
                            "lastStatusChangedOn": "2022-07-08T05:36:26.705+0000",
                            "creator": "Vaibahv Bhuva",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 3,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1658146066784",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "text"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "cc",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "dependent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11357624960711065613442",
                        "title": "child date",
                        "tooltip": "child date",
                        "primaryCategory": "Date",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "d5590147-17f3-65a4-2c12-1af7cf28f058",
                            "subject": [
                                "English"
                            ],
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-07-08T05:10:32.118+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Date",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-07-18T12:08:30.500+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11357624960711065613442",
                            "lastStatusChangedOn": "2022-07-08T05:10:32.118+0000",
                            "creator": "Vaibahv Bhuva",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 4,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1658146110507",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "date"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "child date",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "dependent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11357623678335385613440",
                        "title": "bb s",
                        "tooltip": "bb s",
                        "primaryCategory": "Date",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "b22ac67b-6381-3f9a-5d6b-5421149b6dab",
                            "subject": [
                                "English"
                            ],
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-07-08T04:44:26.718+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Date",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-07-18T09:48:39.257+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11357623678335385613440",
                            "lastStatusChangedOn": "2022-07-08T04:44:26.718+0000",
                            "creator": "Vaibahv Bhuva",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 5,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1658137719265",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "date"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "bb s",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "dependent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11358056771369369615004",
                        "title": "mcq 2",
                        "tooltip": "mcq 2",
                        "primaryCategory": "Multiselect Multiple Choice Question",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "3d5ac972-c983-c0cd-5d7b-78881da02d99",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "templateId": "mcq-vertical",
                            "createdOn": "2022-07-14T07:35:44.738+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Multiselect Multiple Choice Question",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-11T08:07:07.671+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11358056771369369615004",
                            "lastStatusChangedOn": "2022-07-14T07:35:44.738+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 6,
                            "qType": "MCQ",
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665475627678",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "choice"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "mcq 2",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "parent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_113583409935081472146",
                        "title": "abcd",
                        "tooltip": "abcd",
                        "primaryCategory": "Multiselect Multiple Choice Question",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "266153c7-e63e-9c5c-f984-ca36b5676812",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "templateId": "mcq-vertical",
                            "createdOn": "2022-07-18T07:58:15.591+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Multiselect Multiple Choice Question",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-04T06:46:46.698+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_113583409935081472146",
                            "lastStatusChangedOn": "2022-07-18T07:58:15.591+0000",
                            "creator": "Vaibahv Bhuva",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 7,
                            "qType": "MCQ",
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1664866006706",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "choice"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "abcd",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "dependent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_1136011660822200321804",
                        "title": "test Date",
                        "tooltip": "test Date",
                        "primaryCategory": "Date",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "88244472-ade7-96b0-3c6c-ebe4f01944a9",
                            "subject": [
                                "English"
                            ],
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "isCollaborationEnabled": false,
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-08-12T10:03:14.021+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Date",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-11T08:17:31.886+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_1136011660822200321804",
                            "lastStatusChangedOn": "2022-08-12T10:03:14.021+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 8,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665476251895",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "date"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "test Date",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_1136011666813255681808",
                        "title": "Test Date 2",
                        "tooltip": "Test Date 2",
                        "primaryCategory": "Date",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "b6861b66-d634-6b92-c8e3-d5337e9338ed",
                            "subject": [
                                "English"
                            ],
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "isCollaborationEnabled": false,
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-08-12T10:04:27.154+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Date",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-11T08:18:06.321+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_1136011666813255681808",
                            "lastStatusChangedOn": "2022-08-12T10:04:27.154+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 9,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665476286330",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "date"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "Test Date 2",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11364293879332864011476",
                        "title": "Parent Date",
                        "tooltip": "Parent Date",
                        "primaryCategory": "Text",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "bfffa660-e482-ee2f-566e-9297c2c16da9",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "isReviewModificationAllowed": false,
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-10-10T10:30:01.920+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Text",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-10T10:30:01.920+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11364293879332864011476",
                            "lastStatusChangedOn": "2022-10-10T10:30:01.920+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 10,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665397801921",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "text"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "Parent Date",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11364297206960128011480",
                        "title": "Parent Text2",
                        "tooltip": "Parent Text2",
                        "primaryCategory": "Text",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323602841601200",
                            "code": "4fc18a9b-73da-0360-aa0c-c952ed6e6c3b",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "isReviewModificationAllowed": false,
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-10-10T11:37:43.965+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Text",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-11T08:18:16.341+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11364297206960128011480",
                            "lastStatusChangedOn": "2022-10-10T11:37:43.965+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 11,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665476296349",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "text"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "Parent Text2",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "",
                        "icon": "fa fa-file-o"
                    }
                ],
                "root": false,
                "extraClasses": "",
                "icon": "fa fa-folder-o"
            },
            {
                "id": "do_1134460323604971521236",
                "title": "Biology",
                "tooltip": "Biology",
                "primaryCategory": "Observation With Rubrics",
                "objectType": "QuestionSet",
                "metadata": {
                    "parent": "do_1134460323603906561218",
                    "code": "bfdac63e-4cd1-c9fe-00a0-be98f73e13d8",
                    "allowScoring": "Yes",
                    "allowSkip": "Yes",
                    "containsUserData": "No",
                    "channel": "01309282781705830427",
                    "branchingLogic": {},
                    "language": [
                        "English"
                    ],
                    "mimeType": "application/vnd.sunbird.questionset",
                    "showHints": "No",
                    "matrix": [
                        [
                            null,
                            "",
                            null
                        ],
                        [
                            null,
                            null,
                            null
                        ],
                        [
                            null,
                            null,
                            null
                        ]
                    ],
                    "createdOn": "2022-01-05T05:42:52.131+0000",
                    "objectType": "QuestionSet",
                    "primaryCategory": "Observation With Rubrics",
                    "contentDisposition": "inline",
                    "lastUpdatedOn": "2022-10-13T08:26:03.971+0000",
                    "contentEncoding": "gzip",
                    "showSolutions": "No",
                    "allowAnonymousAccess": "Yes",
                    "identifier": "do_1134460323604971521236",
                    "lastStatusChangedOn": "2022-01-05T05:42:52.131+0000",
                    "requiresSubmit": "No",
                    "visibility": "Parent",
                    "showTimer": "No",
                   
                    "index": 2,
                    "setType": "materialised",
                    "languageCode": [
                        "en"
                    ],
                    "version": 1,
                    "versionKey": "1641361372131",
                    "showFeedback": "No",
                    "license": "CC BY 4.0",
                    "depth": 2,
                    "minPossibleScore": "15",
                    "compatibilityLevel": 5,
                    "name": "Biology",
                    "navigationMode": "non-linear",
                    "allowBranching": "Yes",
                    "maxPossibleScore": "34",
                    "shuffle": true,
                    "attributions": [],
                    "status": "Draft"
                },
                "folder": true,
                "children": [
                    {
                        "id": "do_11357919243396710414900",
                        "title": "question 1",
                        "tooltip": "question 1",
                        "primaryCategory": "Text",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323604971521236",
                            "code": "dafce1db-23cc-01e5-73eb-b55928030481",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-07-12T08:57:43.912+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Text",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-11T08:23:51.049+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11357919243396710414900",
                            "lastStatusChangedOn": "2022-07-12T08:57:43.912+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 1,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665476631058",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "text"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "question 1",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_11357919785679257614902",
                        "title": "mcq ss",
                        "tooltip": "mcq ss",
                        "primaryCategory": "Multiselect Multiple Choice Question",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323604971521236",
                            "code": "f1657fe2-67f9-1931-4729-466751eab866",
                            "evidence": {
                                "required": "No",
                                "mimeType": [
                                    "image"
                                ],
                                "minCount": 1,
                                "maxCount": 1,
                                "sizeLimit": "20480"
                            },
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "templateId": "mcq-vertical",
                            "createdOn": "2022-07-12T09:08:45.878+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Multiselect Multiple Choice Question",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-07-18T12:32:50.978+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_11357919785679257614902",
                            "lastStatusChangedOn": "2022-07-12T09:08:45.878+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 2,
                            "qType": "MCQ",
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1658147570984",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "choice"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "mcq ss",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "Yes"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "",
                        "icon": "fa fa-file-o"
                    }
                ],
                "root": false,
                "extraClasses": "",
                "icon": "fa fa-folder-o"
            },
            {
                "id": "do_1134460323603578881212",
                "title": "General Science",
                "tooltip": "General Science",
                "primaryCategory": "Observation With Rubrics",
                "objectType": "QuestionSet",
                "metadata": {
                    "parent": "do_1134460323603906561218",
                    "code": "9916f5fc-4f37-3f8e-5151-b32ce65217da",
                    "allowScoring": "Yes",
                    "allowSkip": "Yes",
                    "containsUserData": "No",
                    "channel": "01309282781705830427",
                    "branchingLogic": {
                        "do_113583348668153856123": {
                            "target": [
                                "do_1135998448873226241592"
                            ],
                            "preCondition": {},
                            "source": []
                        },
                        "do_1135998448873226241592": {
                            "target": [],
                            "source": [
                                "do_113583348668153856123"
                            ],
                            "preCondition": {
                                "and": [
                                    {
                                        "eq": [
                                            {
                                                "var": "do_113583348668153856123.response1.value",
                                                "type": "responseDeclaration"
                                            },
                                            [
                                                0
                                            ]
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    "language": [
                        "English"
                    ],
                    "mimeType": "application/vnd.sunbird.questionset",
                    "showHints": "No",
                    "matrix": [
                        [
                            null,
                            "",
                            null
                        ],
                        [
                            null,
                            null,
                            null
                        ],
                        [
                            null,
                            null,
                            null
                        ]
                    ],
                    "createdOn": "2022-01-05T05:42:52.114+0000",
                    "objectType": "QuestionSet",
                    "primaryCategory": "Observation With Rubrics",
                    "contentDisposition": "inline",
                    "lastUpdatedOn": "2022-10-12T12:09:54.073+0000",
                    "contentEncoding": "gzip",
                    "showSolutions": "No",
                    "allowAnonymousAccess": "Yes",
                    "identifier": "do_1134460323603578881212",
                    "lastStatusChangedOn": "2022-01-05T05:42:52.114+0000",
                    "requiresSubmit": "No",
                    "visibility": "Parent",
                    "showTimer": "No",
                    "index": 3,
                    "setType": "materialised",
                    "languageCode": [
                        "en"
                    ],
                    "version": 1,
                    "versionKey": "1641361372114",
                    "showFeedback": "No",
                    "license": "CC BY 4.0",
                    "depth": 2,
                    "compatibilityLevel": 5,
                    "name": "General Science",
                    "navigationMode": "non-linear",
                    "allowBranching": "Yes",
                    "shuffle": true,
                    "attributions": [],
                    "status": "Draft"
                },
                "folder": true,
                "children": [
                    {
                        "id": "do_113583348668153856123",
                        "title": "test mcq",
                        "tooltip": "test mcq",
                        "primaryCategory": "Multiselect Multiple Choice Question",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323603578881212",
                            "code": "ca3c9960-0d46-0469-8232-bea8dd1e430d",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "mimeType": "application/vnd.sunbird.question",
                            "templateId": "mcq-vertical",
                            "createdOn": "2022-07-18T05:53:36.718+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Multiselect Multiple Choice Question",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-10-11T08:26:37.482+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_113583348668153856123",
                            "lastStatusChangedOn": "2022-07-18T05:53:36.718+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 1,
                            "qType": "MCQ",
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1665476797489",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "choice"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "test mcq",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "parent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_1135998448873226241592",
                        "title": "child text",
                        "tooltip": "child text",
                        "primaryCategory": "Text",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323603578881212",
                            "code": "7266be54-df91-5fbd-dfb1-6f594273d914",
                            "subject": [
                                "English"
                            ],
                            "showRemarks": "No",
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "isCollaborationEnabled": false,
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-08-10T13:15:15.347+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Text",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-08-10T13:15:15.347+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_1135998448873226241592",
                            "lastStatusChangedOn": "2022-08-10T13:15:15.347+0000",
                            "creator": "Vaibahv Bhuva",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 2,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1660137315379",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "text"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "child text",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft",
                            "showEvidence": "No"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "dependent",
                        "icon": "fa fa-file-o"
                    },
                    {
                        "id": "do_1135990324344504321511",
                        "title": "Date Question",
                        "tooltip": "Date Question",
                        "primaryCategory": "Date",
                        "objectType": "Question",
                        "metadata": {
                            "parent": "do_1134460323603578881212",
                            "code": "8604e609-4a27-61c7-adc1-cd5d506eb96d",
                            "subject": [
                                "English"
                            ],
                            "channel": "01309282781705830427",
                            "language": [
                                "English"
                            ],
                            "medium": [
                                "English"
                            ],
                            "isCollaborationEnabled": false,
                            "mimeType": "application/vnd.sunbird.question",
                            "createdOn": "2022-08-09T09:42:18.971+0000",
                            "objectType": "Question",
                            "gradeLevel": [
                                "Grade 1"
                            ],
                            "primaryCategory": "Date",
                            "contentDisposition": "inline",
                            "lastUpdatedOn": "2022-08-09T09:42:18.971+0000",
                            "contentEncoding": "gzip",
                            "showSolutions": "No",
                            "allowAnonymousAccess": "Yes",
                            "identifier": "do_1135990324344504321511",
                            "lastStatusChangedOn": "2022-08-09T09:42:18.971+0000",
                            "visibility": "Parent",
                            "showTimer": "No",
                            "author": "check1@yopmail.com",
                            "index": 3,
                            "languageCode": [
                                "en"
                            ],
                            "version": 1,
                            "versionKey": "1660038139036",
                            "showFeedback": "No",
                            "license": "CC BY 4.0",
                            "interactionTypes": [
                                "date"
                            ],
                            "framework": "tpd",
                            "depth": 3,
                            "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                            "compatibilityLevel": 4,
                            "name": "Date Question",
                            "topic": [
                                "Forest"
                            ],
                            "board": "CBSE",
                            "status": "Draft"
                        },
                        "folder": false,
                        "children": [],
                        "root": false,
                        "extraClasses": "",
                        "icon": "fa fa-file-o"
                    }
                ],
                "root": false,
                "extraClasses": "",
                "icon": "fa fa-folder-o"
            }
        ],
        "root": false,
        "extraClasses": "",
        "icon": "fa fa-folder-o"
    }
]

export const mockQuestionData = [
    {
        "question": "<p>cc ii</p>",
        "identifier": "do_11357626234228736013446",
        "page_no": null
    },
    {
        "question": "<p>dd io tt &nbsp;at ??</p>",
        "identifier": "do_11357638131503104013481",
        "page_no": null
    }
];

export const mockRenderingSequence = {
  name: "Ecm",
  sequence: [
    {
      value: "do_1134460323602841601200",
      name: "Chemistry",
      pages: [
        [
            "do_11357626234228736013446"
        ],
        [
            "do_11357638131503104013481"
        ]
    ],
      index: 0,
    },
    {
      value: "do_1134460323604971521236",
      name: "Biology",
      pages: [],
      index: 1,
    },
  ],
};

export const mockCreateArray = [
    [],
    [
        "do_11357638131503104013481"
    ]
];

export const mockPageNumberArray= [
    [
        "do_11357626234228736013446"
    ]
]