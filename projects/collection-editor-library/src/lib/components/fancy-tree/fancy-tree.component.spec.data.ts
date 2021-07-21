export const mockData  = {
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
