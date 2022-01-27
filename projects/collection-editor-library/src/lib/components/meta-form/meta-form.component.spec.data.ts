export const mockData = {
    rootFormConfig: [{
        name: 'First Section',
        fields: [{
            "code": "appIcon",
            "dataType": "text",
            "description": "appIcon of the content",
            "editable": true,
            "inputType": "appIcon",
            "label": "Icon",
            "name": "Icon",
            "placeholder": "Icon",
            "renderingHints": {
                "class": "sb-g-col-lg-1 required"
            },
            "required": true,
            "visible": true
        },
        {
            "code": "name",
            "dataType": "text",
            "description": "Name of the content",
            "editable": true,
            "inputType": "text",
            "label": "Title",
            "name": "Name",
            "placeholder": "Title",
            "renderingHints": {
                "class": "sb-g-col-lg-1 required"
            },
            "required": true,
            "visible": true,
            "validations": [
                {
                    "type": "max",
                    "value": "120",
                    "message": "Input is Exceeded"
                },
                {
                    "type": "required",
                    "message": "Title is required"
                }
            ]
        },
        {
            "code": "description",
            "dataType": "text",
            "description": "Description of the content",
            "editable": true,
            "inputType": "textarea",
            "label": "Description",
            "name": "Description",
            "placeholder": "Description",
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "required": false,
            "visible": true,
            "validations": [
                {
                    "type": "max",
                    "value": "256",
                    "message": "Input is Exceeded"
                }
            ]
        },
        {
            "code": "keywords",
            "visible": true,
            "editable": true,
            "dataType": "list",
            "name": "Keywords",
            "renderingHints": {
                "class": "sb-g-col-lg-1 required"
            },
            "description": "Keywords for the content",
            "inputType": "keywords",
            "label": "Keywords",
            "placeholder": "Enter Keywords",
            "required": false,
            "validations": []
        },
        {
            "code": "audience",
            "dataType": "list",
            "description": "Suggested User Type",
            "editable": true,
            "inputType": "nestedselect",
            "label": "Suggested User Type",
            "name": "userTypes",
            "placeholder": "Suggested User Type",
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "required": false,
            "visible": true,
            "range": [
                "Education Official",
                "School leaders (HMs)",
                "Teachers",
                "Students",
                "Parents",
                "Parent",
                "Others"
            ]
        },
        {
            "code": "description",
            "name": "Description",
            "label": "Description",
            "placeholder": "Enter Description",
            "description": "Description of the Question Set",
            "dataType": "text",
            "inputType": "textarea",
            "editable": true,
            "required": false,
            "visible": true,
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            }
        },
        {
            "code": "startDate",
            "name": "startDate",
            "label": "Start Date",
            "placeholder": "Start Date",
            "description": "Choose Start Date",
            "dataType": "date",
            "inputType": "date",
            "editable": true,
            "required": false,
            "visible": true,
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "validations": [
                {
                    "type": "dateFormat",
                    "value": "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]",
                    "message": "Date format not matched"
                }
            ]
        },
        {
            'code': 'author',
            'dataType': 'text',
            'description': 'Author of the content',
            'editable': true,
            'inputType': 'text',
            'label': 'Author',
            'name': 'Author',
            'placeholder': 'Author',
            'renderingHints': {
                'class': 'sb-g-col-lg-1'
            },
            'required': false,
            'visible': true
        },
        {
            'code': 'license',
            'dataType': 'text',
            'description': 'license',
            'editable': true,
            'inputType': 'select',
            'label': 'License',
            'name': 'license',
            'placeholder': 'Select License',
            'renderingHints': {
                'class': 'sb-g-col-lg-1 required'
            },
            'required': true,
            'visible': true,
            'defaultValue': 'CC BY 4.0',
            'validations': [
                {
                    'type': 'required',
                    'message': 'License is required'
                }
            ],
            'default': 'CC BY 4.0',
            'range': [
                '@+kp_ft_license_102876130',
                '@+kp_ft_license_132244417',
                '@+kp_ft_license_164164056',
            ]
        },
        {
            "code": "setPeriod",
            "name": "setPeriod",
            "label": "Set Period",
            "placeholder": "Set period",
            "description": "Set Period",
            "dataType": "text",
            "inputType": "checkbox",
            "editable": true,
            "required": false,
            "visible": true,
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            }
        },
        {
            "code": "endDate",
            "name": "endDate",
            "depends": [
                "setPeriod"
            ],
            "label": "End Date",
            "placeholder": "End Date",
            "description": "Choose End Date",
            "dataType": "date",
            "inputType": "date",
            "editable": true,
            "required": false,
            "visible": true,
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            },
            "validations": [
                {
                    "type": "dateFormat",
                    "value": "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]",
                    "message": "Date format not matched"
                }
            ]
        },
        {
            "code": "entityType",
            "dataType": "text",
            "description": "Select the entity i.e. district, block, cluster, schools for which the form is designed and is to be taken up. The users will be able to conduct observations for only the selected type of entities.",
            "editable": true,
            "inputType": "select",
            "label": "Entity Type",
            "name": "entityType",
            "placeholder": "Entity Type",
            "renderingHints": {
                "class": "sb-g-col-lg-1 required"
            },
            "required": true,
            "visible": true,
            "range": [
                "School",
                "Block",
                "Cluster",
                "District"
            ],
            "validations": [
                {
                    "type": "required",
                    "message": "Name is required"
                }
            ]
        },
        {
            "code": "allowScoring",
            "name": "allowScoring",
            "label": "Enable Scoring",
            "placeholder": "Enable Scoring",
            "description": "Select to enable the option of scoring for questions in the form. Score can be added to questions only if this is selected",
            "dataType": "text",
            "inputType": "checkbox",
            "editable": true,
            "required": false,
            "visible": true,
            "renderingHints": {
                "class": "sb-g-col-lg-1"
            }
        },
        {
            "code": "license",
        },
        /*
        {
            "code": "additionalCategories",
        },
        {
            "code": "copyright",
        },
        {
            "code": "maxQuestions",
        },
        */
        {
            "code": "author",
        },
        {
            "code": "showTimer",
        }
        ]
    }
    ],
    nodeMetaData: {
        data: {
            metadata: {
                "copyright": "NIT123",
                "keywords": [
                    "test"
                ],
                "subject": [
                    "Science"
                ],
                "channel": "01309282781705830427",
                "language": [
                    "English"
                ],
                "mimeType": "application/vnd.sunbird.questionset",
                "showHints": "No",
                "objectType": "QuestionSet",
                "gradeLevel": [
                    "Class 7"
                ],
                "primaryCategory": "Practice Question Set",
                "contentEncoding": "gzip",
                "showSolutions": "No",
                "identifier": "do_113263678834016256111",
                "audience": [
                    "Student"
                ],
                "visibility": "Default",
                "showTimer": "Yes",
                "author": "Test",
                "maxQuestions": 6,
                "consumerId": "273f3b18-5dda-4a27-984a-060c7cd398d3",
                "childNodes": [
                    "do_113264103767826432118",
                    "do_11326368076523929611",
                    "do_113267818753368064182",
                    "do_113264100861919232115",
                    "do_113264105505570816124",
                    "do_113264164671733760129",
                    "do_113264162822283264127"
                ],
                "languageCode": [
                    "en"
                ],
                "version": 1,
                "license": "CC BY 4.0",
                "maxAttempts": 15,
                "name": "NCERT Solutions new",
                "attributions": "",
                "status": "Draft",
                "code": "56b1b945-f2c2-2855-1974-403ad240ba23",
                "allowSkip": "Yes",
                "containsUserData": "No",
                "description": "Hello",
                "medium": [
                    "Hindi"
                ],
                "createdOn": "2021-04-22T14:23:40.169+0000",
                "contentDisposition": "inline",
                "additionalCategories": [
                    "Classroom Teaching Video"
                ],
                "lastUpdatedOn": "2021-04-29T09:53:07.449+0000",
                "allowAnonymousAccess": "Yes",
                "lastStatusChangedOn": "2021-04-22T14:23:40.169+0000",
                "createdFor": [
                    "01309282781705830427"
                ],
                "requiresSubmit": "Yes",
                "setType": "materialised",
                "versionKey": "1619689987449",
                "showFeedback": "No",
                "framework": "ekstep_ncert_k-12",
                "depth": 0,
                "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
                "compatibilityLevel": 5,
                "navigationMode": "non-linear",
                "timeLimits": {
                    "maxTime": "300",
                    "warningTime": "240"
                },
                "shuffle": true,
                "board": "CBSE",
                "instructions": {
                    "default": "<p>Chapter 1:&nbsp;<i><strong>माता का अँचल</strong></i></p><p>Chapter 2:&nbsp;<i><strong>जॉर्ज पंचम की नाक</strong></i></p><p>Chapter 3:&nbsp;<i><strong>साना – साना हाथ जोड़ि</strong></i></p><p>Chapter 4:&nbsp;<i><strong>एही ठैयाँ झुलनी हेरानी हो रामा!</strong></i></p><p>Chapter 5:&nbsp;<i><strong>मैं क्यों लिखता हूँ?</strong></i></p><p>Chapter 6:<i><strong>&nbsp;लेखक परिचय</strong></i></p><p>Chapter 7:<i><strong>&nbsp;लेखक परिचय</strong></i></p>"
                },
                "level": 1
            }
        },
        root: true
    },
    frameWorkDetails: {
        frameworkData: [
            {
                "identifier": "ekstep_ncert_k-12_board",
                "code": "board",
                "terms": [
                    {
                        "associations": [
                            {
                                "identifier": "ekstep_ncert_k-12_learningoutcome_9686a2a712bdfdb43408555865cda57f2367699a",
                                "code": "9686a2a712bdfdb43408555865cda57f2367699a",
                                "translations": null,
                                "name": "Inequalities in a triangle.",
                                "description": "Inequalities in a triangle.",
                                "index": 0,
                                "category": "learningoutcome",
                                "status": "Live"
                            },
                            {
                                "identifier": "ekstep_ncert_k-12_topic_08859db5d07d93b99c12b3e5bceb975c582d31b7",
                                "code": "08859db5d07d93b99c12b3e5bceb975c582d31b7",
                                "translations": null,
                                "name": "Nature around the kids",
                                "description": "Nature around the kids",
                                "index": 0,
                                "category": "topic",
                                "status": "Live"
                            }],
                        "identifier": "ekstep_ncert_k-12_board_cbse",
                        "code": "cbse",
                        "translations": null,
                        "name": "CBSE",
                        "description": "CBSE",
                        "index": 10,
                        "category": "board",
                        "status": "Live"
                    }
                ],
                "translations": null,
                "name": "Board",
                "description": "Board",
                "index": 1,
                "status": "Live"
            }
        ],
        targetFrameworks: ['ekstep_ncert_k-12_board'],
        topicList: [
            {
                "identifier": "ekstep_ncert_k-12_topic_08859db5d07d93b99c12b3e5bceb975c582d31b7",
                "code": "08859db5d07d93b99c12b3e5bceb975c582d31b7",
                "translations": null,
                "name": "Nature around the kids",
                "description": "Nature around the kids",
                "index": 10,
                "category": "topic",
                "status": "Live"
            }
        ]
    }
};