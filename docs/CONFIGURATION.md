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
| `programId` |  It is `string` and program id in which questionset is created. For example: `b8a328e0-1511-11eb-81b1-659ec274e395` | false | `''` |
|  `contributionOrgId` | It is `string` and Organisation id of the contributor. For example: `01274256635219968039517` | false | `''` |
|  `user` | It is an `object` which defines user data	which contains users id, fullName, lastName, orgIds. | true | **For example:** ``` { id: '5a587cc1-e018-4859-a0a8-e842650b9d64', orgIds: [ '01309282781705830427' ], organisations: {}, fullName: 'Vaibhav Bhuva', firstName: 'Vaibhav', lastName: 'Bhuva', isRootOrgAdmin: true } ``` |
