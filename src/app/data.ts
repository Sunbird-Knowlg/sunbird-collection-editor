export const courseEditorConfig = {
  context: {
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    identifier: 'do_1133618765350748161337',
    channel: '01309282781705830427',
    // framework: 'nit_k-12',
    // targetFWIds: ['nit_k-12'],
    authToken: ' ',
    sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
    did: '7e85b4967aebd6704ba1f604f20056b6',
    uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
    additionalCategories: [
      {
        value: 'Textbook',
        label: 'Textbook'
      },
      {
        value: 'Lesson Plan',
        label: 'Lesson Plan'
      }
    ],
    pdata: {
      id: 'dev.dock.portal',
      ver: '2.8.0',
      pid: 'creation-portal'
    },
    contextRollup: {
      l1: '01307938306521497658',
    },
    tags: ['01307938306521497658'],
    cdata: [
      {
        id: '01307938306521497658',
        type: 'sourcing_organization',
      },
      {
        type: 'project',
        id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
      },
      {
        type: 'linked_collection',
        id: 'do_113140468925825024117'
      }
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'do_113140468925825024117',
      l2: 'do_113140468926914560125'
    },
    host: '',
    defaultLicense: 'CC BY 4.0',
    endpoint: '/data/v3/telemetry',
    env: 'collection_editor',
    cloudStorageUrls: [
      'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/',
      'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
      'https://dockstorage.blob.core.windows.net/sunbird-content-dock/']
  },
  config: {
    mode: 'edit', // edit / review / read / sourcingReview
    maxDepth: 4,
    objectType: 'Collection',
    primaryCategory: 'Course', // Professional Development Course, Curriculum Course
    isRoot: true,
    dialcodeMinLength: 2,
    dialcodeMaxLength: 250,
    iconClass: 'fa fa-book',
    showAddCollaborator: true,
    enableBulkUpload: false,
    children: {},
    hierarchy: {
      level1: {
        name: 'Module',
        type: 'Unit',
        mimeType: 'application/vnd.ekstep.content-collection',
        contentType: 'CourseUnit',
        primaryCategory: 'Course Unit',
        iconClass: 'fa fa-folder-o',
        children: {}
      },
      level2: {
        name: 'Sub-Module',
        type: 'Unit',
        mimeType: 'application/vnd.ekstep.content-collection',
        contentType: 'CourseUnit',
        primaryCategory: 'Course Unit',
        iconClass: 'fa fa-folder-o',
        children: {
          Content: [
            'Explanation Content',
            'Learning Resource',
            'eTextbook',
            'Teacher Resource',
            'Course Assessment'
          ]
        }
      },
      level3: {
        name: 'Sub-Sub-Module',
        type: 'Unit',
        mimeType: 'application/vnd.ekstep.content-collection',
        contentType: 'CourseUnit',
        primaryCategory: 'Course Unit',
        iconClass: 'fa fa-folder-o',
        children: {
          Content: [
            'Explanation Content',
            'Learning Resource',
            'eTextbook',
            'Teacher Resource',
            'Course Assessment'
          ]
        }
      },
      level4: {
        name: 'Sub-Sub-Module',
        type: 'Unit',
        mimeType: 'application/vnd.ekstep.content-collection',
        contentType: 'CourseUnit',
        primaryCategory: 'Course Unit',
        iconClass: 'fa fa-folder-o',
        children: {
          Content: [
            'Explanation Content',
            'Learning Resource',
            'eTextbook',
            'Teacher Resource',
            'Course Assessment'
          ]
        }
      }
    },
    contentPolicyUrl: '/term-of-use.html'
  }
};

export const questionSetEditorConfig = {
  context: {
    programId: 'f72ad8b0-36df-11ec-a56f-4b503455085f',
    contributionOrgId: '',
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    identifier: 'do_113476420248436736138', // do_11330102570702438417 , do_113449692707643392118, //do_113449692707643392118 , do_113460158539554816151
    authToken: ' ',
    sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
    did: '7e85b4967aebd6704ba1f604f20056b6',
    uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
    channel: '01309282781705830427',
    pdata: {
      id: 'dev.dock.portal',
      ver: '2.8.0',
      pid: 'creation-portal'
    },
    contextRollup: {
      l1: '01307938306521497658',
    },
    tags: ['01307938306521497658'],
    cdata: [
      {
        id: '01307938306521497658',
        type: 'sourcing_organization',
      },
      {
        type: 'project',
        id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
      },
      {
        type: 'linked_collection',
        id: 'do_113140468925825024117'
      }
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'do_113140468925825024117',
      l2: 'do_113140468926914560125'
    },
    host: 'https://dev.sunbirded.org',
    defaultLicense: 'CC BY 4.0',
    endpoint: '/data/v3/telemetry',
    env: 'questionset_editor',
    framework: 'ekstep_ncert_k-12',
    cloudStorageUrls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/', 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
                      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/'],
    board: 'CBSE',
    medium: ['English'],
    gradeLevel: ['Class 1'],
    subject: ['Environmental Studies'],
    topic: ['Forest'],
    additionalCategories: [
      {
        value: 'Classroom Teaching Video',
        label: 'Classroom Teaching Video'
      },
      {
        value: 'Concept Map',
        label: 'Concept Map'
      },
      {
        value: 'Curiosity Question Set',
        label: 'Curiosity Question Set'
      },
      {
        value: 'Textbook',
        label: 'Textbook'
      },
      {
        value: 'Experiential Resource',
        label: 'Experiential Resource'
      },
      {
        value: 'Explanation Video',
        label: 'Explanation Video'
      },
      {
        value: 'Focus Spot',
        label: 'Focus Spot'
      },
      {
        value: 'Learning Outcome Definition',
        label: 'Learning Outcome Definition'
      },
      {
        value: 'Marking Scheme Rubric',
        label: 'Marking Scheme Rubric'
      },
      {
        value: 'Pedagogy Flow',
        label: 'Pedagogy Flow'
      },
      {
        value: 'Lesson Plan',
        label: 'Lesson Plan'
      },
      {
        value: 'Previous Board Exam Papers',
        label: 'Previous Board Exam Papers'
      },
      {
        value: 'TV Lesson',
        label: 'TV Lesson'
      }
    ],
    labels: {
      save_collection_btn_label: 'Save as Draft',
    },
    correctionComments: false,
    sourcingResourceStatus: true,
  },
  config: {
    mode: 'orgReview', // edit / review / read / sourcingReview // orgReview
    enableQuestionCreation: true,
    enableAddFromLibrary: true,
    editableFields: {
      sourcingreview: ['instructions'],
      orgreview: ['name', 'instructions', 'learningOutcome'],
      review: ['name', 'description'],
    },
    maxDepth: 4,
    objectType: 'QuestionSet',
    primaryCategory: 'Practice Question Set',
    isRoot: true,
    iconClass: 'fa fa-book',
    showAddCollaborator: false,
    enableBulkUpload: true,
    publicStorageAccount: 'https://dockstorage.blob.core.windows.net/',
    hideSubmitForReviewBtn: false,
    children: {
      Question: [
        'Multiple Choice Question',
        'Subjective Question'
      ]
    },
    addFromLibrary: false,
    hierarchy: {
      level1: {
        name: 'Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        iconClass: 'fa fa-folder-o',
        children: {},
        addFromLibrary: true
      },
      level2: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Subjective Question'
          ]
        },
        addFromLibrary: true
      },
      level3: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Subjective Question'
          ]
        }
      }
    },
    contentPolicyUrl: '/term-of-use.html'
  }
};

export const questionEditorConfig = {
  context: {
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    identifier: 'do_113395509928394752193', // do_113388220110217216123
    collectionIdentifier: 'do_1133872840783626241899',
    collectionPrimaryCategory: 'Exam Question Set',
    collectionObjectType: 'QuestionSet',
    sourcingResourceStatus: 'Review Pending',
    sourcingResourceStatusClass: 'sb-color-warning',
    authToken: ' ',
    sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
    did: '7e85b4967aebd6704ba1f604f20056b6',
    uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
    channel: '01309282781705830427',
    pdata: {
      id: 'dev.dock.portal',
      ver: '2.8.0',
      pid: 'creation-portal'
    },
    contextRollup: {
      l1: '01307938306521497658',
    },
    tags: ['01307938306521497658'],
    cdata: [
      {
        id: '01307938306521497658',
        type: 'sourcing_organization',
      },
      {
        type: 'project',
        id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
      },
      {
        type: 'linked_collection',
        id: 'do_113140468925825024117'
      }
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'do_113140468925825024117',
      l2: 'do_113140468926914560125'
    },
    host: 'https://dev.sunbirded.org',
    defaultLicense: 'CC BY 4.0',
    endpoint: '/data/v3/telemetry',
    env: 'questionset_editor',
    framework: 'ekstep_ncert_k-12',
    cloudStorageUrls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/', 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
                      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/'],
    board: 'CBSE',
    medium: ['English'],
    gradeLevel: ['Class 1'],
    subject: ['Environmental Studies'],
    topic: ['Forest'],
    additionalCategories: [
      {
        value: 'Classroom Teaching Video',
        label: 'Classroom Teaching Video'
      },
      {
        value: 'Concept Map',
        label: 'Concept Map'
      },
      {
        value: 'Curiosity Question Set',
        label: 'Curiosity Question Set'
      },
      {
        value: 'Textbook',
        label: 'Textbook'
      },
      {
        value: 'Experiential Resource',
        label: 'Experiential Resource'
      },
      {
        value: 'Explanation Video',
        label: 'Explanation Video'
      },
      {
        value: 'Focus Spot',
        label: 'Focus Spot'
      },
      {
        value: 'Learning Outcome Definition',
        label: 'Learning Outcome Definition'
      },
      {
        value: 'Marking Scheme Rubric',
        label: 'Marking Scheme Rubric'
      },
      {
        value: 'Pedagogy Flow',
        label: 'Pedagogy Flow'
      },
      {
        value: 'Lesson Plan',
        label: 'Lesson Plan'
      },
      {
        value: 'Previous Board Exam Papers',
        label: 'Previous Board Exam Papers'
      },
      {
        value: 'TV Lesson',
        label: 'TV Lesson'
      }
    ],
    labels: {
      save_collection_btn_label: 'Save as Draft',
      reject_collection_btn_label: 'Request Changes',
    }
  },
  config: {
    mode: 'sourcingReview', // edit / review / read / sourcingReview // orgReview
    objectType: 'Question',
    primaryCategory: 'Multiple Choice Question',
    mimeType: 'application/vnd.sunbird.question',
    interactionType: 'choice',
    showSourcingStatus: true,
    showCorrectionComments: false,
    isReadOnlyMode: true,
    editableFields: {
      //sourcingreview: ['instructions'],
      orgReview: ['name', 'learningOutcome'],
      review: ['name', 'learningOutcome'],
    }
  }
};

