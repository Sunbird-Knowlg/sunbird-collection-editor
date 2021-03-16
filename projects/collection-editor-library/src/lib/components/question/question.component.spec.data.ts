export const mockData = {
    childMetadata: {
        templateName: '',
        required: [],
        properties: [
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
            },
            {
                code: 'description',
                dataType: 'text',
                description: 'Description of the content',
                editable: true,
                inputType: 'textarea',
                label: 'Description',
                name: 'Description',
                placeholder: 'Description',
                renderingHints: {
                    class: 'sb-g-col-lg-1 required'
                },
                required: true,
                visible: true,
                validations: [
                    {
                        type: 'max',
                        value: '200',
                        message: 'Input is Exceeded'
                    },
                    {
                        type: 'required',
                        message: 'Title is required'
                    }
                ]
            },
            {
                code: 'keywords',
                visible: true,
                editable: true,
                dataType: 'list',
                name: 'Keywords',
                renderingHints: {
                    class: 'sb-g-col-lg-1 required'
                },
                description: 'Keywords for the content',
                inputType: 'keywords',
                label: 'keywords',
                placeholder: 'Enter Keywords',
                required: false,
                validations: [
                    {
                        type: 'required',
                        message: 'Keyword is required'
                    }
                ]
            }
        ]
    },
    questionMetaData: {
        answer: '<p>adasd</p>',
        body: '<p>asd</p>',
        description: 'description',
        editorState: {
            answer: '<p>adasd</p>',
            editorState: { answer: '<p>adasd</p>' },
            name: 'Subjective Question',
            primaryCategory: 'Subjective Question',
            qType: 'SA',
            question: '<p>asd</p>',
        },
        identifier: 'do_113219577241780224147',
        keywords: ['keyword'],
        languageCode: ['en'],
        media: [],
        mimeType: 'application/vnd.sunbird.question',
        name: 'Mcq question ',
        primaryCategory: 'Subjective Question',
        qType: 'SA',
        solutions: []
    },
    childMetadataUpdated: {
        templateName: '',
        required: [],
        properties: [
            {
                code: 'name',
                dataType: 'text',
                description: 'Name of the content',
                editable: false,
                inputType: 'text',
                label: 'Title',
                name: 'Title',
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
            },
            {
                code: 'description',
                dataType: 'text',
                description: 'Description of the content',
                editable: false,
                inputType: 'textarea',
                label: 'Description',
                name: 'Description',
                placeholder: 'Description',
                renderingHints: {
                    class: 'sb-g-col-lg-1 required'
                },
                required: true,
                visible: true,
                validations: [
                    {
                        type: 'max',
                        value: '200',
                        message: 'Input is Exceeded'
                    },
                    {
                        type: 'required',
                        message: 'Title is required'
                    }
                ]
            },
            {
                code: 'keywords',
                visible: true,
                editable: false,
                dataType: 'list',
                name: 'Keywords',
                renderingHints: {
                    class: 'sb-g-col-lg-1 required'
                },
                description: 'Keywords for the content',
                inputType: 'keywords',
                label: 'keywords',
                placeholder: 'Enter Keywords',
                required: false,
                validations: [
                    {
                        type: 'required',
                        message: 'Keyword is required'
                    }
                ]
            }
        ]
    },
    formData: {
        description: 'description',
        keywords: ['keyword'],
        name: ''
    }
};
