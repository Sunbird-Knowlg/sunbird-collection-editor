import { Output } from '@angular/core';
export const libraryFilterConfig = [
  {
    name: 'LibrayFilters',
    fields: [
      {
        code: 'primaryCategory',
        dataType: 'text',
        description: 'Type',
        editable: false,
        index: 4,
        renderingHints: { class: 'sb-g-col-lg-2' },
        inputType: 'nestedselect',
        label: 'Type',
        name: 'Type',
        placeholder: '',
        required: false,
        visible: true,
        section: {
          index: 2,
          name: ''
        }
      },
      {
        code: 'board',
        default: '',
        visible: true,
        depends: [],
        editable: true,
        dataType: 'text',
        renderingHints: { class: 'sb-g-col-lg-2' },
        description: 'Board',
        index: 6,
        label: 'Board/Syllabus',
        required: false,
        name: 'Board/Syllabus',
        inputType: 'nestedselect',
        placeholder: 'Select Board/Syllabus',
        section: {
          index: 3,
          name: ''
        },
        output:'name'
      },
      {
        code: 'medium',
        visible: true,
        depends: ['board'],
        editable: true,
        default: '',
        dataType: 'list',
        renderingHints: { class: 'sb-g-col-lg-2' },
        description: '',
        index: 7,
        label: 'Medium',
        required: false,
        name: 'Medium',
        inputType: 'nestedselect',
        placeholder: 'Select Medium',
        section: {
          index: 3,
          name: ''
        },
        output:'name'
      },
      {
        code: 'gradeLevel',
        visible: true,
        depends: ['board', 'medium'],
        editable: true,
        default: '',
        dataType: 'list',
        renderingHints: { class: 'sb-g-col-lg-2' },
        description: 'Class',
        index: 8,
        label: 'Class',
        required: false,
        name: 'Class',
        inputType: 'nestedselect',
        placeholder: 'Select Class',
        section: {
          index: 3,
          name: ''
        },
        output:'name'
      }, {
        code: 'subject',
        visible: true,
        depends: ['board', 'medium', 'gradeLevel'],
        editable: true,
        default: '',
        dataType: 'list',
        renderingHints: { class: 'sb-g-col-lg-2' },
        description: '',
        index: 9,
        label: 'Subject',
        required: false,
        name: 'Subject',
        inputType: 'nestedselect',
        placeholder: 'Select Subject',
        section: {
          index: 3,
          name: ''
        },
        output:'name'
      },
      {
        code: 'topic',
        visible: true,
        editable: true,
        dataType: 'list',
        depends: ['board', 'medium', 'gradeLevel', 'subject'],
        default: '',
        renderingHints: { class: 'sb-g-col-lg-2' },
        name: 'Topic',
        description: 'Choose a Topics',
        index: 11,
        inputType: 'topicselector',
        label: 'Topics',
        placeholder: 'Choose Topics',
        required: false
      }
    ]
  }
];
