export const collectionEditorConfig = {
  context: {
      identifier: 'do_213841189342707712129',
      channel: '01329314824202649627',
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