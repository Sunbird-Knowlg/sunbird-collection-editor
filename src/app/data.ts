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

export const questionEditorConfig = {
  context: {
    user: {
      id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      fullName: 'Vaibahv Bhuva',
      firstName: 'Vaibhav',
      lastName: 'Bhuva',
      orgIds: ['01309282781705830427']
    },
    identifier: 'do_1132393548335759361558', // do_11330102570702438417
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
    mode: 'edit', // edit / review / read / sourcingReview // orgReview
    editableFields: {
      //sourcingreview: ['instructions'],
      orgreview: ['name', 'instructions', 'learningOutcome'],
      review: ['name', 'description'],
    },
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

export const collectionEditorConfig = {
  context: {
      identifier: 'do_113345692849029120131',
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
      framework: 'ekstep_ncert_k-12'
  },
  config: {
      mode: 'edit',
      showAddCollaborator: true,
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
