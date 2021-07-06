import { IEditorConfig } from 'collection-editor-library/lib/interfaces/editor';
export let editorConfig: IEditorConfig | undefined;
editorConfig = {
    context: {
    framework: 'test',
      user: {
        id: '5a587cc1-e018-4859-a0a8-e842650b9d64',
        name: 'Vaibhav',
        orgIds: [
          '01309282781705830427'
        ]
      },
      identifier: 'do_113274017771085824116',
      channel: '01307938306521497658',
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
        l1: '01307938306521497658'
      },
      tags: [
        '01307938306521497658'
      ],
      cdata: [
        {
          id: '01307938306521497658',
          type: 'sourcing_organization'
        },
        {
          type: 'project',
          id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737'
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
      env: 'question_set',
      cloudStorageUrls: [
        'https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/',
        'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
        'https://dockstorage.blob.core.windows.net/sunbird-content-dock/'
      ],
      mode: 'edit',
    },
    config: {
      mode: 'edit',
      maxDepth: 2,
      objectType: 'Collection',
      primaryCategory: 'Course',
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
      collection:{
        maxContentsLimit: 10
      },
      questionSet:{
        maxQuestionsLimit: 10
      },
      contentPolicyUrl: '/term-of-use.html'
    }
  }

export const nativeElement = `<div><ul id="ft-id-1" class="ui-fancytree fancytree-container fancytree-plain fancytree-ext-glyph fancytree-ext-dnd5 fancytree-connectors" tabindex="0" role="tree" aria-multiselectable="true"><li role="treeitem" aria-expanded="false" aria-selected="false" class="fancytree-lastsib"><span class="fancytree-node fancytree-folder fancytree-has-children fancytree-lastsib fancytree-exp-cl fancytree-ico-cf" draggable="true"><span role="button" class="fancytree-expander fa fa-caret-right"></span><span role="presentation" class="fancytree-custom-icon fa fa-book"></span><span class="fancytree-title" title="SB23410q" style="width:15em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden">SB23410q</span><span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0" style="display: none;"> <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id="contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addchild" class="item">Add Child</div>
  </span>
  </span></span></li></ul></div>`;

export const getCategoryDefinitionResponse = {
    id: 'api.object.category.definition.read',
    ver: '3.0',
    ts: '2021-06-23T11:43:39ZZ',
    params: {
        resmsgid: '7efb262e-1b7e-44b7-8fe8-ceddc963cf47',
        msgid: null,
        err: null,
        status: 'successful',
        errmsg: null
    },
    responseCode: 'OK',
    result: {
        objectCategoryDefinition: {
            identifier: 'obj-cat:multiple-choice-question_question_all',
            objectMetadata: {
                config: {},
                schema: {
                    properties: {
                        mimeType: {
                            type: 'string',
                            enum: [
                                'application/vnd.sunbird.question'
                            ]
                        },
                        interactionTypes: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: [
                                    'choice'
                                ]
                            }
                        },
                        generateDIALCodes: {
                          default: 'Yes'
                        }
                    }
                }
            },
            languageCode: [],
            name: 'Multiple Choice Question',
            forms: {}
        }
    }
}

export const editorServiceSelectedChildren = {
    mimeType: 'application/vnd.sunbird.question',
    primaryCategory: 'Multiple Choice Question',
    interactionType: 'choice'
}

export const categoryDefinition = {
  result: {
    objectCategoryDefinition: {
      forms: {
        unitMetadata: {
          properties: {code: 'name', editable: true}
        },
        create: {
          properties: {code: 'name', editable: true}
        },
        search: {
          properties: {code: 'name', editable: true}
        },
        childMetadata: {
          properties: {code: 'name', editable: true}
        }
      }
    }
  }
}

