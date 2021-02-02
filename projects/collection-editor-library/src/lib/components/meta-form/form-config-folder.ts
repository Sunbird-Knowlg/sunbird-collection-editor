export const formConfigFolder = [
  {
    name: 'First Section',
    fields: [
      {
        code: 'name',
        dataType: 'text',
        description: 'Name of the content',
        editable: true,
        inputType: 'text',
        label: 'Title',
        name: 'Title',
        placeholder: 'Title',
        renderingHints: {
          class: 'sb-g-col-lg-1'
        },
        required: true,
        visible: true,
        validations: [{
          type: 'max',
          value: '120',
          message: 'Input is Exceeded'
        }, {
          type: 'required',
          message: 'Title is required'
        }]
      },
      {
        code: 'description',
        dataType: 'text',
        description: 'Description of the content',
        default: 'asdadad',
        editable: true,
        inputType: 'textarea',
        label: 'Description',
        name: 'Description',
        placeholder: 'Description',
        renderingHints: {
          class: 'sb-g-col-lg-1'
        },
        required: true,
        visible: true,
        validations: [{
          type: 'max',
          value: '120',
          message: 'Input is Exceeded'
        }, {
          type: 'required',
          message: 'Title is required'
        }]
      },
      {
        code: 'keywords',
        visible: true,
        editable: true,
        dataType: 'list',
        default: ['one', 'two'],
        name: 'Keywords',
        renderingHints: {
          class: 'sb-g-col-lg-1'
        },
        index: 3,
        description: 'Keywords for the content',
        inputType: 'keywords',
        label: 'keywords',
        placeholder: 'Enter Keywords',
        required: false,
        validations: [{
          type: 'required',
          message: 'Keyword is required'
        }]
      },
      {
        code: 'topic',
        visible: true,
        depends: [],
        editable: true,
        dataType: 'list',
        default: ['ONE', 'TWO'],
        renderingHints: {},
        name: 'Topic',
        description: 'Choose a Topics',
        index: 11,
        inputType: 'topicselector',
        label: 'Topics',
        placeholder: 'Choose Topics',
        required: false,
        validations: [{
          type: 'required',
          message: 'Topic is required'
        }]
      }
    ]
  }
];
