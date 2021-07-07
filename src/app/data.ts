export const collectionEditorConfig = {
  context: {
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    identifier: 'do_113301063790198784120',
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
    maxDepth: 2,
    objectType: 'Collection',
    primaryCategory: 'Course', // Professional Development Course, Curriculum Course
    isRoot: true,
    dialcodeMinLength: 2,
    dialcodeMaxLength: 250,
    iconClass: 'fa fa-book',
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
        showAddCollaborator: true,
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

export const questionEditorConfig = {
  context: {
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    identifier: 'do_11330102570702438417', // do_1132393548335759361558
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
    }
  },
  config: {
    mode: 'edit', // edit / review / read / sourcingReview
    maxDepth: 0,
    objectType: 'QuestionSet',
    primaryCategory: 'Practice Question Set',
    isRoot: true,
    iconClass: 'fa fa-book',
    showAddCollaborator: false,
    children: {
      Question: [
        'Multiple Choice Question',
        'Subjective Question'
      ]
    },
    hierarchy: {
      // level1: {
      //   name: 'Section',
      //   type: 'Unit',
      //   mimeType: 'application/vnd.sunbird.questionset',
      //   primaryCategory: 'Practice Question Set',
      //   iconClass: 'fa fa-folder-o',
      //   children: {
      //     Question: [
      //       'Multiple Choice Question',
      //       'Subjective Question'
      //     ]
      //   }
      // },
      // level2: {
      //   name: 'Sub Section',
      //   type: 'Unit',
      //   mimeType: 'application/vnd.sunbird.questionset',
      //   primaryCategory: 'Practice Question Set',
      //   iconClass: 'fa fa-folder-o',
      //   children: {
      //     Question: [
      //       'Multiple Choice Question',
      //       'Subjective Question'
      //     ]
      //   }
      // },
      // level3: {
      //   name: 'Sub Section',
      //   type: 'Unit',
      //   mimeType: 'application/vnd.sunbird.questionset',
      //   primaryCategory: 'Practice Question Set',
      //   iconClass: 'fa fa-folder-o',
      //   children: {
      //     Question: [
      //       'Subjective Question'
      //     ]
      //   }
      // }
    },
    contentPolicyUrl: '/term-of-use.html'
  }
};
