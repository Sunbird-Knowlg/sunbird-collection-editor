# Configuration Documentation

Collection Editor is an angular library built with Angular version 9, and it exports some modules and components.

**Component:** `editor`

For example:
```
<lib-editor [editorConfig]="editorConfig" (editorEmitter)="editorEventListener($event)"></lib-editor>
```

This is the main editor component that accepts some configuration based on it loads the editor.  

Let's deep dive into the editor input [configuration](/projects/collection-editor-library/src/lib/interfaces/editor.ts):


```javascript
export interface IEditorConfig {
    context: Context;
    config: any;
}
```

## Context - `Required`

This required property from the `collectionEditorConfig` provides the context to the editor mostly in terms of the telemetry and it used these properties when the editor launch.

```javascript
export interface ContextBase {
    programId?: string;
    contributionOrgId?: string;
    user: User;
    identifier?: string;
    mode?: string;
    authToken?: string;
    sid: string;
    did: string;
    uid: string;
    channel: string;
    pdata: Pdata;
    contextRollup: ContextRollup;
    tags: string[];
    cdata?: Cdata[];
    timeDiff?: number;
    objectRollup?: ObjectRollup;
    host?: string;
    endpoint?: string;
    userData?: {
        firstName: string;
        lastName: string;
    };
    env: string;
    defaultLicense?: any;
    topic?: any;
    framework: string;
    cloudStorageUrls?: string[];
    additionalCategories?: any[];
    labels?: any;
    actor?: any;
    channelData?: any;
    correctionComments?: any;
    sourcingResourceStatus?: string;
    sourcingResourceStatusClass?: string;
    collectionIdentifier?: string;
    unitIdentifier?: string;
    collectionObjectType?: string;
    collectionPrimaryCategory?: string;
    targetFWIds?: string[];
    cloudStorage?: any;
}

export interface Context extends ContextBase{
    [key: string]: any;
}
```

The context has been classified into two parts as below:
1. Telemetry Context
2. Editor Context

### 1. Telemetry Context: 
It provides the context to the editor mostly in terms of the telemetry.
Let's understand the description of the following properties: 

|Property Name	| Description | Required | Default Value
|--|------------------------------------------------------------------------------------------|---|--|
| `env` |  It is `string` and Unique environment where the event has occured **For example:** in case of collection editor its `collection_editor` | true | `collection_editor OR questionset_editor` |
| `sid` |  It is `string` and session id of the requestor stamped by portal **For example:** `vLpZ1rFl6-sxMVHi4RrmrlHw0HsX9ggC` | true |   |
| `did` |  It is `string` and uuid of the device, created during app installation or browser **For example:** `1d8e290dd3c2a6a9eeac58568cdef28d` | true |   |
| `uid` |  It is `string` and Current logged in user id **For example:** `5a587cc1-e018-4859-a0a8-e842650b9d64` | true |  |
| `channel` |  It is `string` which defines channel identifier to know which channel is currently using. **For example:** `01309282781705830427` | true |  |
| `pdata` |  It is an `object` which defines the producer information it should have identifier and version and canvas will log in the telemetry. **For example:** `{ id: 'local.sunbird.portal', ver: '4.1.0', pid: 'sunbird-portal' }`  | true | |
| `contextRollup` |  It is an `object` which defines collection roll up data For example: `{ l1: 'do_1234567890' }` | true | |
| `tags` |  It is an `object` and Encrypted dimension tags passed by respective channels. For example: `['01307938306521497658']` | true |  |
| `identifier` |  It is `string` and Identifier of collection. | false | `''` |
| `authToken` |  It is `string` and Auth key to make api calls. | false | `''` |
| `cdata` |  It is an `array` which defines the correlation data | false | `[]` |
| `timeDiff` |  It is `number` and timeDiff (in sec) is diff of server date and local date | false | `''` |
| `objectRollup` |  It is an `object` which defines object rollup data (Only 4 levels are allowed) | false | `{}` |
| `host` |  It is `string` which defines the from which domain collection should be load. **For example:** `https://dev.sunbirded.org` | false | `''` |
| `endpoint` |  It is `string` and Telemetry API endpoint. **For example:** `/data/v3/telemetry` | false | `''` |
| `userData` |  It is `object` and first and last name of logged in user | false | `{}` |