export const collectionEditorConfig = {
  context: {
      identifier: 'do_113367576496021504151',
      channel: '01309282781705830427',
      authToken: '',
      sid: 'vLpZ1rFl6-sxMVHi4RrmrlHw0HsX9ggC',
      did: '1d8e290dd3c2a6a9eeac58568cdef28d',
      uid: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      additionalCategories: {},
      host: 'http://localhost:3000',
      pdata: {
          id: 'local.sunbird.portal',
          ver: '4.1.0',
          pid: 'sunbird-portal'
      },
      actor: {
          id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
          type: 'User'
      },
      contextRollup: {
          l1: '01309282781705830427'
      },
      tags: [
          '01309282781705830427',
          '01309282781705830427'
      ],
      timeDiff: -0.463,
      endpoint: '/data/v3/telemetry',
      env: 'collection_editor',
      user: {
          id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
          orgIds: [
              '01309282781705830427'
          ],
          organisations: {},
          fullName: 'N11',
          firstName: 'N11',
          lastName: '',
          isRootOrgAdmin: true
      },
      channelData: {},
      framework: 'ekstep_ncert_k-12',
      cloudStorage: {
        presigned_headers: {
          'x-ms-blob-type': 'BlockBlob' // This header is specific to azure storage provider.
          /* TODO: if more configurations comes for cloud service provider
             than we have do in more generic way like below:
             For example:
             cloudStorage: {
                provider: 'azure' // azure, aws, etc..
                azure: {
                  url: 'https://www.azureblogstorage.com'
                  presigned_headers: {
                    x-ms-blob-type: 'BlockBlob'
                  }
                }
             }
          */
        }
      }
  },
  config: {
      mode: 'edit',
      showAddCollaborator: true,
      enableBulkUpload: false,
      maxDepth: 4,
      objectType: 'Collection',
      primaryCategory: 'Digital Textbook',
      isRoot: true,
      iconClass: 'fa fa-book',
      children: {},
      hierarchy: {
          level1: {
              name: 'Textbook Unit',
              type: 'Unit',
              mimeType: 'application/vnd.ekstep.content-collection',
              contentType: 'TextBookUnit',
              primaryCategory: 'Textbook Unit',
              iconClass: 'fa fa-folder-o',
              children: {
                Content: [
                  'Explanation Content',
                  'Learning Resource',
                  'eTextbook',
                  'Teacher Resource',
                  'Course Assessment'
                ]
              }
          },
          level2: {
              name: 'Textbook Unit',
              type: 'Unit',
              mimeType: 'application/vnd.ekstep.content-collection',
              contentType: 'TextBookUnit',
              primaryCategory: 'Textbook Unit',
              iconClass: 'fa fa-folder-o',
              children: {
                Content: [
                  'Explanation Content',
                  'Learning Resource',
                  'eTextbook',
                  'Teacher Resource',
                  'Course Assessment'
                ]
              }
          },
          level3: {
              name: 'Textbook Unit',
              type: 'Unit',
              mimeType: 'application/vnd.ekstep.content-collection',
              contentType: 'TextBookUnit',
              primaryCategory: 'Textbook Unit',
              iconClass: 'fa fa-folder-o',
              children: {
                Content: [
                  'Explanation Content',
                  'Learning Resource',
                  'eTextbook',
                  'Teacher Resource',
                  'Course Assessment'
                ]
              }
          },
          level4: {
              name: 'Textbook Unit',
              type: 'Unit',
              mimeType: 'application/vnd.ekstep.content-collection',
              contentType: 'TextBookUnit',
              primaryCategory: 'Textbook Unit',
              iconClass: 'fa fa-folder-o',
              children: {
                Content: [
                  'Explanation Content',
                  'Learning Resource',
                  'eTextbook',
                  'Teacher Resource',
                  'Course Assessment'
                ]
              }
          }
      }
  }
};


export const observationEditorConfig = {
  context: {
    programId: 'f72ad8b0-36df-11ec-a56f-4b503455085f',
    contributionOrgId: '',
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    // identifier: 'do_113395089840529408131', // 'do_1132393548335759361558', // do_11330102570702438417
    identifier: 'do_1135439342598225921356',  // 'do_1133610108714352641210', // Observation
    // identifier: 'do_113395099906416640139', // survey
    // identifier: 'do_1134357224765685761203', // Observation With Rubrics
    authToken: ' ',
    sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
    did: '7e85b4967aebd6704ba1f604f20056b6',
    uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
    channel: '01309282781705830427',
    pdata: {
      id: 'dev.dock.portal',
      ver: '2.8.0',
      pid: 'creation-portal'
    },
    contextRollup: {
      l1: '01307938306521497658',
    },
    tags: ['01307938306521497658'],
    cdata: [
      {
        id: '01307938306521497658',
        type: 'sourcing_organization',
      },
      {
        type: 'project',
        id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
      },
      {
        type: 'linked_collection',
        id: 'do_113140468925825024117'
      }
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'do_113140468925825024117',
      l2: 'do_113140468926914560125'
    },
    host: 'https://dock.sunbirded.org',
    defaultLicense: 'CC BY 4.0',
    endpoint: '/data/v3/telemetry',
    env: 'questionset_editor',
    framework: 'ekstep_ncert_k-12',
    cloudStorageUrls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/', 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
                      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/'],
    subject: ['Environmental Studies'],
    topic: ['Forest'],
    additionalCategories: [
      {
        value: 'Classroom Teaching Video',
        label: 'Classroom Teaching Video'
      },
      {
        value: 'Concept Map',
        label: 'Concept Map'
      },
      {
        value: 'Curiosity Question Set',
        label: 'Curiosity Question Set'
      },
      {
        value: 'Textbook',
        label: 'Textbook'
      },
      {
        value: 'Experiential Resource',
        label: 'Experiential Resource'
      },
      {
        value: 'Explanation Video',
        label: 'Explanation Video'
      },
      {
        value: 'Focus Spot',
        label: 'Focus Spot'
      },
      {
        value: 'Learning Outcome Definition',
        label: 'Learning Outcome Definition'
      },
      {
        value: 'Marking Scheme Rubric',
        label: 'Marking Scheme Rubric'
      },
      {
        value: 'Pedagogy Flow',
        label: 'Pedagogy Flow'
      },
      {
        value: 'Lesson Plan',
        label: 'Lesson Plan'
      },
      {
        value: 'Previous Board Exam Papers',
        label: 'Previous Board Exam Papers'
      },
      {
        value: 'TV Lesson',
        label: 'TV Lesson'
      }
    ],
    labels: {
      save_collection_btn_label: 'Save as Draft',
    }
  },
  config: {
    mode: 'edit', // edit / review / read / sourcingReview // orgReview
    editableFields: {
      //sourcingreview: ['instructions'],
      orgreview: ['name', 'instructions', 'learningOutcome'],
      review: ['name', 'description'],
    },
    maxDepth: 4,
    objectType: 'QuestionSet',
    // primaryCategory: 'Observation',
    primaryCategory: 'Observation',
    isRoot: true,
    iconClass: 'fa fa-book',
    showAddCollaborator: false,
    enableBulkUpload: true,
    publicStorageAccount: 'https://dockstorage.blob.core.windows.net/',
    children: {
      Question: [
        'Multiple Choice Question',
        'Slider',
        'Text',
        'Date'
      ]
    },
    hierarchy: {
      level1: {
        name: 'Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      },
      level2: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      },
      level3: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      }
    },
    contentPolicyUrl: '/term-of-use.html'
  }
};

export const surveyEditorConfig = {
  context: {
    programId: 'f72ad8b0-36df-11ec-a56f-4b503455085f',
    contributionOrgId: '',
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    // identifier: 'do_113395089840529408131', // 'do_1132393548335759361558', // do_11330102570702438417
    // identifier: 'do_11343286031200256013',  // 'do_1133610108714352641210', // Observation
    identifier: 'do_113395099906416640139', // survey
    // identifier: 'do_1134357224765685761203', // Observation With Rubrics
    authToken: ' ',
    sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
    did: '7e85b4967aebd6704ba1f604f20056b6',
    uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
    channel: '01309282781705830427',
    pdata: {
      id: 'dev.dock.portal',
      ver: '2.8.0',
      pid: 'creation-portal'
    },
    contextRollup: {
      l1: '01307938306521497658',
    },
    tags: ['01307938306521497658'],
    cdata: [
      {
        id: '01307938306521497658',
        type: 'sourcing_organization',
      },
      {
        type: 'project',
        id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
      },
      {
        type: 'linked_collection',
        id: 'do_113140468925825024117'
      }
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'do_113140468925825024117',
      l2: 'do_113140468926914560125'
    },
    host: 'https://dock.sunbirded.org',
    defaultLicense: 'CC BY 4.0',
    endpoint: '/data/v3/telemetry',
    env: 'questionset_editor',
    framework: 'ekstep_ncert_k-12',
    cloudStorageUrls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/', 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
                      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/'],
    board: 'CBSE',
    medium: ['English'],
    gradeLevel: ['Class 1'],
    subject: ['Environmental Studies'],
    topic: ['Forest'],
    additionalCategories: [
      {
        value: 'Classroom Teaching Video',
        label: 'Classroom Teaching Video'
      },
      {
        value: 'Concept Map',
        label: 'Concept Map'
      },
      {
        value: 'Curiosity Question Set',
        label: 'Curiosity Question Set'
      },
      {
        value: 'Textbook',
        label: 'Textbook'
      },
      {
        value: 'Experiential Resource',
        label: 'Experiential Resource'
      },
      {
        value: 'Explanation Video',
        label: 'Explanation Video'
      },
      {
        value: 'Focus Spot',
        label: 'Focus Spot'
      },
      {
        value: 'Learning Outcome Definition',
        label: 'Learning Outcome Definition'
      },
      {
        value: 'Marking Scheme Rubric',
        label: 'Marking Scheme Rubric'
      },
      {
        value: 'Pedagogy Flow',
        label: 'Pedagogy Flow'
      },
      {
        value: 'Lesson Plan',
        label: 'Lesson Plan'
      },
      {
        value: 'Previous Board Exam Papers',
        label: 'Previous Board Exam Papers'
      },
      {
        value: 'TV Lesson',
        label: 'TV Lesson'
      }
    ],
    labels: {
      save_collection_btn_label: 'Save as Draft',
    }
  },
  config: {
    mode: 'edit', // edit / review / read / sourcingReview // orgReview
    editableFields: {
      //sourcingreview: ['instructions'],
      orgreview: ['name', 'instructions', 'learningOutcome'],
      review: ['name', 'description'],
    },
    maxDepth: 4,
    objectType: 'QuestionSet',
    // primaryCategory: 'Observation',
    primaryCategory: 'Survey',
    isRoot: true,
    iconClass: 'fa fa-book',
    showAddCollaborator: false,
    enableBulkUpload: true,
    enablePagination: true,
    publicStorageAccount: 'https://dockstorage.blob.core.windows.net/',
    children: {
      Question: [
        'Multiple Choice Question',
        'Slider',
        'Text',
        'Date'
      ]
    },
    hierarchy: {
      level1: {
        name: 'Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      },
      level2: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      },
      level3: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      }
    },
    contentPolicyUrl: '/term-of-use.html'
  }
};

