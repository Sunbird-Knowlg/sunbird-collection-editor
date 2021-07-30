export const mockData = {
    requestforchangeschecklist: {
        "title": "Please tick the reasons for requesting changes and provide detailed comments:",
        "contents": [
            {
                "name": "Appropriateness",
                'renderingHints': {
                    'class': 'd-grid-inline-3 show-section-name'
                },
                "fields": [
                    {
                        "code": "appropriatenessOne",
                        "name": "Has Hate speech, Abuse, Violence, Profanity",
                        "label": "Has Hate speech, Abuse, Violence, Profanity",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "appropriatenessTwo",
                        "name": "Has Sexual content, Nudity or Vulgarity",
                        "label": "Has Sexual content, Nudity or Vulgarity",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "appropriatenessThree",
                        "name": "Has Discriminatory or Defamatory content",
                        "label": "Has Discriminatory or Defamatory content",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "appropriatenessFour",
                        "name": "Is not suitable for children",
                        "label": "Is not suitable for children",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    }
                ]
            },
            {
                "name": "Content details",
                'renderingHints': {
                    'class': 'd-grid-inline-3 show-section-name'
                },
                "fields": [
                    {
                        "code": "contentdetailsOne",
                        "name": "Inappropriate Title or Description",
                        "label": "Inappropriate Title or Description",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "contentdetailsTwo",
                        "name": "Incorrect Board, Grade, Subject or Medium",
                        "label": "Incorrect Board, Grade, Subject or Medium",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "contentdetailsThree",
                        "name": "Inappropriate tags such as Resource Type or Concepts",
                        "label": "Inappropriate tags such as Resource Type or Concepts",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "contentdetailsFour",
                        "name": "Irrelevant Keywords",
                        "label": "Irrelevant Keywords",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    }
                ]
            },
            {
                "name": "Usability",
                'renderingHints': {
                    'class': 'd-grid-inline-3 show-section-name'
                },
                "fields": [
                    {
                        "code": "usabilityOne",
                        "name": "Content is NOT playing correctly",
                        "label": "Content is NOT playing correctly",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "usabilityTwo",
                        "name": "CANNOT see the content clearly on Desktop and App",
                        "label": "CANNOT see the content clearly on Desktop and App",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "usabilityThree",
                        "name": "Audio is NOT clear or NOT easy to understand",
                        "label": "Audio is NOT clear or NOT easy to understand",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "usabilityFour",
                        "name": "Spelling mistakes found in text used",
                        "label": "Spelling mistakes found in text used",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        "code": "usabilityFive",
                        "name": "Language is NOT simple to understand",
                        "label": "Language is NOT simple to understand",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "visible": true,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    }
                ]
            },
            {
                "name": "other Reason",
                'renderingHints': {
                    'class': 'd-grid hide-section-name'
                },
                "fields": [
                    {
                        "code": "otherReason",
                        "name": "Other Issue(s) (if there are any other issues, tick this and provide details in the comments box)",
                        "label": "Other Issue(s) (if there are any other issues, tick this and provide details in the comments box)",
                        "dataType": "boolean",
                        "inputType": "checkbox",
                        "editable": true,
                        "required": false,
                        "validations": [
                            {
                                "type": "required",
                                "message": ""
                            }
                        ],
                        "renderingHints": {
                            "class": "sb-g-col-lg-1"
                        }
                    },
                    {
                        'code': 'rejectComment',
                        'dataType': 'text',
                        'description': 'comments',
                        'editable': true,
                        'inputType': 'textarea',
                        'label': 'Comments',
                        'name': 'Comments',
                        'placeholder': '',
                        'renderingHints': {
                            'class': 'sb-g-col-lg-1'
                        },
                        'required': false,
                        'visible': true,
                        'validations': [
                            {
                                "type": "required",
                                "message": ""
                            },
                            {
                                'type': 'maxLength',
                                'value': '256',
                                'message': 'Input is Exceeded'
                            }
                        ],
                    }
                ],
            }
        ]
    },
    checkedData: {
        appropriatenessFour: true,
        appropriatenessOne: true,
        appropriatenessThree: true,
        appropriatenessTwo: true,
        contentdetailsFour: true,
        contentdetailsOne: true,
        contentdetailsThree: true,
        contentdetailsTwo: true,
        usabilityFive: true,
        usabilityFour: true,
        usabilityOne: true,
        usabilityThree: true,
        usabilityTwo: true,
        rejectComment: '',
        otherReason: true

    },
    rejectReasons: ['Has Hate speech, Abuse, Violence, Profanity',
        'Has Sexual content, Nudity or Vulgarity',
        'Has Discriminatory or Defamatory content',
        'Is not suitable for children', 'Inappropriate Title or Description',
        'Incorrect Board, Grade, Subject or Medium',
        'Inappropriate tags such as Resource Type or Concepts',
        'Irrelevant Keywords', 'Content is NOT playing correctly',
        'CANNOT see the content clearly on Desktop and App',
        'Audio is NOT clear or NOT easy to understand',
        'Spelling mistakes found in text used',
        'Language is NOT simple to understand']
}