### 2. Editor Context:
The editor context is used while launching the editor.
Let's understand the description of the following properties: 
|Property Name	| Description | Required | Default Value
|--|------------------------------------------------------------------------------------------|---|--|
| `framework` |  It is `string` and Organisation framework id. **For example:** `ekstep_ncert_k-12` | true | |
|  `user` | It is an `object` which defines user data	which contains users id, fullName, lastName, orgIds. | true | **For example:** ``` { id: '5a587cc1-e018-4859-a0a8-e842650b9d64', orgIds: [ '01309282781705830427' ], organisations: {}, fullName: 'Vaibhav Bhuva', firstName: 'Vaibhav', lastName: 'Bhuva', isRootOrgAdmin: true } ``` |
| `programId` |  It is `string` and program id in which questionset is created. For example: `f72ad8b0-36df-11ec-a56f-4b503455085f` | false | `''` |
|  `contributionOrgId` | It is `string` and Organisation id of the contributor. | false | `''` |
| `identifier` |  It is `string` and Identifier of collection. For example: `do_1134357224765685761203`| false | `''` |
| `defaultLicense` |  It is `string` and default license of editor. For example: `CC BY 4.0` | false | `''` |
| `cloudStorageUrls` |  It is `array` and Array of cloud storage urls | false | `[]` |
| `additionalCategories` |  It is `array` and Array of objects of additional categories. For example: `[ { value: 'Classroom Teaching Video', label: 'Classroom Teaching Video' }, { value: 'Concept Map', label: 'Concept Map' }]` | false | `[]` |
| `labels` |  It is `object` and Additional labels to be used in editor| false | `{}` |
| `targetFWIds` |  It is `array` and Array of target framework ids | false | `[]` |
| `cloudStorage` |  It is `object` and which defines cloud storage configuration which contains provider & presigned_headers for diff service provider for example: Azure, AWS | false | **For example:** ``` cloudStorage: { provider: azure, presigned_headers: { 'x-ms-blob-type': 'BlockBlob' // This header is specific to azure storage provider. } } ```


## Config - `Required`
This required property from the `collectionEditorConfig` provides the configuration for the editor to enable/disable some functionalities.  

```javascript
config: {
    mode: 'string', //Ex.: 'edit'/'review'/'read'/'sourcingReview'/'orgReview'
    editableFields: {
      sourcingreview: string[], //Ex.: ["name","description"]
      orgreview: string[],
      review: string[],
    },
    maxDepth: number, //Ex.: 1
    dialcodeMinLength: number, //Ex.: 2
    dialcodeMaxLength: number, //Ex.: 250
    showAddCollaborator: 'boolen', // true | false
    enableBulkUpload: 'boolen',
    publicStorageAccount: 'url', //Ex.: https://dockstorage.blob.core.windows.net/
    assetConfig: object,
    objectType: 'string', //Ex.: Collection
    primaryCategory: 'string', //Ex.: Digital Textbook
    isRoot: boolean, //Ex.: true
    iconClass: 'string', //Ex.: 'fa fa-book'
    children: {
        Content: [
          'Explanation Content',
          'Learning Resource',
          'eTextbook',
          'Teacher Resource',
          'Course Assessment'
        ]
     },
    hierarchy: {
      level1: {
        name: '', //ex: 'name of the section'
        type: '', //ex: 'Unit'
        mimeType: 'string', //Ex.: application/vnd.ekstep.content-collection
        contentType: 'string', //Ex.: TextBookUnit
        primaryCategory: 'string', //ex: 'Textbook Unit'
        iconClass: 'string' //ex: 'fa fa-folder-o',
        children: {}
      },
      level2: {
        name: 'string', //Ex.: 'Sub Section'
        ...
        ...
      },
      level3: {
      ...
      ...
      }
    },
    contentPolicyUrl: 'string' //Ex.: '/term-of-use.html' 
  }
```

Note: If any of the property is added in object-category-definition. It will take the config from there, otherwise editor will take the mock config passed as input to the editor.

Description of the properties for the config:

