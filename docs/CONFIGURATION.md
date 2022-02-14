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
    metadata?: any;
}
```

## Context - `Required`

This Required property from the `collectionEditorConfig`  provides the context to the editor mostly in terms of the telemetry.

Along with this it also provides the channel level config, if available. 
```javascript
export interface Context {
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
    board?: any;
    medium?: any;
    gradeLevel?: any;
    subject?: any;
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
}
```
Description of the properties for the context

|Property Name	| Description | Required | Default Value
|--|------------------------------------------------------------------------------------------|---|--|
| `programId` |  It is `string` and program id in which questionset is created. | false | `''` |
|  `contributionOrgId` | It is `string` and Organisation id of the contributor. | false | `''` |
|  `user` | It is an `object` which defines user data	which contains users id, fullName, lastName, orgIds. | true | **For example:** ``` { id: '5a587cc1-e018-4859-a0a8-e842650b9d64', orgIds: [ '01309282781705830427' ], organisations: {}, fullName: 'Vaibhav Bhuva', firstName: 'Vaibhav', lastName: 'Bhuva', isRootOrgAdmin: true } ``` |
| `identifier` |  It is `string` and Identifier of content. | false | `''` |
| `authToken` |  It is `string` and Auth key to make api calls. | false | `''` |
| `sid` |  It is `string` and session id of the requestor stamped by portal | true | `''` |
| `did` |  It is `string` and Unique id to identify the device or browser | true | `''` |
| `uid` |  It is `string` and Current logged in user id | true | `''` |
| `channel` |  It is `string` which defines channel identifier to know which channel is currently using. | true | `''` |
| `pdata` |  It is an `object` which defines the producer information it should have identifier and version and canvas will log in the telemetry | true | `{}` |
| `contextRollup` |  It is an `object` which defines content roll up data | true | `{}` |
| `tags` |  It is an `object` which defines content roll up data | true | `{}` |
| `cdata` |  It is an `array` which defines the correlation data | false | `[]` |
| `timeDiff` |  It is `number` and timeDiff (in sec) is diff of server date and local date | false | `''` |
| `objectRollup` |  It is an `object` which defines object rollup data (up to level 4) | false | `{}` |
| `host` |  It is `string` which defines the from which domain content should be load | false | `''` |
| `endpoint` |  It is `string` and Telemetry API endpoint | false | `''` |
| `userData` |  It is `object` and first and last name of logged in user | false | `{}` |
| `env` |  It is `string` and type of editor , in case of collection editor its `collection_editor` | true | `collection_editor OR questionset_editor` |
| `defaultLicense` |  It is `string` and default license of editor | false | `''` |
| `framework` |  It is `string` and Organisation framework id | true | `ekstep_ncert_k-12` |
| `cloudStorageUrls` |  It is `array` and Array of cloud storage urls | false | `[]` |
| `additionalCategories` |  It is `array` and Array of objects of additional categories | false | `[]` |
| `labels` |  It is `object` and Additional labels to be used in editor| false | `{}` |
| `targetFWIds` |  It is `array` and Array of target framework ids | false | `[]` |


## Config - `Required`
This Required property from the collectionEditorConfig provides the configuration for the editor to enable/disable some functionalities.  

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
| `mode` |  It is `string` and that defines the mode in editor is to be loaded.  | false | **For example:** `edit / review / read / sourcingReview / orgReview` |
| `editableFields` |  It is an `object` and that defines the mode in editor is to be loaded.  | false | `{ sourcingreview: [],       orgreview: [],       review: [], }` |
| `maxDepth` |  It is `number` and Defines the depth to which the textbook is to be created. If the depth is 1, hierarchy should have level1 described.  | false | **For example:** `1` |
| `dialcodeMinLength` |  It is `number` and it specifies the minimum number of characters required in an input field  | false | `2` |
| `dialcodeMaxLength` |  It is `number` and it specifies the maximum number of characters required in an input field  | false | `250` |
| `showAddCollaborator` |  It is `boolen` and this is to enable/disable the functionality of add collaborator in editor. If it is true add collobrorator button will be enabled and created can add the collolaborator to collaborate in textbook.  | false | `false` |
| `publicStorageAccount` |  It is `url` and URL of the blob storage  | true | **For example:** `https://dockstorage.blob.core.windows.net/` |
| `assetConfig` |  It is an `object` and `assetConfig` sets the max size limit and type for image and videos to be uploaded in the editor. | false | **For example:** `{ "image": { "size": "1", "sizeType": "MB", "accepted": "png, jpeg" }, "video": { "size": "50", "sizeType": "MB", "accepted": "mp4, webm" } }` |
| `objectType` |  It is `string` and that defines the object type of content  | true |  |
| `isRoot` |  It is `boolen` and that defines the node is root node.  | true | `true` |
| `iconClass` |  It is `string` and that defines the icon of root node  | true | `fa fa-book` |
| `children` |  It is an `object` and If maxdepth is 0 than children inside the root node defines the content type.  | true | For example: `children: { Content: [ 'Explanation Content', 'Learning Resource', 'eTextbook' ] }` |
| `hierarchy` |  It is an `object` and If maxdepth is > 0 then hierarchy should have definiton of the levels.  | false | `{}` |
| `contentPolicyUrl` |  It is `string` and It defines where should the content policy link will be redirected.  | true | `/term-of-use.html`  |