export const observationRubricsEditorConfig = {
  context: {
    programId: 'f72ad8b0-36df-11ec-a56f-4b503455085f',
    contributionOrgId: '',
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    // identifier: 'do_113395089840529408131', // 'do_1132393548335759361558', // do_11330102570702438417
    // identifier: 'do_11343286031200256013',  // 'do_1133610108714352641210', // Observation
    // identifier: 'do_113395099906416640139', // survey
    identifier: 'do_1134357224765685761203', // Observation With Rubrics Framework - tpd
    // identifier: 'do_113437470826086400127', // Observation With Rubrics Framework - nit_tpd
    authToken: ' ',
    sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
    did: '7e85b4967aebd6704ba1f604f20056b6',
    uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
    channel: '01309282781705830427',
    pdata: {
      id: 'dev.dock.portal',
      ver: '2.8.0',
      pid: 'creation-portal'
    },
    contextRollup: {
      l1: '01307938306521497658',
    },
    tags: ['01307938306521497658'],
    cdata: [
      {
        id: '01307938306521497658',
        type: 'sourcing_organization',
      },
      {
        type: 'project',
        id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
      },
      {
        type: 'linked_collection',
        id: 'do_113140468925825024117'
      }
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'do_113140468925825024117',
      l2: 'do_113140468926914560125'
    },
    host: 'https://dock.sunbirded.org',
    defaultLicense: 'CC BY 4.0',
    endpoint: '/data/v3/telemetry',
    env: 'questionset_editor',
    framework: 'tpd',
    cloudStorageUrls: ['https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/', 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
                      'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/'],
    board: 'CBSE',
    medium: ['English'],
    gradeLevel: ['Class 1'],
    subject: ['Environmental Studies'],
    topic: ['Forest'],
    additionalCategories: [
      {
        value: 'Classroom Teaching Video',
        label: 'Classroom Teaching Video'
      },
      {
        value: 'Concept Map',
        label: 'Concept Map'
      },
      {
        value: 'Curiosity Question Set',
        label: 'Curiosity Question Set'
      },
      {
        value: 'Textbook',
        label: 'Textbook'
      },
      {
        value: 'Experiential Resource',
        label: 'Experiential Resource'
      },
      {
        value: 'Explanation Video',
        label: 'Explanation Video'
      },
      {
        value: 'Focus Spot',
        label: 'Focus Spot'
      },
      {
        value: 'Learning Outcome Definition',
        label: 'Learning Outcome Definition'
      },
      {
        value: 'Marking Scheme Rubric',
        label: 'Marking Scheme Rubric'
      },
      {
        value: 'Pedagogy Flow',
        label: 'Pedagogy Flow'
      },
      {
        value: 'Lesson Plan',
        label: 'Lesson Plan'
      },
      {
        value: 'Previous Board Exam Papers',
        label: 'Previous Board Exam Papers'
      },
      {
        value: 'TV Lesson',
        label: 'TV Lesson'
      }
    ],
    labels: {
      save_collection_btn_label: 'Save as Draft',
    }
  },
  config: {
    mode: 'edit', // edit / review / read / sourcingReview // orgReview
    editableFields: {
      //sourcingreview: ['instructions'],
      orgreview: ['name', 'instructions', 'learningOutcome'],
      review: ['name', 'description'],
    },
    maxDepth: 4,
    objectType: 'QuestionSet',
    // primaryCategory: 'Observation',
    primaryCategory: 'Observation With rubrics',
    isRoot: true,
    iconClass: 'fa fa-book',
    showAddCollaborator: false,
    enableBulkUpload: true,
    enablePagination:true,
    publicStorageAccount: 'https://dockstorage.blob.core.windows.net/',
    children: {
      Question: [
        'Multiple Choice Question',
        'Slider',
        'Text',
        'Date'
      ]
    },
    hierarchy: {
      level1: {
        name: 'Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      },
      level2: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      },
      level3: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Observation',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Slider',
            'Text',
            'Date'
          ]
        }
      }
    },
    contentPolicyUrl: '/term-of-use.html'
  }
};