export const hierarchyResponse = [{ result: {
  content: {
      ownershipType: [
          'createdBy'
      ],
      copyright: 'NIT123',
      keywords: [
          'test course'
      ],
      subject: [
          'English',
          'Hindi'
      ],
      targetMediumIds: [
          'nit_k-12_medium_english'
      ],
      channel: '01309282781705830427',
      organisation: [
          'NIT'
      ],
      language: [
          'English'
      ],
      mimeType: 'application/vnd.ekstep.content-collection',
      targetGradeLevelIds: [
          'nit_k-12_gradelevel_grade-1'
      ],
      objectType: 'Content',
      // tslint:disable-next-line:max-line-length
      appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113253856016146432127/artifact/do_113253856016146432127_1617902346121_image.jpg',
      primaryCategory: 'Course',
      children: [
          {
              ownershipType: [
                  'createdBy'
              ],
              parent: 'do_113316550746677248131',
              code: '89be24d9-d098-39c0-9680-0d0e3df3c647',
              keywords: [
                  'unit-1'
              ],
              credentials: {
                  enabled: 'No'
              },
              channel: '01309282781705830427',
              description: 'unit-1',
              language: [
                  'English'
              ],
              mimeType: 'application/vnd.ekstep.content-collection',
              idealScreenSize: 'normal',
              createdOn: '2021-07-06T07:15:40.525+0000',
              objectType: 'Content',
              primaryCategory: 'Course Unit',
              children: [
                  {
                      ownershipType: [
                          'createdBy'
                      ],
                      parent: 'do_113316552626380800133',
                      code: 'd6067beb-01f9-a634-13a4-c453fc3d05d9',
                      keywords: [
                          'unit-1.1'
                      ],
                      credentials: {
                          enabled: 'No'
                      },
                      channel: '01309282781705830427',
                      description: 'unit-1.1',
                      language: [
                          'English'
                      ],
                      mimeType: 'application/vnd.ekstep.content-collection',
                      idealScreenSize: 'normal',
                      createdOn: '2021-07-06T07:15:50.428+0000',
                      objectType: 'Content',
                      primaryCategory: 'Course Unit',
                      children: [
                          {
                              ownershipType: [
                                  'createdBy'
                              ],
                              parent: 'do_113316552707506176135',
                              unitIdentifiers: [
                                  'do_1133124409146736641472'
                              ],
                              copyright: '2021',
                              previewUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              subject: [
                                  'Mathematics'
                              ],
                              channel: '01309282781705830427',
                              downloadUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1133124455783546881476/content-name-is-more-than-30-charcater_1625054501658_do_1133124455783546881476_1.0.ecar',
                              language: [
                                  'English'
                              ],
                              source: 'https://dock.sunbirded.org/api/content/v1/read/do_1133124455783546881476',
                              mimeType: 'application/pdf',
                              variants: {
                                  spine: {
                                      ecarUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1133124455783546881476/content-name-is-more-than-30-charcater_1625054501895_do_1133124455783546881476_1.0_spine.ecar',
                                      size: 1487
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
                              appId: 'dev.dock.portal',
                              contentEncoding: 'identity',
                              artifactUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              sYS_INTERNAL_LAST_UPDATED_ON: '2021-06-30T12:01:42.209+0000',
                              contentType: 'eTextBook',
                              se_gradeLevels: [
                                  'Class 1'
                              ],
                              trackable: {
                                  enabled: 'No',
                                  autoBatch: 'No'
                              },
                              identifier: 'do_1133124455783546881476',
                              audience: [
                                  'Student'
                              ],
                              visibility: 'Default',
                              author: 'Vai',
                              consumerId: '273f3b18-5dda-4a27-984a-060c7cd398d3',
                              discussionForum: {
                                  enabled: 'Yes'
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
                                  'Mathematics'
                              ],
                              license: 'CC BY 4.0',
                              prevState: 'Review',
                              size: 14040,
                              lastPublishedOn: '2021-06-30T12:01:41.657+0000',
                              name: 'content name is more than 30 charcater',
                              status: 'Live',
                              code: '92db93d1-9a9b-61aa-9b6d-66bbb979f4ad',
                              credentials: {
                                  enabled: 'No'
                              },
                              prevStatus: 'Processing',
                              origin: 'do_1133124455783546881476',
                              streamingUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              medium: [
                                  'Hindi'
                              ],
                              idealScreenSize: 'normal',
                              createdOn: '2021-06-30T12:01:38.105+0000',
                              se_boards: [
                                  'CBSE'
                              ],
                              processId: '7b4d85eb-1167-4e99-9941-2091961dfac8',
                              contentDisposition: 'inline',
                              lastUpdatedOn: '2021-06-30T12:01:41.299+0000',
                              originData: {
                                  identifier: 'do_1133124455783546881476',
                                  repository: 'https://dock.sunbirded.org/api/content/v1/read/do_1133124455783546881476'
                              },
                              collectionId: 'do_1133124409135595521471',
                              dialcodeRequired: 'No',
                              lastStatusChangedOn: '2021-06-30T12:01:42.198+0000',
                              createdFor: [
                                  '01309282781705830427'
                              ],
                              creator: 'Vai',
                              os: [
                                  'All'
                              ],
                              cloudStorageKey: 'content/do_1133124455783546881476/artifact/do_1133124455783546881476_1625054498447_dummy.pdf',
                              se_FWIds: [
                                  'ekstep_ncert_k-12'
                              ],
                              pkgVersion: 1,
                              versionKey: '1625054501299',
                              idealScreenDensity: 'hdpi',
                              framework: 'ekstep_ncert_k-12',
                              depth: 3,
                              s3Key: 'ecar_files/do_1133124455783546881476/content-name-is-more-than-30-charcater_1625054501658_do_1133124455783546881476_1.0.ecar',
                              lastSubmittedOn: '2021-06-30T12:01:39.984+0000',
                              createdBy: 'd3d05422-1670-4c3e-9051-13c306e89a95',
                              compatibilityLevel: 4,
                              board: 'CBSE',
                              programId: '537c2280-d999-11eb-882d-db3e4f86a45f'
                          }
                      ],
                      contentDisposition: 'inline',
                      lastUpdatedOn: '2021-07-06T07:15:50.428+0000',
                      contentEncoding: 'gzip',
                      contentType: 'CourseUnit',
                      dialcodeRequired: 'No',
                      trackable: {
                          enabled: 'No',
                          autoBatch: 'No'
                      },
                      identifier: 'do_113316552707506176135',
                      lastStatusChangedOn: '2021-07-06T07:15:50.428+0000',
                      audience: [
                          'Student'
                      ],
                      os: [
                          'All'
                      ],
                      visibility: 'Parent',
                      discussionForum: {
                          enabled: 'Yes'
                      },
                      index: 1,
                      mediaType: 'content',
                      osId: 'org.ekstep.launcher',
                      languageCode: [
                          'en'
                      ],
                      version: 2,
                      versionKey: '1625555750428',
                      license: 'CC BY 4.0',
                      idealScreenDensity: 'hdpi',
                      depth: 2,
                      compatibilityLevel: 1,
                      name: 'unit-1.1',
                      timeLimits: {},
                      status: 'Draft',
                      level: 3
                  }
              ],
              contentDisposition: 'inline',
              lastUpdatedOn: '2021-07-06T07:15:40.525+0000',
              contentEncoding: 'gzip',
              contentType: 'CourseUnit',
              dialcodeRequired: 'No',
              trackable: {
                  enabled: 'No',
                  autoBatch: 'No'
              },
              identifier: 'do_113316552626380800133',
              lastStatusChangedOn: '2021-07-06T07:15:40.525+0000',
              audience: [
                  'Student'
              ],
              os: [
                  'All'
              ],
              visibility: 'Parent',
              discussionForum: {
                  enabled: 'Yes'
              },
              index: 1,
              mediaType: 'content',
              osId: 'org.ekstep.launcher',
              languageCode: [
                  'en'
              ],
              version: 2,
              versionKey: '1625555740525',
              license: 'CC BY 4.0',
              idealScreenDensity: 'hdpi',
              depth: 1,
              compatibilityLevel: 1,
              name: 'unit-1',
              timeLimits: {},
              status: 'Draft',
              level: 2
          }
      ],
      contentEncoding: 'gzip',
      collaborators: [
          '5c3a2a46-4830-4ade-a4cd-b6780635569c'
      ],
      lockKey: '49d5e059-5ff7-444c-bcf5-84e293f8da7c',
      generateDIALCodes: 'Yes',
      contentType: 'Course',
      trackable: {
          enabled: 'Yes',
          autoBatch: 'Yes'
      },
      identifier: 'do_113316550746677248131',
      audience: [
          'Student'
      ],
      subjectIds: [
          'nit_k-12_subject_english',
          'nit_k-12_subject_hindi'
      ],
      visibility: 'Default',
      consumerId: '273f3b18-5dda-4a27-984a-060c7cd398d3',
      childNodes: [
          'do_1133124455783546881476',
          'do_113316552707506176135',
          'do_113316552626380800133'
      ],
      discussionForum: {
          enabled: 'Yes'
      },
      mediaType: 'content',
      osId: 'org.ekstep.quiz.app',
      languageCode: [
          'en'
      ],
      version: 2,
      license: 'CC BY 4.0',
      name: 'test course',
      targetBoardIds: [
          'nit_k-12_board_cbse'
      ],
      status: 'Draft',
      code: 'org.sunbird.Yj12wV',
      credentials: {
          enabled: 'Yes'
      },
      description: 'test course1',
      idealScreenSize: 'normal',
      createdOn: '2021-07-06T07:11:51.103+0000',
      targetSubjectIds: [
          'nit_k-12_subject_english'
      ],
      copyrightYear: 2021,
      contentDisposition: 'inline',
      additionalCategories: [
          'Lesson Plan',
          'Textbook'
      ],
      lastUpdatedOn: '2021-07-06T07:23:08.357+0000',
      dialcodeRequired: 'No',
      lastStatusChangedOn: '2021-07-06T07:11:51.103+0000',
      createdFor: [
          '01309282781705830427'
      ],
      creator: 'N11',
      os: [
          'All'
      ],
      targetFWIds: [
          'nit_k-12'
      ],
      versionKey: '1625556188357',
      idealScreenDensity: 'hdpi',
      framework: 'nit_k-12',
      depth: 0,
      createdBy: '5a587cc1-e018-4859-a0a8-e842650b9d64',
      compatibilityLevel: 1,
      userConsent: 'Yes',
      timeLimits: '{}',
      resourceType: 'Course',
      level: 1
  }
  }
}]
