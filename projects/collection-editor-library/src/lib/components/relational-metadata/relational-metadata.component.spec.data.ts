export const mockData = {
  relationalMetadataConfig: [{
      name: 'First Section',
      fields: [
      {
          code: 'relName',
          dataType: 'text',
          description: 'Name of the content',
          editable: true,
          inputType: 'text',
          label: 'Title',
          name: 'Name',
          placeholder: 'Title',
          renderingHints: {
              class: 'sb-g-col-lg-1 required'
          },
          required: true,
          visible: true,
          validations: [
              {
                  type: 'max',
                  value: '120',
                  message: 'Input is Exceeded'
              },
              {
                  type: 'required',
                  message: 'Title is required'
              }
          ]
      }
      ]
  }],
  contentMetadata: {
    relationalMetadata: {
      relName: 'Hello'
    }
  },
  editorConfig: {
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
      cdata: [],
      timeDiff: 5,
      objectRollup: {
        l1: 'do_113140468925825024117',
        l2: 'do_113140468926914560125'
      },
      host: '',
      defaultLicense: 'CC BY 4.0',
      endpoint: '/data/v3/telemetry',
      env: 'question_set'
    },
    config: {
      mode: 'review'
    }
  }
};
