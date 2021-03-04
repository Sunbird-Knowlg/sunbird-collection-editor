export const collectionEditorConfig = {
    context: {
      identifier: 'do_113209708218679296171',
      channel: '01307938306521497658',
      framework: 'ekstep_ncert_k-12', // added temp use this : TPD targetFWIds: ['tn_k-12'], // TODO::
      targetFWIds: ['tn_k-12'],
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
      defaultLicense: [
        {
          identifier: 'cc-by-4.0',
          lastStatusChangedOn: '2020-03-22T16:03:38.003+0000',
          consumerId: '9f1bd4a1-c617-422b-8d5a-d24c7d3ade2e',
          description: 'For details see below:',
          graph_id: 'domain',
          nodeType: 'DATA_NODE',
          createdOn: '2020-03-22T16:03:38.003+0000',
          url: 'https://creativecommons.org/licenses/by/4.0/legalcode',
          versionKey: '1584893018003',
          objectType: 'License',
          name: 'CC BY 4.0',
          lastUpdatedOn: '2020-03-22T16:03:38.003+0000',
          status: 'Live',
          node_id: 60
        }
      ],
      endpoint: '/data/v3/telemetry',
      env: 'question_set',
      aws_s3_urls : [
        'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/',
        'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
        'https://dockstorage.blob.core.windows.net/sunbird-content-dock/']
    },
    config: {
      mode: 'edit',
      maxDepth: 2,
      objectType: 'Collection',
      primaryCategory: 'Course',
      isRoot: true,
      iconClass: 'fa fa-book',
      children: {},
      hierarchy: {
          level1: {
              name: 'Module',
              type: 'Unit',
              mimeType: 'application/vnd.ekstep.content-collection',
              contentType: 'Course Unit',
              iconClass: 'fa fa-folder-o',
              children: {}
          },
          level2: {
              name: 'Sub-Module',
              type: 'Unit',
              mimeType: 'application/vnd.ekstep.content-collection',
              contentType: 'Course Unit',
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


export const questionEditorConfig = {
    context: {
      user: {
        id: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
        name: 'Vaibahv Bhuva',
        orgIds: ['01307938306521497658']
      },
      identifier: 'do_1132125506761932801130',
      authToken: ' ',
      sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
      did: '7e85b4967aebd6704ba1f604f20056b6',
      uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
      channel: '01307938306521497658',
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
      defaultLicense: [
        {
          identifier: 'cc-by-4.0',
          lastStatusChangedOn: '2020-03-22T16:03:38.003+0000',
          consumerId: '9f1bd4a1-c617-422b-8d5a-d24c7d3ade2e',
          description: 'For details see below:',
          graph_id: 'domain',
          nodeType: 'DATA_NODE',
          createdOn: '2020-03-22T16:03:38.003+0000',
          url: 'https://creativecommons.org/licenses/by/4.0/legalcode',
          versionKey: '1584893018003',
          objectType: 'License',
          name: 'CC BY 4.0',
          lastUpdatedOn: '2020-03-22T16:03:38.003+0000',
          status: 'Live',
          node_id: 60
        }
      ],
      endpoint: '/data/v3/telemetry',
      userData: {
        firstName: 'Vaibhav',
        lastName: 'Bhuva',
      },
      env: 'questionSetLibrary',
      framework: 'ekstep_ncert_k-12',
      cloudStorageUrls : ['https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/', 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
      'https://dockstorage.blob.core.windows.net/sunbird-content-dock/'],
      board: 'CBSE',
      medium: ['English'],
      gradeLevel: ['Class 1'],
      subject: ['Environmental Studies'],
      topic: ['Hello'],
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
        save_collection_btn_label: 'Save as Daft',
      }
    },
    config: {
      mode: 'edit', // edit / review / read
      maxDepth: 0,
      objectType: 'QuestionSet',
      primaryCategory: 'Practice Question Set',
      isRoot: true,
      iconClass: 'fa fa-book',
      children: {
        Question: [
          'Multiple Choice Question',
          'Subjective Question'
        ]
      },
      hierarchy: {}
    }
  };
