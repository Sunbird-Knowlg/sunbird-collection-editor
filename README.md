# :diamond_shape_with_a_dot_inside: Collection Editor library for Sunbird platform
Contains Collection Editor library components powered by angular. These components are designed to be used in the sunbirdEd portal and coKreat reference web portal to drive reusability, maintainability hence reducing the redundant development effort significantly.

![image](https://user-images.githubusercontent.com/36467967/153172086-5552cfe4-ad39-4b70-b015-e7553610a6fa.png)

# :bookmark_tabs: Getting Started
For getting started with a new Angular app, check out the [Angular CLI](https://angular.io/tutorial/toh-pt0).

For existing apps, follow below-mentioned steps:  

## :label: Step 1: Install the packages
These are the peerDependencies of the library, need to be installed in order to use this library.

```npm i @project-sunbird/sunbird-collection-editor-v9 --save
npm i common-form-elements-web-v9 --save
npm i ng2-semantic-ui-v9 --save
npm i ngx-infinite-scroll --save
npm i lodash-es --save
npm i jquery.fancytree --save
npm i angular2-uuid --save
npm i @project-sunbird/client-services --save
npm i export-to-csv --save
npm i moment --save
npm i @project-sunbird/ckeditor-build-classic --save
npm i @project-sunbird/sunbird-pdf-player-v9 --save
npm i @project-sunbird/sunbird-epub-player-v9 --save
npm i @project-sunbird/sunbird-video-player-v9 --save
npm i @project-sunbird/sunbird-quml-player-v9 --save
npm i ngx-bootstrap@6.0.0 --save
npm i ng2-cache-service --save
npm i fine-uploader --save
npm i ngx-chips@2.2.0 --save
npm i epubjs --save
npm i videojs-contrib-quality-levels --save
npm i videojs-http-source-selector --save
npm i jquery --save
npm i express-http-proxy --save
npm i mathjax-full --save
npm i svg2img --save
npm i font-awesome --save
npm i @project-sunbird/sb-styles
```


Note: *As Collection library is build with angular version 9, we are using **bootstrap@4.6.1** and **ngx-bootstrap@6.0.0** which are the compatible versions.  
For more reference Check compatibility document for ng-bootstrap [here](https://valor-software.com/ngx-bootstrap/#/documentation#compatibility)*  

## :label: Step 2: create and copy required assests
Create a data.ts file which contains the collectionEditorConfig   Refer: [data.ts](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/data.ts)

Note: collectionEditorConfig data.ts contains the mock config used in component to send it as input to Collection Editor. We need only [collectionEditorConfig](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/data.ts#L143)

Create a latexService.js in  root folder. Refer: [latexService.js](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/latexService.js)

Create a proxy.conf.json in  root folder. Refer: [proxy.conf.json](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/proxy.conf.json)

Create server.js in root folder. Refer: [server.js](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/server.js) 

Copy the assets from: [assets](https://github.com/Sunbird-Ed/sunbird-collection-editor/tree/release-4.7.0/src/assets) 

## :label: Step 3: Add question-cursor-implementation.service
Create a **question-cursor-implementation.service.ts** in a project and which will implement the `QuestionCursor` and `EditorCursor` abstract class.  
`QuestionCursor` and `EditorCursor` is an abstract class, exported from the library, which needs to be implemented. Basically it has some methods which should make an API request over HTTP  

Remember EditorCursor and QuestionCursor is to be imported like below:
 
`import { EditorCursor, QuestionCursor } from '@project-sunbird/sunbird-collection-editor-v9';`

For more information refer [question-cursor-implementation.service.ts](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/editor-cursor-implementation.service.ts) and do not forgot to add your question list API URL here, for example: [https://staging.sunbirded.org/api/question/v1/list](https://staging.sunbirded.org/api/question/v1/list)
