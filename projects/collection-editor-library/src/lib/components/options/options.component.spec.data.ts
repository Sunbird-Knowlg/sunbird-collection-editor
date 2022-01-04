export const mockOptionData = {
  editorOptionData: {
    question:
      '<p><span style="color:rgb(0,0,0);">D.D.T. was invented by?</span></p>',
    options: [
      {
        body: '<p><span style="color:rgb(0,0,0);">Mosley</span></p>',
      },
      {
        body: '<p><span style="color:rgb(0,0,0);">Rudolf</span></p>',
      },
      {
        body: '<p><span style="color:rgb(0,0,0);">Karl Benz</span></p>',
      },
      {
        body: '<p><span style="color:rgb(0,0,0);">Dalton</span></p>',
      },
    ],
    templateId: 'mcq-split-grid',
    answer: '0',
    numberOfOptions: 4,
  },
  prepareMcqBody: {
    templateId: 'mcq-vertical',
    name: 'Multiple Choice Question',
    responseDeclaration: {
      response1: {
        maxScore: 1,
        cardinality: 'single',
        type: 'integer',
        correctResponse: {
          value: '0',
          outcomes: {
            SCORE: 1,
          },
        },
      },
    },
    interactionTypes: ['choice'],
    interactions: {
      response1: {
        type: 'choice',
        options: [
          {
            label: '<p><span style="color:rgb(0,0,0);">Mosley</span></p>',
            value: 0,
          },
          {
            label: '<p><span style="color:rgb(0,0,0);">Rudolf</span></p>',
            value: 1,
          },
          {
            label: '<p><span style="color:rgb(0,0,0);">Karl Benz</span></p>',
            value: 2,
          },
          {
            label: '<p><span style="color:rgb(0,0,0);">Dalton</span></p>',
            value: 3,
          },
        ],
      },
    },
    editorState: {
      options: [
        {
          answer: true,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Mosley</span></p>',
            value: 0,
          },
        },
        {
          answer: false,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Rudolf</span></p>',
            value: 1,
          },
        },
        {
          answer: false,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Karl Benz</span></p>',
            value: 2,
          },
        },
        {
          answer: false,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Dalton</span></p>',
            value: 3,
          },
        },
      ],
    },
    qType: 'MCQ',
    primaryCategory: 'Multiple Choice Question',
  },
  subMenus : [
    [{
      id: 'addHint',
      name: 'Add Hint',
      value: 'test',
      enabled: false,
      type: 'input',
      label: 'label',
      show:true
    }]
  ]
};

export const sourcingSettingsMock = {
  enforceCorrectAnswer: false,
  showSolution: false,
  showAddHints: true,
  showAddScore: false,
  showAddTips: true,
  showAddTranslation: true,
  showAddSecondaryQuestion: false,
};


export const nativeElement = `<div><ul id="ft-id-1" class="ui-fancytree fancytree-container fancytree-plain fancytree-ext-glyph fancytree-ext-dnd5 fancytree-connectors" tabindex="0" role="tree" aria-multiselectable="true"><li role="treeitem" aria-expanded="false" aria-selected="false" class="fancytree-lastsib"><span class="fancytree-node fancytree-folder fancytree-has-children fancytree-lastsib fancytree-exp-cl fancytree-ico-cf" draggable="true"><span role="button" class="fancytree-expander fa fa-caret-right"></span><span role="presentation" class="fancytree-custom-icon fa fa-book"></span><span class="fancytree-title" title="SB23410q" style="width:15em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden">SB23410q</span><span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0" style="display: none;"> <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id="contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addchild" class="item">Add Child</div>
  </span>
  </span></span></li></ul></div>`;