|Property Name	| Description | Required | Default Value
|--|------------------------------------------------------------------------------------------|---|--|
| `isRoot` |  It is `boolen` and that defines the node is root node.  | true | `true` |
| `objectType` |  It is `string` and that defines the object type of collection  | true |  |
| `iconClass` |  It is `string` and that defines the icon of root node  | true | `fa fa-book` |
| `children` |  It is an `object` and If maxdepth is 0 than children inside the root node defines the content type. **For example:** `children: { Content: [ 'Explanation Content', 'Learning Resource', 'eTextbook' ] }` | true |  |
| `contentPolicyUrl` |  It is `string` and It defines where should the content policy link will be redirected.  | true | `/term-of-use.html`  |
| `publicStorageAccount` |  It is `url` and URL of the blob storage **For example:** `https://dockstorage.blob.core.windows.net/`  | true |  |
| `mode` |  It is `string` and that defines the mode in editor is to be loaded. **For example:** `edit / review / read / sourcingReview / orgReview`  | false | `edit` |
| `editableFields` |  It is an `object` and that defines the mode in editor is to be loaded.  | false | `{ sourcingreview: [],       orgreview: [],       review: [], }` |
| `maxDepth` |  It is `number` and Defines the depth to which the textbook is to be created. If the depth is 1, hierarchy should have level1 described.  | false | **For example:** `1` |
| `dialcodeMinLength` |  It is `number` and it specifies the minimum number of characters required in an input field  | false | `2` |
| `dialcodeMaxLength` |  It is `number` and it specifies the maximum number of characters required in an input field  | false | `250` |
| `showAddCollaborator` |  It is `boolen` and this is to enable/disable the functionality of add collaborator in editor. If it is true add collobrorator button will be enabled and created can add the collolaborator to collaborate in textbook.  | false | `false` |
| `assetConfig` |  It is an `object` and `assetConfig` sets the max size limit and type for image and videos to be uploaded in the editor.  **For example:** `{ "image": { "size": "1", "sizeType": "MB", "accepted": "png, jpeg" }, "video": { "size": "50", "sizeType": "MB", "accepted": "mp4, webm" } }` | false | `{}` |
| `hierarchy` |  It is an `object` and If maxdepth is > 0 then hierarchy should have definiton of the levels. **For example:** `{ level1: { name: 'Textbook Unit', type: 'Unit', mimeType: 'application/vnd.ekstep.content-collection', contentType: 'TextBookUnit', primaryCategory: 'Textbook Unit', iconClass: 'fa fa-folder-o', children: { Content: [ 'Explanation Content', 'Learning Resource' ] } }}`  | false | `{}` |

Following are the configuration for different types of collections. 

**1. Digital Textbook**
```json
{
  "maxDepth": 2,
  "objectType": "Collection",
  "primaryCategory": "Digital Textbook",
  "isRoot": true,
  "iconClass": "fa fa-book",
  "children": {},
  "hierarchy": {
    "level1": {
      "name": "Chapter",
      "type": "unit",
      "mimeType": "application/vnd.ekstep.content-collection",
      "contentType": "Textbook Unit",
      "iconClass": "fa fa-folder-o",
      "children": {}
    },
    "level2": {
      "name": "Sub-Chapter",
      "type": "unit",
      "mimeType": "application/vnd.ekstep.content-collection",
      "contentType": "Textbook Unit",
      "iconClass": "fa fa-folder-o",
      "children": {
        "Content": []
      }
    }
  }
}
```

**2. Course**
```json
{
  "maxDepth": 2,
  "objectType": "Collection",
  "primaryCategory": "Course",
  "isRoot": true,
  "iconClass": "fa fa-book",
  "children": {},
  "hierarchy": {
    "level1": {
      "name": "Chapter",
      "type": "unit",
      "mimeType": "application/vnd.ekstep.content-collection",
      "contentType": "Course Unit",
      "iconClass": "fa fa-folder-o",
      "children": {}
    },
    "level2": {
      "name": "Sub-Chapter",
      "type": "unit",
      "mimeType": "application/vnd.ekstep.content-collection",
      "contentType": "Course Unit",
      "iconClass": "fa fa-folder-o",
      "children": {
        "Content": [
          "Explanation Content",
          "Learning Resource",
          "eTextbook",
          "Teacher Resource",
          "Course Assessment"
        ],
        "QuestionSet": [
          "Practice Question Set"
        ]
      }
    }
  }
}
```


### References:

https://project-sunbird.atlassian.net/wiki/spaces/SingleSource/pages/2696183813/How+to+configure+forms+in+primaryCategory#Overview
https://project-sunbird.atlassian.net/wiki/spaces/SingleSource/pages/2118451214/Editor+Generalisation+Configurations
