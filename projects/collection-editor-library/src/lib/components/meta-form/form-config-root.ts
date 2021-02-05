export const formConfigRoot = [
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
        }
      ]
    },
    {
      name: 'Second Section',
      fields: [
        {
          code: 'primaryCategory',
          dataType: 'text',
          description: 'Type',
          editable: true,
          index: 4,
          renderingHints: {

          },
          inputType: 'select',
          label: 'Type',
          name: 'Type',
          placeholder: '',
          required: true,
          visible: true,
          validations: [{
            type: 'required',
            message: 'Board is required'
          }]
        },
        {
          code: 'additionalCategories',
          dataType: 'list',
          depends: ['primaryCategory'],
          description: 'Additonal Category of the Content',
          editable: true,
          index: 5,
          default: ['Classroom Teaching Video',
            'Concept Map'
          ],
          inputType: 'nestedselect',
          label: 'Additional Category',
          name: 'Additional Category',
          placeholder: 'Select Additional Category',
          renderingHints: {
          },
          range: ['Textbook', 'Lesson Plan'],
          required: false,
          visible: true
        }
      ]
    },
    {
      name: 'Organisation Framework Terms',
      fields: [
        {
          code: 'boardIds',
          default: 'State (Gujarat)',
          visible: true,
          depends: [],
          editable: true,
          dataType: 'text',
          sourceCategory: 'board',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: 'Board',
          index: 6,
          label: 'Board/Syllabus',
          required: true,
          name: 'Board',
          output: 'identifier',
          inputType: 'nestedselect',
          placeholder: 'Select Board/Syllabus',
          validations: [{
            type: 'required',
            message: 'Board is required'
          }],
        },
        {
          code: 'mediumIds',
          visible: true,
          depends: ['boardIds'],
          editable: true,
          default: 'Hindi',
          dataType: 'list',
          sourceCategory: 'medium',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: '',
          index: 7,
          label: 'Medium',
          required: true,
          name: 'Medium',
          output: 'identifier',
          inputType: 'select',
          placeholder: 'Select Medium',
          validations: [{
            type: 'required',
            message: 'Medium is required'
          }],
        },
        {
          code: 'gradeLevelIds',
          visible: true,
          depends: ['boardIds', 'mediumIds'],
          editable: true,
          default: 'Grade 12',
          dataType: 'list',
          sourceCategory: 'gradeLevel',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: 'Class',
          index: 8,
          label: 'Class',
          output: 'identifier',
          required: true,
          name: 'Class',
          inputType: 'select',
          placeholder: 'Select Class',
        },
        {
          code: 'subjectIds',
          visible: true,
          depends: ['boardIds', 'mediumIds', 'gradeLevelIds'],
          editable: true,
          default: 'English',
          dataType: 'list',
          sourceCategory: 'subject',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: '',
          index: 9,
          label: 'Subject',
          output: 'identifier',
          required: true,
          name: 'Subject',
          inputType: 'select',
          placeholder: 'Select Subject',
        },
        {
          code: 'topicsIds',
          visible: true,
          depends: ['boardIds', 'mediumIds', 'gradeLevelIds', 'subjectIds'],
          editable: true,
          dataType: 'list',
          default: ['ONE', 'TWO'],
          sourceCategory: 'topic',
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
    },
    {
      name: 'Target Framework Terms',
      fields: [
        {
          code: 'targetBoardIds',
          default: 'State (Gujarat)',
          visible: true,
          depends: [],
          editable: true,
          dataType: 'text',
          sourceCategory: 'board',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: 'Board',
          index: 6,
          label: 'Board/Syllabus',
          required: true,
          name: 'Board/Syllabus',
          output: 'identifier',
          inputType: 'select',
          placeholder: 'Select Board/Syllabus',
          validations: [{
            type: 'required',
            message: 'Board is required'
          }],
        },
        {
          code: 'targetMediumIds',
          visible: true,
          depends: ['targetBoardIds'],
          editable: true,
          default: 'Hindi',
          dataType: 'list',
          sourceCategory: 'medium',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: '',
          index: 7,
          label: 'Medium',
          required: true,
          output: 'identifier',
          name: 'Medium',
          inputType: 'select',
          placeholder: 'Select Medium',
          validations: [{
            type: 'required',
            message: 'Medium is required'
          }],
        },
        {
          code: 'targetGradeLevelIds',
          visible: true,
          depends: ['targetBoardIds', 'targetMediumIds'],
          editable: true,
          default: 'Grade 12',
          dataType: 'list',
          sourceCategory: 'gradeLevel',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: 'Class',
          index: 8,
          label: 'Class',
          output: 'identifier',
          required: true,
          name: 'Class',
          inputType: 'select',
          placeholder: 'Select Class',
        },
        {
          code: 'targetSubjectIds',
          visible: true,
          depends: ['targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds'],
          editable: true,
          default: 'English',
          dataType: 'list',
          sourceCategory: 'subject',
          renderingHints: {class: 'sb-g-col-lg-1'},
          description: '',
          index: 9,
          label: 'Subject',
          output: 'identifier',
          required: true,
          name: 'Subject',
          inputType: 'select',
          placeholder: 'Select Subject',
        },
        {
          code: 'targetTopicIds',
          visible: true,
          depends: ['targetBoardIds', 'targetMediumIds', 'targetGradeLevelIds', 'targetSubjectIds'],
          editable: true,
          dataType: 'list',
          default: [],
          sourceCategory: 'topic',
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
    },
    {
      name: 'Fourth Section',
      fields: [
        {
          code: 'author',
          dataType: 'text',
          description: 'Author of the content',
          editable: true,
          inputType: 'text',
          label: 'Author',
          name: 'Author',
          placeholder: 'Author',
          renderingHints: {
            class: 'sb-g-col-lg-1'
          },
          required: true,
          visible: true,
        },
        {
          code: 'attributions',
          dataType: 'text',
          description: 'Attributions',
          editable: true,
          inputType: 'text',
          label: 'Attributions',
          name: 'Attributions',
          placeholder: 'Attributions',
          renderingHints: {
            class: 'sb-g-col-lg-1'
          },
          required: true,
          visible: true,
        },
        {
          code: 'copyright',
          dataType: 'text',
          description: 'Copyright & year',
          editable: true,
          inputType: 'text',
          label: 'Copyright & year',
          name: 'Copyright & year',
          placeholder: 'Copyright & year',
          renderingHints: {
            class: 'sb-g-col-lg-1'
          },
          required: true,
          visible: true,
        },
        {
          code: 'license',
          dataType: 'text',
          description: 'license',
          editable: true,
          inputType: 'select',
          label: 'license',
          name: 'license',
          placeholder: 'Select license',
          renderingHints: {
            class: 'sb-g-col-lg-1'
          },
          required: true,
          visible: true,
        }
      ]
    }
  ];