export const nodesData = {
  data: {
    ownershipType: [
      'createdBy'
    ],
    copyright: 'NIT123',
    se_gradeLevelIds: [
      'ekstep_ncert_k-12_gradelevel_class1'
    ],
    subject: [
      'Mathematics'
    ],
    channel: '01309282781705830427',
    downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113367576496021504151/qr-testing_1639392584490_do_113367576496021504151_1_SPINE.ecar',
    organisation: [
      'NIT'
    ],
    language: [
      'English'
    ],
    mimeType: 'application/vnd.ekstep.content-collection',
    variants: {
      spine: {
        ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113367576496021504151/qr-testing_1639392584490_do_113367576496021504151_1_SPINE.ecar',
        size: '65520'
      },
      online: {
        ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113367576496021504151/qr-testing_1639392585110_do_113367576496021504151_1_ONLINE.ecar',
        size: '13153'
      }
    },
    leafNodes: [
      'do_113061161270198272154',
      'do_11342001918241177611995',
      'do_11317444580121804812898',
      'do_11342495269322752016475',
      'do_1134128135522058241655',
      'do_11314250039970201615',
      'do_11342495905869004816476',
      'do_11341789596678553611557',
      'do_112813424626933760118'
    ],
    objectType: 'Content',
    se_mediums: [
      'English'
    ],
    gradeLevel: [
      'Class 1'
    ],
    appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11328630662528204811407/artifact/do_11328630662528204811407_1621863601830_download.jpeg',
    primaryCategory: 'Digital Textbook',
    children: [
      {
        ownershipType: [
          'createdBy'
        ],
        parent: 'do_113367576496021504151',
        code: '7d97da2c-09c2-eda7-900a-8e7a0b2496c2',
        credentials: {
          enabled: 'No'
        },
        channel: '01309282781705830427',
        downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113367576496021504151/qr-testing_1639392584490_do_113367576496021504151_1_SPINE.ecar',
        language: [
          'English'
        ],
        mimeType: 'application/vnd.ekstep.content-collection',
        variants: {
          spine: {
            ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113367576496021504151/qr-testing_1639392584490_do_113367576496021504151_1_SPINE.ecar',
            size: '65520'
          },
          online: {
            ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113367576496021504151/qr-testing_1639392585110_do_113367576496021504151_1_ONLINE.ecar',
            size: '13153'
          }
        },
        leafNodes: [
          'do_113061161270198272154',
          'do_11342001918241177611995',
          'do_11317444580121804812898',
          'do_11342495269322752016475',
          'do_1134128135522058241655',
          'do_11314250039970201615',
          'do_11342495905869004816476',
          'do_11341789596678553611557',
          'do_112813424626933760118'
        ],
        idealScreenSize: 'normal',
        createdOn: '2021-09-16T09:25:32.049+0000',
        objectType: 'Content',
        primaryCategory: 'Textbook Unit',
        children: [
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            se_gradeLevelIds: [
              'nit_k-12_gradelevel_grade-1'
            ],
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495269322752016475/artifact/sample.pdf',
            subject: [
              'English'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495269322752016475/pdf_1638788875995_do_11342495269322752016475_1.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_11342495269322752016475',
            mimeType: 'application/pdf',
            variants: {
              full: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495269322752016475/pdf_1638788875995_do_11342495269322752016475_1.ecar',
                size: '2331'
              },
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495269322752016475/pdf_1638788877303_do_11342495269322752016475_1_SPINE.ecar',
                size: '1281'
              }
            },
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Grade 1'
            ],
            primaryCategory: 'eTextbook',
            appId: 'local.sunbird.portal',
            contentEncoding: 'identity',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495269322752016475/artifact/sample.pdf',
            contentType: 'eTextBook',
            se_gradeLevels: [
              'Grade 1'
            ],
            identifier: 'do_11342495269322752016475',
            audience: [
              'Student'
            ],
            se_boardIds: [
              'nit_k-12_board_cbse'
            ],
            subjectIds: [
              'nit_k-12_subject_english'
            ],
            visibility: 'Default',
            author: 'anusha',
            discussionForum: {
              enabled: 'No'
            },
            index: 1,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
            version: 2,
            pragma: [
              'external'
            ],
            se_subjects: [
              'English'
            ],
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 3028,
            lastPublishedOn: '2021-12-06T11:07:55.983+0000',
            name: 'pdf',
            mediumIds: [
              'nit_k-12_medium_english'
            ],
            status: 'Live',
            code: '3f92e124-152d-82e9-2aeb-2e607323ceaf',
            interceptionPoints: {},
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Draft',
            origin: 'do_11342495269322752016475',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495269322752016475/artifact/sample.pdf',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2021-12-06T11:07:50.965+0000',
            se_boards: [
              'CBSE'
            ],
            se_mediumIds: [
              'nit_k-12_medium_english'
            ],
            processId: 'f87029c2-2863-4fa0-b25b-6ff93c2b9d46',
            contentDisposition: 'inline',
            lastUpdatedOn: '2021-12-06T11:07:57.841+0000',
            originData: {
              identifier: 'do_11342495269322752016475',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11342495269322752016475'
            },
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2021-12-06T11:07:57.841+0000',
            createdFor: [
              '01309282781705830427'
            ],
            creator: 'anusha',
            os: [
              'All'
            ],
            se_subjectIds: [
              'nit_k-12_subject_english'
            ],
            se_FWIds: [
              'nit_k-12'
            ],
            pkgVersion: 1,
            versionKey: '1638788873631',
            idealScreenDensity: 'hdpi',
            framework: 'nit_k-12',
            depth: 2,
            boardIds: [
              'nit_k-12_board_cbse'
            ],
            lastSubmittedOn: '2021-12-06T11:07:53.084+0000',
            createdBy: '19ba0e4e-9285-4335-8dd0-f674bf03fa4d',
            compatibilityLevel: 4,
            gradeLevelIds: [
              'nit_k-12_gradelevel_grade-1'
            ],
            board: 'CBSE',
            programId: '12e4bba0-4d08-11ec-b831-d35d7ee5b6c9',
            relationalMetadata: {
              relName: 'Test ',
              keywords: [
                'Test'
              ]
            }
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            se_gradeLevelIds: [
              'nit_k-12_gradelevel_grade-1'
            ],
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495905869004816476/artifact/file_example.webm',
            subject: [
              'English'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495905869004816476/mp4_1638789007613_do_11342495905869004816476_1.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_11342495905869004816476',
            mimeType: 'video/webm',
            variants: {
              full: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495905869004816476/mp4_1638789007613_do_11342495905869004816476_1.ecar',
                size: '895489'
              },
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495905869004816476/mp4_1638789008587_do_11342495905869004816476_1_SPINE.ecar',
                size: '1291'
              }
            },
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Grade 1'
            ],
            primaryCategory: 'Explanation Content',
            appId: 'dev.dock.portal',
            contentEncoding: 'identity',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342495905869004816476/artifact/file_example.webm',
            contentType: 'ClassroomTeachingVideo',
            se_gradeLevels: [
              'Grade 1'
            ],
            trackable: {
              enabled: 'No',
              autoBatch: 'No'
            },
            identifier: 'do_11342495905869004816476',
            audience: [
              'Student'
            ],
            se_boardIds: [
              'nit_k-12_board_cbse'
            ],
            subjectIds: [
              'nit_k-12_subject_english'
            ],
            visibility: 'Default',
            author: 'anusha',
            discussionForum: {
              enabled: 'No'
            },
            index: 2,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
            version: 2,
            se_subjects: [
              'English'
            ],
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 901185,
            lastPublishedOn: '2021-12-06T11:10:07.612+0000',
            name: 'mp4',
            mediumIds: [
              'nit_k-12_medium_english'
            ],
            status: 'Live',
            code: '82e2e277-606e-3093-3c7b-68084345c1fe',
            interceptionPoints: {},
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Draft',
            origin: 'do_11342495905869004816476',
            streamingUrl: 'https://sunbirdspikemedia-inct.streaming.media.azure.net/47d10209-6c1a-4626-94f1-6b56938067de/file_example.ism/manifest(format=m3u8-aapl-v3)',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2021-12-06T11:10:04.131+0000',
            se_boards: [
              'CBSE'
            ],
            se_mediumIds: [
              'nit_k-12_medium_english'
            ],
            processId: 'e06e55b1-4054-4681-8d71-4a1378c9d6d1',
            contentDisposition: 'inline',
            lastUpdatedOn: '2021-12-06T11:40:11.935+0000',
            originData: {
              identifier: 'do_11342495905869004816476',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11342495905869004816476'
            },
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2021-12-06T11:10:09.025+0000',
            createdFor: [
              '01309282781705830427'
            ],
            creator: 'anusha',
            os: [
              'All'
            ],
            se_subjectIds: [
              'nit_k-12_subject_english'
            ],
            se_FWIds: [
              'nit_k-12'
            ],
            pkgVersion: 1,
            versionKey: '1638790811935',
            idealScreenDensity: 'hdpi',
            framework: 'nit_k-12',
            depth: 2,
            boardIds: [
              'nit_k-12_board_cbse'
            ],
            lastSubmittedOn: '2021-12-06T11:10:06.398+0000',
            createdBy: '19ba0e4e-9285-4335-8dd0-f674bf03fa4d',
            compatibilityLevel: 1,
            gradeLevelIds: [
              'nit_k-12_gradelevel_grade-1'
            ],
            board: 'CBSE',
            programId: '12e4bba0-4d08-11ec-b831-d35d7ee5b6c9',
            relationalMetadata: {
              relName: 'Mp4 '
            }
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            unitIdentifiers: [
              'do_11341999555289907211986'
            ],
            copyright: '2021',
            se_gradeLevelIds: [
              'ekstep_ncert_k-12_gradelevel_class1'
            ],
            organisationId: 'e7328d77-42a7-44c8-84f4-8cfea235f07d',
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342001918241177611995/artifact/en_1_5mg.mp4',
            subject: [
              'Mathematics'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342001918241177611995/skip-two-level-send-for-review_1638186181595_do_11342001918241177611995_1.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_11342001918241177611995',
            mimeType: 'video/mp4',
            variants: {
              full: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342001918241177611995/skip-two-level-send-for-review_1638186181595_do_11342001918241177611995_1.ecar',
                size: '1134553'
              },
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342001918241177611995/skip-two-level-send-for-review_1638186182112_do_11342001918241177611995_1_SPINE.ecar',
                size: '1519'
              }
            },
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Class 1'
            ],
            primaryCategory: 'Explanation Content',
            appId: 'dev.sunbird.portal',
            contentEncoding: 'identity',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11342001918241177611995/artifact/en_1_5mg.mp4',
            contentType: 'ClassroomTeachingVideo',
            se_gradeLevels: [
              'Class 1'
            ],
            trackable: {
              enabled: 'No',
              autoBatch: 'No'
            },
            identifier: 'do_11342001918241177611995',
            audience: [
              'Student'
            ],
            se_boardIds: [
              'ekstep_ncert_k-12_board_cbse'
            ],
            subjectIds: [
              'ekstep_ncert_k-12_subject_mathematics'
            ],
            visibility: 'Default',
            transcripts: [
              {
                language: 'Assamese',
                identifier: 'do_11342001945829376011996',
                artifactUrl: 'https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11342001945829376011996/srt-e.srt'
              }
            ],
            author: 'N118',
            consumerId: 'bfe5883f-ac66-4744-a064-3ed88d986eba',
            discussionForum: {
              enabled: 'No'
            },
            index: 3,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '8cb241a3-52de-4a3a-a9e8-4d927852b80a',
            version: 2,
            se_subjects: [
              'Mathematics'
            ],
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 1570024,
            lastPublishedOn: '2021-11-29T11:43:01.594+0000',
            name: 'Skip two level - send for review',
            mediumIds: [
              'ekstep_ncert_k-12_medium_english'
            ],
            status: 'Live',
            code: '7c1cab7d-9139-4da0-550a-f52fc7bed2df',
            interceptionPoints: {},
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Draft',
            origin: 'do_11342001918241177611995',
            streamingUrl: 'https://sunbirdspikemedia-inct.streaming.media.azure.net/3fd54010-e022-4abb-a10c-10af66f46ed7/en_1_5mg.ism/manifest(format=m3u8-aapl-v3)',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2021-11-29T11:46:47.252+0000',
            se_boards: [
              'CBSE'
            ],
            se_mediumIds: [
              'ekstep_ncert_k-12_medium_english'
            ],
            processId: 'd911c632-ae10-491d-b9c3-9f135dbe4c36',
            contentDisposition: 'inline',
            lastUpdatedOn: '2021-11-29T12:13:12.203+0000',
            originData: {
              identifier: 'do_11342001918241177611995',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11342001918241177611995'
            },
            collectionId: 'do_11341999555244851211985',
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2021-11-29T11:43:02.349+0000',
            createdFor: [
              '01309282781705830427'
            ],
            creator: 'N118',
            os: [
              'All'
            ],
            se_subjectIds: [
              'ekstep_ncert_k-12_subject_mathematics'
            ],
            se_FWIds: [
              'ekstep_ncert_k-12'
            ],
            pkgVersion: 1,
            versionKey: '1638187992203',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            boardIds: [
              'ekstep_ncert_k-12_board_cbse'
            ],
            lastSubmittedOn: '2021-11-29T11:46:51.207+0000',
            createdBy: 'b6640bfe-e294-4a54-8c75-589472324624',
            compatibilityLevel: 1,
            gradeLevelIds: [
              'ekstep_ncert_k-12_gradelevel_class1'
            ],
            board: 'CBSE',
            programId: 'ff331e00-5101-11ec-a89c-ef16b4c6fb46'
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            se_gradeLevelIds: [
              'nit_k-12_gradelevel_grade-1'
            ],
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1134128135522058241655/artifact/sample.pdf',
            subject: [
              'English'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1134128135522058241655/22nov-1234_1637563370423_do_1134128135522058241655_1.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_1134128135522058241655',
            mimeType: 'application/pdf',
            variants: {
              full: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1134128135522058241655/22nov-1234_1637563370423_do_1134128135522058241655_1.ecar',
                size: '2332'
              },
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1134128135522058241655/22nov-1234_1637563370763_do_1134128135522058241655_1_SPINE.ecar',
                size: '1285'
              }
            },
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Grade 1'
            ],
            primaryCategory: 'eTextbook',
            appId: 'local.sunbird.portal',
            contentEncoding: 'identity',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1134128135522058241655/artifact/sample.pdf',
            contentType: 'eTextBook',
            se_gradeLevels: [
              'Grade 1'
            ],
            identifier: 'do_1134128135522058241655',
            audience: [
              'Student'
            ],
            se_boardIds: [
              'nit_k-12_board_cbse'
            ],
            subjectIds: [
              'nit_k-12_subject_english'
            ],
            visibility: 'Default',
            author: 'sumi4',
            discussionForum: {
              enabled: 'No'
            },
            index: 4,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
            version: 2,
            pragma: [
              'external'
            ],
            se_subjects: [
              'English'
            ],
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 3028,
            lastPublishedOn: '2021-11-22T06:42:50.412+0000',
            name: '22nov 1234',
            mediumIds: [
              'nit_k-12_medium_english'
            ],
            status: 'Live',
            code: 'df66c232-3012-bee8-013c-34a42b587b40',
            interceptionPoints: {},
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Draft',
            origin: 'do_1134128135522058241655',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1134128135522058241655/artifact/sample.pdf',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2021-11-22T06:46:28.353+0000',
            se_boards: [
              'CBSE'
            ],
            se_mediumIds: [
              'nit_k-12_medium_english'
            ],
            processId: '55f23792-0f53-483e-b45b-89dd494c4d05',
            contentDisposition: 'inline',
            lastUpdatedOn: '2021-11-22T06:42:51.131+0000',
            originData: {
              identifier: 'do_1134128135522058241655',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_1134128135522058241655'
            },
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2021-11-22T06:42:51.131+0000',
            createdFor: [
              '01309282781705830427'
            ],
            creator: 'sumi4',
            os: [
              'All'
            ],
            se_subjectIds: [
              'nit_k-12_subject_english'
            ],
            se_FWIds: [
              'nit_k-12'
            ],
            pkgVersion: 1,
            versionKey: '1637563591689',
            idealScreenDensity: 'hdpi',
            framework: 'nit_k-12',
            depth: 2,
            boardIds: [
              'nit_k-12_board_cbse'
            ],
            lastSubmittedOn: '2021-11-22T06:46:31.290+0000',
            createdBy: 'e73b4786-a6b3-4fe7-b02b-81560ca87811',
            compatibilityLevel: 4,
            gradeLevelIds: [
              'nit_k-12_gradelevel_grade-1'
            ],
            board: 'CBSE',
            programId: '12e408a0-301a-11ec-90a3-9fb721542000'
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            unitIdentifiers: [
              'do_1133658809335480321653'
            ],
            copyright: '2020',
            organisationId: '13495698-a117-460b-920c-41007923c764',
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11341789596678553611557/artifact/recording-9.mp4',
            subject: [
              'Mathematics'
            ],
            channel: '0130659746662727680',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11341789596678553611557/trnascroipt12_1637926699232_do_11341789596678553611557_1.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_11341789596678553611557',
            mimeType: 'video/mp4',
            variants: {
              full: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11341789596678553611557/trnascroipt12_1637926699232_do_11341789596678553611557_1.ecar',
                size: '1663290'
              },
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11341789596678553611557/trnascroipt12_1637926699895_do_11341789596678553611557_1_SPINE.ecar',
                size: '1445'
              }
            },
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Class 1'
            ],
            primaryCategory: 'Learning Resource',
            appId: 'dev.dock.portal',
            contentEncoding: 'identity',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11341789596678553611557/artifact/recording-9.mp4',
            contentType: 'PreviousBoardExamPapers',
            se_gradeLevels: [
              'Class 1'
            ],
            trackable: {
              enabled: 'No',
              autoBatch: 'No'
            },
            identifier: 'do_11341789596678553611557',
            audience: [
              'Student'
            ],
            visibility: 'Default',
            transcripts: [
              {
                language: 'Assamese',
                identifier: 'do_11341789608220262411558',
                artifactUrl: 'https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11341789608220262411558/1.srt'
              }
            ],
            author: 'lily10',
            consumerId: 'bfe5883f-ac66-4744-a064-3ed88d986eba',
            discussionForum: {
              enabled: 'No'
            },
            index: 5,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
            version: 2,
            se_subjects: [
              'Mathematics'
            ],
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 2030262,
            lastPublishedOn: '2021-11-26T11:38:19.231+0000',
            name: 'trnascroipt12',
            status: 'Live',
            code: 'b54ef826-9f84-25c0-da1c-42e8d0bed6d6',
            interceptionPoints: {},
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Draft',
            origin: 'do_11341789596678553611557',
            streamingUrl: 'https://sunbirdspikemedia-inct.streaming.media.azure.net/5809c5a5-674b-4ce1-b932-2b39ec2a938a/recording-9.ism/manifest(format=m3u8-aapl-v3)',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2021-11-26T11:42:03.299+0000',
            se_boards: [
              'CBSE'
            ],
            processId: '47ecf4af-7d56-4468-8ff9-42ebe7314f8f',
            contentDisposition: 'inline',
            lastUpdatedOn: '2021-11-26T12:12:10.600+0000',
            originData: {
              identifier: 'do_11341789596678553611557',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11341789596678553611557'
            },
            collectionId: 'do_1133658809330073601650',
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2021-11-26T11:38:20.140+0000',
            createdFor: [
              '0130659746662727680'
            ],
            creator: 'lily10',
            os: [
              'All'
            ],
            se_FWIds: [
              'ekstep_ncert_k-12'
            ],
            pkgVersion: 1,
            versionKey: '1637928730600',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            lastSubmittedOn: '2021-11-26T11:42:05.436+0000',
            createdBy: '1b0cd97d-e2b8-4bb8-8c19-7bf9a37b4a56',
            compatibilityLevel: 1,
            board: 'CBSE',
            programId: '7d6be370-14ed-11ec-895a-f734e797d929'
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_112813424626933760118-latest',
            subject: [
              'Hindi'
            ],
            channel: 'sunbird',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112813424626933760118/question-1_1564138757082_do_112813424626933760118_1.0.ecar',
            questions: [
              {
                name: 'vsa_NCFCOPY',
                relation: 'associatedTo',
                identifier: 'do_112777988509196288168',
                description: null,
                objectType: 'AssessmentItem',
                status: 'Live'
              },
              {
                name: 'vsa_NCFCOPY',
                relation: 'associatedTo',
                identifier: 'do_112811901172457472138',
                description: null,
                objectType: 'AssessmentItem',
                status: 'Live'
              },
              {
                name: 'vsa_NCFCOPY',
                relation: 'associatedTo',
                identifier: 'do_112776008691122176165',
                description: null,
                objectType: 'AssessmentItem',
                status: 'Live'
              },
              {
                name: 'vsa_NCFCOPY',
                relation: 'associatedTo',
                identifier: 'do_112811913749782528142',
                description: null,
                objectType: 'AssessmentItem',
                status: 'Live'
              },
              {
                name: 'vsa_NCFCOPY',
                relation: 'associatedTo',
                identifier: 'do_112777893753839616130',
                description: null,
                objectType: 'AssessmentItem',
                status: 'Live'
              },
              {
                name: 'vsa_NCFCOPY',
                relation: 'associatedTo',
                identifier: 'do_112775880653709312123',
                description: null,
                objectType: 'AssessmentItem',
                status: 'Live'
              },
              {
                name: 'curiosity_NCFCOPY',
                relation: 'associatedTo',
                identifier: 'do_112812704485539840110',
                description: null,
                objectType: 'AssessmentItem',
                status: 'Live'
              }
            ],
            language: [
              'English'
            ],
            program: 'CBSE',
            mimeType: 'application/vnd.ekstep.ecml-archive',
            variants: {
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112813424626933760118/question-1_1564138757722_do_112813424626933760118_1.0_spine.ecar',
                size: 24409
              }
            },
            objectType: 'ContentImage',
            apoc_text: 'APOC',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Class 6'
            ],
            appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112813424626933760118/artifact/qa_1561455529937.thumb.png',
            primaryCategory: 'Practice Question Set',
            appId: 'dev.sunbird.portal',
            contentEncoding: 'gzip',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112813424626933760118/artifact/1564138756164_do_112813424626933760118.zip',
            sYS_INTERNAL_LAST_UPDATED_ON: '2019-07-26T10:59:20.453+0000',
            contentType: 'PracticeQuestionSet',
            apoc_num: 1,
            identifier: 'do_112813424626933760118',
            audience: [
              'Student'
            ],
            visibility: 'Default',
            author: 'Reviewer User, Kartheek Palla, somvit bhowmik, Creation',
            consumerId: '02bf5216-c947-492f-929b-af2e61ea78cd',
            index: 6,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '99606810-7d5c-4f1f-80b0-36c4a0b4415d',
            version: 2,
            license: 'CC BY 4.0',
            prevState: 'Draft',
            size: 355558,
            lastPublishedOn: '2019-07-26T10:59:17.076+0000',
            name: 'Question 1',
            topic: [
              'बचपन'
            ],
            attributions: [
              'DLF Public School (Rajinder Nagar)'
            ],
            status: 'Draft',
            code: 'org.sunbird.NnadOk',
            apoc_json: '{"batch": true}',
            description: 'Very Short Answer - बचपन',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_112813424626933760118-latest',
            medium: [
              'English'
            ],
            posterImage: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11279144369168384014/artifact/qa_1561455529937.png',
            idealScreenSize: 'normal',
            createdOn: '2019-07-26T10:59:08.403+0000',
            contentDisposition: 'inline',
            lastUpdatedOn: '2019-09-06T12:30:03.579+0000',
            dialcodeRequired: 'No',
            editorVersion: 3,
            lastStatusChangedOn: '2019-07-26T10:59:08.403+0000',
            creator: 'Content Creator',
            os: [
              'All'
            ],
            pkgVersion: 1,
            versionKey: '1567773003579',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            s3Key: 'ecar_files/do_112813424626933760118/question-1_1564138757082_do_112813424626933760118_1.0.ecar',
            createdBy: 'edce4f4f-6c82-458a-8b23-e3521859992f',
            additionalCategory: [
              'Practice Question Set'
            ],
            se_topics: [
              'बचपन'
            ],
            compatibilityLevel: 1,
            board: 'CBSE',
            programId: '58a52010-9cae-11e9-8179-f311bc5bf48d',
            resourceType: 'Practice',
            plugins: [
              {
                identifier: 'org.sunbird.questionunit.quml',
                semanticVersion: '1.0'
              }
            ]
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_11314250039970201615-latest',
            plugins: [
              {
                identifier: 'org.sunbird.questionunit.quml',
                semanticVersion: '1.1'
              }
            ],
            subject: [
              'Mathematics'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11314250039970201615/mcq_1604309149980_do_11314250039970201615_1.0.ecar',
            language: [
              'English'
            ],
            mimeType: 'application/vnd.ekstep.ecml-archive',
            variants: {
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11314250039970201615/mcq_1604309150929_do_11314250039970201615_1.0_spine.ecar',
                size: 13937
              }
            },
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Class 1'
            ],
            primaryCategory: 'Practice Question Set',
            appId: 'dev.sunbird.portal',
            contentEncoding: 'gzip',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11314250039970201615/artifact/1603268238166_do_11313397311209472012807.zip',
            sYS_INTERNAL_LAST_UPDATED_ON: '2020-11-02T09:25:53.541+0000',
            contentType: 'PracticeQuestionSet',
            trackable: {
              enabled: 'No',
              autoBatch: 'No'
            },
            identifier: 'do_11314250039970201615',
            audience: [
              'Student'
            ],
            visibility: 'Default',
            author: 'anusha',
            consumerId: '49aacb6b-b089-4283-a67e-31a5cbb31f43',
            index: 7,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: 'ae94b68c-a535-4dce-8e7a-fb9662b0ad68',
            version: 2,
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 1455536,
            lastPublishedOn: '2020-11-02T09:25:49.980+0000',
            name: 'mcq',
            status: 'Live',
            code: 'a44ff6f2-c770-1641-7939-b0adb1262390',
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Processing',
            origin: 'do_11313397311209472012807',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_11314250039970201615-latest',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2020-11-02T09:25:30.928+0000',
            processId: '59c917b0-1ced-11eb-81b1-659ec274e395',
            contentDisposition: 'inline',
            lastUpdatedOn: '2020-11-02T09:25:49.900+0000',
            originData: {
              identifier: 'do_11313397311209472012807',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11313397311209472012807'
            },
            collectionId: 'do_11313390789940019212742',
            dialcodeRequired: 'No',
            editorVersion: 3,
            lastStatusChangedOn: '2020-11-02T09:25:53.533+0000',
            creator: 'anusha',
            os: [
              'All'
            ],
            questionCategories: [
              'MCQ'
            ],
            cloudStorageKey: 'content/do_11314250039970201615/artifact/1603268238166_do_11313397311209472012807.zip',
            pkgVersion: 1,
            versionKey: '1604309149900',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            s3Key: 'ecar_files/do_11314250039970201615/mcq_1604309149980_do_11314250039970201615_1.0.ecar',
            lastSubmittedOn: '2020-11-02T09:25:47.193+0000',
            createdBy: '19ba0e4e-9285-4335-8dd0-f674bf03fa4d',
            compatibilityLevel: 1,
            itemSetPreviewUrl: 'https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11313397311209472012807/artifact/do_11313397311209472012807_1603268236820.pdf',
            board: 'CBSE',
            programId: '1ef254a0-1363-11eb-a8d8-3356e959c4c3',
            resourceType: 'Learn'
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            unitIdentifiers: [
              'do_113174442975805440153'
            ],
            copyright: 'SAMPPLE',
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11317444580121804812898/artifact/index.epub',
            subject: [
              'Mathematics'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11317444580121804812898/e_textbook_epub_1608208721009_do_11317444580121804812898_1.0.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_113174445078708224180',
            mimeType: 'application/epub',
            variants: {
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11317444580121804812898/e_textbook_epub_1608208721868_do_11317444580121804812898_1.0_spine.ecar',
                size: 1375
              }
            },
            objectType: 'Content',
            se_mediums: [
              'Hindi'
            ],
            gradeLevel: [
              'Class 1'
            ],
            primaryCategory: 'eTextbook',
            appId: 'local.sunbird.portal',
            contentEncoding: 'gzip',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11317444580121804812898/artifact/index.epub',
            sYS_INTERNAL_LAST_UPDATED_ON: '2020-12-17T12:38:42.173+0000',
            contentType: 'eTextBook',
            trackable: {
              enabled: 'No',
              autoBatch: 'No'
            },
            identifier: 'do_11317444580121804812898',
            audience: [
              'Student'
            ],
            visibility: 'Default',
            author: 'color4',
            consumerId: '7411b6bd-89f3-40ec-98d1-229dc64ce77d',
            index: 8,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
            version: 2,
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 5109654,
            lastPublishedOn: '2020-12-17T12:38:41.009+0000',
            name: 'E_TEXTBOOK_EPUB',
            attributions: [
              'SAMPLE'
            ],
            status: 'Live',
            code: '902fca6d-79d0-8204-94ff-7a32856fabc3',
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Processing',
            origin: 'do_113174445078708224180',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11317444580121804812898/artifact/index.epub',
            medium: [
              'Hindi'
            ],
            idealScreenSize: 'normal',
            createdOn: '2020-12-17T12:38:35.971+0000',
            processId: 'd8abbd88-26a3-47d3-a5bc-79f268fd8586',
            contentDisposition: 'inline',
            additionalCategories: [
              'Textbook'
            ],
            lastUpdatedOn: '2020-12-17T12:38:40.212+0000',
            originData: {
              identifier: 'do_113174445078708224180',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_113174445078708224180'
            },
            collectionId: 'do_113174442974248960128',
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2020-12-17T12:38:42.164+0000',
            creator: 'color4',
            os: [
              'All'
            ],
            cloudStorageKey: 'content/do_11317444580121804812898/artifact/index.epub',
            pkgVersion: 1,
            versionKey: '1608208720212',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            s3Key: 'ecar_files/do_11317444580121804812898/e_textbook_epub_1608208721009_do_11317444580121804812898_1.0.ecar',
            lastSubmittedOn: '2020-12-17T12:38:38.245+0000',
            createdBy: '0ce5b67e-b48e-489b-a818-e938e8bfc14b',
            compatibilityLevel: 4,
            board: 'CBSE',
            programId: 'd0d7ddc0-4063-11eb-aae1-fb99d9fb6737'
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113367577248145408152',
            copyright: 'UttarPradesh',
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113061161270198272154/artifact/index.epub',
            subject: [
              'Hindi'
            ],
            channel: '01305046146192179271',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_113061161270198272154/pedagogy_epub_1594380043739_do_113061161270198272154_1.0.ecar',
            language: [
              'English'
            ],
            mimeType: 'application/epub',
            variants: {
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_113061161270198272154/pedagogy_epub_1594380044155_do_113061161270198272154_1.0_spine.ecar',
                size: 30543
              }
            },
            objectType: 'Content',
            apoc_text: 'APOC',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Class 10'
            ],
            appIcon: 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
            primaryCategory: 'Teacher Resource',
            appId: 'dev.dock.portal',
            contentEncoding: 'gzip',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113061161270198272154/artifact/index.epub',
            sYS_INTERNAL_LAST_UPDATED_ON: '2020-07-10T11:20:44.449+0000',
            contentType: 'PedagogyFlow',
            apoc_num: 1,
            identifier: 'do_113061161270198272154',
            audience: [
              'Teacher'
            ],
            visibility: 'Default',
            learningOutcome: [
              'धरती की रक्षा सीता के  समान महत्वपूर्ण है'
            ],
            index: 9,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '878d74fe-9004-46f9-a1c2-638a11362192',
            version: 2,
            license: 'CC BY 4.0',
            prevState: 'Draft',
            size: 793442,
            lastPublishedOn: '2020-07-10T11:20:39.805+0000',
            name: 'pedagogy_epub',
            topic: [
              'कर चले हम फ़िदा'
            ],
            attributions: [
              'Kiruba',
              'Anusha'
            ],
            status: 'Live',
            code: 'bfcd4f75-d5cb-d34f-dc07-4bc0c50add83',
            apoc_json: '{"batch": true}',
            prevStatus: 'Processing',
            origin: 'do_11306114257490739211868',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113061161270198272154/artifact/index.epub',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2020-07-10T11:20:37.880+0000',
            contentPolicyCheck: true,
            contentDisposition: 'inline',
            lastUpdatedOn: '2020-07-10T11:20:39.279+0000',
            originData: {
              identifier: 'do_11306114257490739211868',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11306114257490739211868'
            },
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2020-07-10T11:20:44.436+0000',
            creator: 'sumi',
            os: [
              'All'
            ],
            cloudStorageKey: 'content/do_113061161270198272154/artifact/index.epub',
            pkgVersion: 1,
            versionKey: '1594380039875',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            s3Key: 'ecar_files/do_113061161270198272154/pedagogy_epub_1594380043739_do_113061161270198272154_1.0.ecar',
            createdBy: '878d74fe-9004-46f9-a1c2-638a11362192',
            additionalCategory: [
              'Pedagogy Flow'
            ],
            se_topics: [
              'कर चले हम फ़िदा'
            ],
            compatibilityLevel: 4,
            board: 'CBSE',
            programId: 'd7618ae0-c28e-11ea-b3d3-3bcdd8c1d450',
            resourceType: 'Read'
          }
        ],
        contentDisposition: 'inline',
        lastUpdatedOn: '2022-12-19T07:55:02.810+0000',
        contentEncoding: 'gzip',
        generateDIALCodes: 'No',
        contentType: 'TextBookUnit',
        dialcodeRequired: 'No',
        identifier: 'do_113367577248145408152',
        lastStatusChangedOn: '2021-09-16T09:25:32.049+0000',
        audience: [
          'Student'
        ],
        os: [
          'All'
        ],
        visibility: 'Parent',
        discussionForum: {
          enabled: 'No'
        },
        index: 1,
        mediaType: 'content',
        osId: 'org.ekstep.launcher',
        languageCode: [
          'en'
        ],
        version: 2,
        pkgVersion: 1,
        versionKey: '1631784332049',
        license: 'CC BY 4.0',
        idealScreenDensity: 'hdpi',
        depth: 1,
        lastPublishedOn: '2021-12-13T10:49:43.588+0000',
        compatibilityLevel: 1,
        leafNodesCount: 9,
        name: 'Textbook Unit 1',
        attributions: [],
        status: 'Draft'
      },
      {
        ownershipType: [
          'createdBy'
        ],
        parent: 'do_113367576496021504151',
        code: '13609b98-0fb8-8538-f004-6cd8726df3a9',
        credentials: {
          enabled: 'No'
        },
        channel: '01309282781705830427',
        language: [
          'English'
        ],
        mimeType: 'application/vnd.ekstep.content-collection',
        idealScreenSize: 'normal',
        createdOn: '2022-08-04T08:08:51.333+0000',
        objectType: 'Content',
        primaryCategory: 'Textbook Unit',
        children: [
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113595447552679936140',
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11359060047881830411739/artifact/1...nenokkadine-rhyme-64-copy.mp3',
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11359060047881830411739/mp3_1659600016368_do_11359060047881830411739_2.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_11359060047881830411739',
            mimeType: 'audio/mp3',
            variants: {
              full: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11359060047881830411739/mp3_1659600016368_do_11359060047881830411739_2.ecar',
                size: '437273'
              },
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11359060047881830411739/mp3_1659600016809_do_11359060047881830411739_2_SPINE.ecar',
                size: '1197'
              }
            },
            objectType: 'Content',
            appIcon: '',
            primaryCategory: 'Learning Resource',
            contentEncoding: 'identity',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11359060047881830411739/artifact/1...nenokkadine-rhyme-64-copy.mp3',
            contentType: 'PreviousBoardExamPapers',
            trackable: {
              enabled: 'No',
              autoBatch: 'No'
            },
            identifier: 'do_11359060047881830411739',
            audience: [
              'Student'
            ],
            visibility: 'Default',
            author: 'n11@yopmail.com',
            discussionForum: {
              enabled: 'No'
            },
            index: 1,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: 'ae94b68c-a535-4dce-8e7a-fb9662b0ad68',
            version: 2,
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 452232,
            lastPublishedOn: '2022-08-04T08:00:16.367+0000',
            name: 'mp3',
            status: 'Live',
            code: '6dc6743f-9f04-4835-45b5-dc1ac87264aa',
            interceptionPoints: {},
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Live',
            origin: 'do_11359060047881830411739',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11359060047881830411739/artifact/1...nenokkadine-rhyme-64-copy.mp3',
            idealScreenSize: 'normal',
            createdOn: '2022-08-04T08:00:10.683+0000',
            processId: 'd068468b-7f24-4953-8eb1-9624991ac452',
            contentDisposition: 'inline',
            lastUpdatedOn: '2022-08-04T08:00:17.039+0000',
            originData: {
              identifier: 'do_11359060047881830411739',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11359060047881830411739'
            },
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2022-08-04T08:00:17.039+0000',
            createdFor: [
              '01309282781705830427'
            ],
            creator: 'n11@yopmail.com',
            os: [
              'All'
            ],
            se_FWIds: [
              'ekstep_ncert_k-12'
            ],
            pkgVersion: 2,
            versionKey: '1659600015130',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            lastSubmittedOn: '2022-08-04T08:00:15.077+0000',
            createdBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
            compatibilityLevel: 1
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113595447552679936140',
            copyright: 'NIT123',
            se_gradeLevelIds: [
              'ekstep_ncert_k-12_gradelevel_class1'
            ],
            subject: [
              'Environmental Studies'
            ],
            targetMediumIds: [
              'ekstep_ncert_k-12_medium_english'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1136287611140259841136/test_1663667416548_do_1136287611140259841136_3_SPINE.ecar',
            organisation: [
              'NIT',
              'MPPS MUKKADAMPALLI'
            ],
            language: [
              'English'
            ],
            mimeType: 'application/vnd.ekstep.content-collection',
            variants: {
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1136287611140259841136/test_1663667416548_do_1136287611140259841136_3_SPINE.ecar',
                size: '3897'
              },
              online: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1136287611140259841136/test_1663667416657_do_1136287611140259841136_3_ONLINE.ecar',
                size: '3896'
              }
            },
            targetGradeLevelIds: [
              'ekstep_ncert_k-12_gradelevel_class1'
            ],
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            appIcon: '',
            primaryCategory: 'Course',
            appId: 'dev.sunbird.portal',
            contentEncoding: 'gzip',
            lockKey: '548a4b90-af4c-4a3a-8eec-fc4fb3da007f',
            generateDIALCodes: 'Yes',
            totalCompressedSize: 0,
            mimeTypesCount: '{"application/vnd.ekstep.content-collection":2}',
            sYS_INTERNAL_LAST_UPDATED_ON: '2022-09-20T09:50:16.548+0000',
            contentType: 'Course',
            se_gradeLevels: [
              'Class 1'
            ],
            trackable: {
              enabled: 'Yes',
              autoBatch: 'No'
            },
            identifier: 'do_1136287611140259841136',
            audience: [
              'Student'
            ],
            se_boardIds: [
              'ekstep_ncert_k-12_board_cbse'
            ],
            subjectIds: [
              'ekstep_ncert_k-12_subject_environmentalstudies'
            ],
            toc_url: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1136287611140259841136/artifact/do_1136287611140259841136_toc.json',
            visibility: 'Default',
            contentTypesCount: '{"CourseUnit":2}',
            author: 'n11@yopmail.com',
            consumerId: 'bfe5883f-ac66-4744-a064-3ed88d986eba',
            childNodes: [
              'do_1136287615809781761139',
              'do_1136287615809290241137'
            ],
            discussionForum: {
              enabled: 'No'
            },
            index: 2,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: 'ae94b68c-a535-4dce-8e7a-fb9662b0ad68',
            version: 2,
            se_subjects: [
              'Environmental Studies'
            ],
            license: 'CC BY 4.0',
            prevState: 'Review',
            qrCodeProcessId: 'dad1065a-bb01-40dd-ae85-0705c43a93c5',
            size: 3897,
            lastPublishedOn: '2022-09-20T09:50:16.262+0000',
            name: 'Test',
            targetBoardIds: [
              'ekstep_ncert_k-12_board_cbse'
            ],
            status: 'Review',
            code: 'org.sunbird.zXG7ZQ',
            credentials: {
              enabled: 'Yes'
            },
            prevStatus: 'Live',
            description: 'Enter description for Course',
            idealScreenSize: 'normal',
            createdOn: '2022-09-20T09:45:28.184+0000',
            reservedDialcodes: {
              Q2U9U4: 1,
              I9R1G6: 0
            },
            se_boards: [
              'CBSE'
            ],
            targetSubjectIds: [
              'ekstep_ncert_k-12_subject_mathematics'
            ],
            se_mediumIds: [
              'ekstep_ncert_k-12_medium_english'
            ],
            copyrightYear: 2012,
            contentDisposition: 'inline',
            lastUpdatedOn: '2022-09-20T09:50:16.923+0000',
            dialcodeRequired: 'Yes',
            lastStatusChangedOn: '2022-09-20T09:50:21.363+0000',
            createdFor: [
              '01309282781705830427'
            ],
            creator: 'n11@yopmail.com',
            os: [
              'All'
            ],
            se_subjectIds: [
              'ekstep_ncert_k-12_subject_environmentalstudies',
              'ekstep_ncert_k-12_subject_mathematics'
            ],
            se_FWIds: [
              'ekstep_ncert_k-12'
            ],
            targetFWIds: [
              'ekstep_ncert_k-12'
            ],
            pkgVersion: 3,
            versionKey: '1663667429867',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            dialcodes: [
              'I9R1G6'
            ],
            depth: 0,
            s3Key: 'content/do_1136287611140259841136/artifact/do_1136287611140259841136_toc.json',
            lastSubmittedOn: '2022-09-20T09:50:29.592+0000',
            createdBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
            compatibilityLevel: 4,
            leafNodesCount: 0,
            userConsent: 'Yes',
            resourceType: 'Course'
          },
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113595447552679936140',
            unitIdentifiers: [
              'do_11329686650814464014184'
            ],
            copyright: '2021',
            organisationId: 'e7328d77-42a7-44c8-84f4-8cfea235f07d',
            se_learningOutcomeIds: [
              'ekstep_ncert_k-12_learningoutcome_0a5d86795f17f7a8a556480e0ee515e7c9d42c14'
            ],
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113296874922852352184/artifact/do_113296874922852352184_1623153677353_sample.pdf',
            subject: [
              'Hindi'
            ],
            channel: '01309282781705830427',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113296874922852352184/test-content1-approval-by-aradhana_1665388454625_do_113296874922852352184_2.ecar',
            language: [
              'English'
            ],
            source: 'https://dock.sunbirded.org/api/content/v1/read/do_11329687205868339214294',
            mimeType: 'application/pdf',
            variants: {
              full: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113296874922852352184/test-content1-approval-by-aradhana_1665388454625_do_113296874922852352184_2.ecar',
                size: '8307'
              },
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113296874922852352184/test-content1-approval-by-aradhana_1665388454826_do_113296874922852352184_2_SPINE.ecar',
                size: '7145'
              }
            },
            objectType: 'Content',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Class 10'
            ],
            appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113296874922852352184/artifact/033019_sz_reviews_feat_1564126718632.thumb.jpg',
            primaryCategory: 'Explanation Content',
            appId: 'dev.sunbird.portal',
            contentEncoding: 'identity',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113296874922852352184/artifact/do_113296874922852352184_1623153677353_sample.pdf',
            sYS_INTERNAL_LAST_UPDATED_ON: '2021-06-08T12:01:21.046+0000',
            contentType: 'ClassroomTeachingVideo',
            se_gradeLevels: [
              'Class 10'
            ],
            trackable: {
              enabled: 'No',
              autoBatch: 'No'
            },
            identifier: 'do_113296874922852352184',
            lastUpdatedBy: '0b71985d-fcb0-4018-ab14-83f10c3b0426',
            audience: [
              'Student'
            ],
            visibility: 'Default',
            author: 'N131',
            consumerId: '7411b6bd-89f3-40ec-98d1-229dc64ce77d',
            discussionForum: {
              enabled: 'Yes'
            },
            index: 3,
            mediaType: 'content',
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: '3fa8b3a5-71b2-4baf-b35d-6c80ef0a4edc',
            version: 2,
            pragma: [
              'external'
            ],
            se_subjects: [
              'Hindi'
            ],
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 2786,
            lastPublishedOn: '2022-10-10T07:54:14.295+0000',
            name: 'test content1 approval by aradhana',
            status: 'Live',
            code: '76b5d895-cf69-f5a5-ef6b-cab421478ffa',
            credentials: {
              enabled: 'No'
            },
            prevStatus: 'Draft',
            origin: 'do_11329687205868339214294',
            se_learningOutcomes: [
              'List  different joints of our body'
            ],
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113296874922852352184/artifact/do_113296874922852352184_1623153677353_sample.pdf',
            medium: [
              'English'
            ],
            posterImage: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281332607717376012/artifact/033019_sz_reviews_feat_1564126718632.jpg',
            learningOutcomeIds: [
              'ekstep_ncert_k-12_learningoutcome_0a5d86795f17f7a8a556480e0ee515e7c9d42c14'
            ],
            idealScreenSize: 'normal',
            createdOn: '2021-06-08T12:01:17.115+0000',
            se_boards: [
              'CBSE'
            ],
            processId: '9677019f-07d0-40aa-af34-f8ddbd362c8d',
            copyrightYear: 2021,
            contentDisposition: 'inline',
            additionalCategories: [
              'Classroom Teaching Video'
            ],
            licenseterms: 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
            lastUpdatedOn: '2022-10-10T07:54:15.084+0000',
            originData: {
              identifier: 'do_11329687205868339214294',
              repository: 'https://dock.sunbirded.org/api/content/v1/read/do_11329687205868339214294'
            },
            collectionId: 'do_11329686650730905614111',
            dialcodeRequired: 'No',
            lastStatusChangedOn: '2022-10-10T07:54:15.084+0000',
            createdFor: [
              '01309282781705830427'
            ],
            creator: 'N131',
            os: [
              'All'
            ],
            cloudStorageKey: 'content/do_113296874922852352184/artifact/do_113296874922852352184_1623153677353_sample.pdf',
            se_FWIds: [
              'ekstep_ncert_k-12'
            ],
            pkgVersion: 2,
            versionKey: '1623154097884',
            idealScreenDensity: 'hdpi',
            framework: 'ekstep_ncert_k-12',
            depth: 2,
            s3Key: 'ecar_files/do_113296874922852352184/test-content1-approval-by-aradhana_1623153680498_do_113296874922852352184_1.0.ecar',
            lastSubmittedOn: '2021-06-08T12:08:17.724+0000',
            createdBy: '0b71985d-fcb0-4018-ab14-83f10c3b0426',
            compatibilityLevel: 4,
            board: 'CBSE',
            programId: 'cba710a0-c84e-11eb-a18f-2b66ffec9e33'
          }
        ],
        contentDisposition: 'inline',
        lastUpdatedOn: '2022-12-19T07:55:02.810+0000',
        contentEncoding: 'gzip',
        generateDIALCodes: 'No',
        contentType: 'TextBookUnit',
        dialcodeRequired: 'No',
        identifier: 'do_113595447552679936140',
        lastStatusChangedOn: '2022-08-04T08:08:51.333+0000',
        audience: [
          'Student'
        ],
        os: [
          'All'
        ],
        visibility: 'Parent',
        discussionForum: {
          enabled: 'No'
        },
        index: 2,
        mediaType: 'content',
        osId: 'org.ekstep.launcher',
        languageCode: [
          'en'
        ],
        version: 2,
        versionKey: '1659600531333',
        license: 'CC BY 4.0',
        idealScreenDensity: 'hdpi',
        depth: 1,
        compatibilityLevel: 1,
        name: 'Textbook Unit',
        attributions: [],
        status: 'Draft'
      },
      {
        ownershipType: [
          'createdBy'
        ],
        parent: 'do_113367576496021504151',
        code: 'f92e1549-c653-22cf-cb52-6a9d55e1074d',
        credentials: {
          enabled: 'No'
        },
        channel: '01309282781705830427',
        language: [
          'English'
        ],
        mimeType: 'application/vnd.ekstep.content-collection',
        idealScreenSize: 'normal',
        createdOn: '2022-12-14T09:27:05.615+0000',
        objectType: 'Content',
        primaryCategory: 'Textbook Unit',
        children: [
          {
            ownershipType: [
              'createdBy'
            ],
            parent: 'do_113688914129838080131',
            unitIdentifiers: [
              'do_1127639026795233281128'
            ],
            previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_112952172973195264136-latest',
            plugins: [
              {
                identifier: 'org.sunbird.questionunit.quml',
                semanticVersion: '1.1'
              }
            ],
            subject: [
              'Math'
            ],
            channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
            downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112952172973195264136/practice-questionset_1581076146372_do_112952172973195264136_1.0.ecar',
            language: [
              'English'
            ],
            program: 'New Dev  Program',
            mimeType: 'application/vnd.ekstep.ecml-archive',
            variants: {
              spine: {
                ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112952172973195264136/practice-questionset_1581076147073_do_112952172973195264136_1.0_spine.ecar',
                size: 16008
              }
            },
            objectType: 'Content',
            apoc_text: 'APOC',
            se_mediums: [
              'English'
            ],
            gradeLevel: [
              'Kindergarten'
            ],
            primaryCategory: 'Practice Question Set',
            appId: 'local.sunbird.portal',
            contentEncoding: 'gzip',
            artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112952172973195264136/artifact/1581076145978_do_112952172973195264136.zip',
            sYS_INTERNAL_LAST_UPDATED_ON: '2020-02-07T11:49:09.541+0000',
            contentType: 'PracticeQuestionSet',
            apoc_num: 1,
            identifier: 'do_112952172973195264136',
            audience: [
              'Student'
            ],
            visibility: 'Default',
            author: 'Reviewer User',
            consumerId: '7411b6bd-89f3-40ec-98d1-229dc64ce77d',
            index: 1,
            mediaType: 'content',
            itemSets: [
              {
                name: 'Practice QuestionSet',
                relation: 'associatedTo',
                identifier: 'do_112952172984524800154',
                description: 'Practice QuestionSet',
                objectType: 'ItemSet',
                status: 'Live'
              }
            ],
            osId: 'org.ekstep.quiz.app',
            languageCode: [
              'en'
            ],
            lastPublishedBy: 'Ekstep',
            version: 2,
            license: 'CC BY 4.0',
            prevState: 'Review',
            size: 2060214,
            lastPublishedOn: '2020-02-07T11:49:06.359+0000',
            name: 'Practice QuestionSet',
            rejectComment: '',
            attributions: [
              'My School'
            ],
            status: 'Live',
            code: 'c05726f3-149c-c0bf-6ada-ca741ca0dbbd',
            apoc_json: '{"batch": true}',
            prevStatus: 'Processing',
            streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_112952172973195264136-latest',
            medium: [
              'English'
            ],
            idealScreenSize: 'normal',
            createdOn: '2020-02-07T11:43:22.396+0000',
            contentDisposition: 'inline',
            lastUpdatedOn: '2020-02-07T11:48:59.726+0000',
            dialcodeRequired: 'No',
            editorVersion: 3,
            lastStatusChangedOn: '2020-02-07T11:49:09.515+0000',
            creator: 'Reviewer User',
            os: [
              'All'
            ],
            questionCategories: [
              'VSA'
            ],
            pkgVersion: 1,
            versionKey: '1581076139726',
            idealScreenDensity: 'hdpi',
            framework: 'NCFCOPY',
            depth: 2,
            s3Key: 'ecar_files/do_112952172973195264136/practice-questionset_1581076146372_do_112952172973195264136_1.0.ecar',
            lastSubmittedOn: '2020-02-07T11:48:15.696+0000',
            createdBy: '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
            additionalCategory: [
              'Practice Question Set'
            ],
            compatibilityLevel: 1,
            itemSetPreviewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112952172973195264136/artifact/do_112952172973195264136_1581076141574.pdf',
            board: 'NCERT',
            programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
            resourceType: 'Learn',
            relationalMetadata: {
              relName: 'xxx',
              relTrackable: false
            }
          }
        ],
        contentDisposition: 'inline',
        lastUpdatedOn: '2022-12-19T07:55:33.685+0000',
        contentEncoding: 'gzip',
        generateDIALCodes: 'No',
        contentType: 'TextBookUnit',
        dialcodeRequired: 'No',
        identifier: 'do_113688914129838080131',
        lastStatusChangedOn: '2022-12-14T09:27:05.615+0000',
        audience: [
          'Student'
        ],
        os: [
          'All'
        ],
        visibility: 'Parent',
        discussionForum: {
          enabled: 'No'
        },
        index: 3,
        mediaType: 'content',
        osId: 'org.ekstep.launcher',
        languageCode: [
          'en'
        ],
        version: 2,
        versionKey: '1671010025615',
        license: 'CC BY 4.0',
        idealScreenDensity: 'hdpi',
        depth: 1,
        compatibilityLevel: 1,
        name: 'Textbook Unit',
        attributions: [],
        status: 'Draft'
      }
    ],
    appId: 'dev.sunbird.portal',
    contentEncoding: 'gzip',
    collaborators: [
      '88ffb6eb-33bf-4f96-ad3a-75c15e5a04ff'
    ],
    lockKey: '29312068-34bb-49c8-b10a-3021ba034da7',
    generateDIALCodes: 'Yes',
    totalCompressedSize: 12221717,
    mimeTypesCount: '{"application/pdf":2,"application/vnd.ekstep.ecml-archive":2,"video/mp4":2,"video/webm":1,"application/epub":2,"application/vnd.ekstep.content-collection":1}',
    sYS_INTERNAL_LAST_UPDATED_ON: '2022-08-04T08:09:18.513+0000',
    contentType: 'TextBook',
    se_gradeLevels: [
      'Class 1'
    ],
    trackable: {
      enabled: 'No',
      autoBatch: 'No'
    },
    identifier: 'do_113367576496021504151',
    audience: [
      'Student'
    ],
    se_boardIds: [
      'ekstep_ncert_k-12_board_cbse'
    ],
    subjectIds: [
      'ekstep_ncert_k-12_subject_mathematics'
    ],
    toc_url: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113367576496021504151/artifact/do_113367576496021504151_toc.json',
    visibility: 'Default',
    contentTypesCount: '{"PedagogyFlow":1,"TextBookUnit":1,"PracticeQuestionSet":2,"eTextBook":3,"PreviousBoardExamPapers":1,"ClassroomTeachingVideo":2}',
    author: 'N11',
    consumerId: '7411b6bd-89f3-40ec-98d1-229dc64ce77d',
    childNodes: [
      'do_11317444580121804812898',
      'do_113367577248145408152',
      'do_11314250039970201615',
      'do_11341789596678553611557',
      'do_11342495269322752016475',
      'do_113061161270198272154',
      'do_112813424626933760118',
      'do_11342495905869004816476',
      'do_1134128135522058241655',
      'do_11342001918241177611995',
      'do_11359060047881830411739',
      'do_113595447552679936140',
      'do_1136287611140259841136',
      'do_113296874922852352184',
      'do_112952172973195264136',
      'do_113688914129838080131'
    ],
    discussionForum: {
      enabled: 'No'
    },
    mediaType: 'content',
    osId: 'org.ekstep.quiz.app',
    lastPublishedBy: '874ed8a5-782e-4f6c-8f36-e0288455901e',
    languageCode: [
      'en'
    ],
    version: 2,
    se_subjects: [
      'Mathematics'
    ],
    license: 'CC BY 4.0',
    prevState: 'Review',
    qrCodeProcessId: 'ffa21ff5-3c00-4a0c-b42e-ac1406e49fbe',
    size: 65520,
    lastPublishedOn: '2021-12-13T10:49:43.588+0000',
    name: 'QR Testing',
    mediumIds: [
      'ekstep_ncert_k-12_medium_english'
    ],
    status: 'Review',
    code: 'org.sunbird.5bY2Um',
    credentials: {
      enabled: 'No'
    },
    prevStatus: 'Processing',
    description: 'QR Testing',
    medium: [
      'English'
    ],
    idealScreenSize: 'normal',
    createdOn: '2021-09-16T09:24:00.244+0000',
    reservedDialcodes: {
      A3L9W2: 2,
      L5Y2N8: 3,
      E9Z3R6: 0,
      U5R5M1: 1,
      I3X4Y5: 4,
      X7S3C4: 5,
      C9A3A9: 6,
      D5M7L5: 7,
      M2B6Z4: 8,
      I8D5S5: 9,
      J8Y8V7: 10,
      W5K3K3: 11,
      B1V1Z9: 12
    },
    se_boards: [
      'CBSE'
    ],
    se_mediumIds: [
      'ekstep_ncert_k-12_medium_english'
    ],
    copyrightYear: 2021,
    contentDisposition: 'inline',
    additionalCategories: [
      'Textbook'
    ],
    lastUpdatedOn: '2022-01-10T12:10:12.093+0000',
    dialcodeRequired: 'No',
    lastStatusChangedOn: '2021-12-20T06:54:51.584+0000',
    createdFor: [
      '01309282781705830427'
    ],
    creator: 'N11',
    os: [
      'All'
    ],
    se_subjectIds: [
      'ekstep_ncert_k-12_subject_mathematics'
    ],
    se_FWIds: [
      'ekstep_ncert_k-12'
    ],
    pkgVersion: 1,
    versionKey: '1671436534374',
    idealScreenDensity: 'hdpi',
    framework: 'ekstep_ncert_k-12',
    depth: 0,
    s3Key: 'content/do_113367576496021504151/artifact/do_113367576496021504151_toc.json',
    boardIds: [
      'ekstep_ncert_k-12_board_cbse'
    ],
    lastSubmittedOn: '2022-04-28T10:03:18.196+0000',
    createdBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
    compatibilityLevel: 1,
    leafNodesCount: 9,
    userConsent: 'Yes',
    gradeLevelIds: [
      'ekstep_ncert_k-12_gradelevel_class1'
    ],
    board: 'CBSE',
    resourceType: 'Book'
  }
};
