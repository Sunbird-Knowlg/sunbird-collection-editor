# :diamond_shape_with_a_dot_inside: Collection Editor library for Sunbird platform
Contains Collection Editor library components powered by angular. These components are designed to be used in the sunbirdEd portal and web portal to drive reusability, maintainability hence reducing the redundant development effort significantly.

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
- Create a data.ts file which contains the collectionEditorConfig   Refer: [data.ts](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/data.ts)
Note: collectionEditorConfig data.ts contains the mock config used in component to send it as input to Collection Editor. We need only [collectionEditorConfig](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/data.ts#L143)

- Create a latexService.js in  root folder. Refer: [latexService.js](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/latexService.js)

- Create a proxy.conf.json in  root folder. Refer: [proxy.conf.json](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/proxy.conf.json)

- Create server.js in root folder. Refer: [server.js](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/server.js) 

- Copy the assets from: [assets](https://github.com/Sunbird-Ed/sunbird-collection-editor/tree/release-4.7.0/src/assets) 

## :label: Step 3: Add question-cursor-implementation.service
Create a **question-cursor-implementation.service.ts** in a project and which will implement the `QuestionCursor` and `EditorCursor` abstract class.  
`QuestionCursor` and `EditorCursor` is an abstract class, exported from the library, which needs to be implemented. Basically it has some methods which should make an API request over HTTP  

Remember EditorCursor and QuestionCursor is to be imported like below:
 
`import { EditorCursor, QuestionCursor } from '@project-sunbird/sunbird-collection-editor-v9';`

For more information refer [question-cursor-implementation.service.ts](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/editor-cursor-implementation.service.ts) and do not forgot to add your question list API URL here, for example: [https://staging.sunbirded.org/api/question/v1/list](https://staging.sunbirded.org/api/question/v1/list)


## :label: Step 4: Include the styles, scripts and assets in angular.json
  Add the following under `architect.build.assets` for default project  
```javascript
{
  ...
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      ...
      ...
      "aot": false,
      "assets": [
        ...
        ...
              {
                "glob": "**/*",
                "input": "node_modules/@project-sunbird/sunbird-pdf-player-v9/lib/assets/",
                "output": "/assets/"
              },
              {
                "glob": "**/*",
                "input": "node_modules/@project-sunbird/sunbird-video-player-v9/lib/assets/",
                "output": "/assets/"
              },
              {
                "glob": "**/*",
                "input": "node_modules/@project-sunbird/sunbird-collection-editor-v9/lib/assets",
                "output": "/assets/"
              },
              {
                "glob": "**/*",
                "input": "node_modules/@project-sunbird/sunbird-quml-player-v9/lib/assets/",
                "output": "/assets/"
              }
      ],
      "styles": [
        ...
        "src/assets/quml-styles/quml-carousel.css",
        "node_modules/@project-sunbird/sb-styles/assets/_styles.scss",
        "src/assets/lib/semantic/semantic.min.css",
        "src/assets/styles/styles.scss",
        "node_modules/font-awesome/css/font-awesome.css",
        "node_modules/video.js/dist/video-js.min.css",
        "node_modules/@project-sunbird/sunbird-video-player-v9/lib/assets/videojs.markers.min.css",
        "node_modules/videojs-http-source-selector/dist/videojs-http-source-selector.css"
      ],
      "scripts": [
        ...
        "node_modules/epubjs/dist/epub.js",
        "src/assets/libs/iziToast/iziToast.min.js",
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/jquery.fancytree/dist/jquery.fancytree-all-deps.min.js",
        "src/assets/lib/dimmer.min.js",
        "src/assets/lib/transition.min.js",
        "src/assets/lib/modal.min.js",
        "src/assets/lib/semantic-ui-tree-picker.js",
        "node_modules/@project-sunbird/client-services/index.js",
        "node_modules/video.js/dist/video.js",
        "node_modules/@project-sunbird/sunbird-video-player-v9/lib/assets/videojs-markers.js",
        "node_modules/videojs-contrib-quality-levels/dist/videojs-contrib-quality-levels.min.js",
        "node_modules/videojs-http-source-selector/dist/videojs-http-source-selector.min.js"
      ]
    }
  }
  ...
  ...
}
```

## :label: Step 5: Import the modules and components
Import the required modules such as below:

```javascript
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollectionEditorLibraryModule, EditorCursor } from '@project-sunbird/sunbird-collection-editor-v9';
import { RouterModule } from '@angular/router';
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player-v9';
import { EditorCursorImplementationService } from './editor-cursor-implementation.service';

  @NgModule({
   ...

   imports: [ 
      CollectionEditorLibraryModule,
      BrowserAnimationsModule,
      RouterModule.forRoot([])
      ],
   providers: [
    { provide: QuestionCursor, useExisting: EditorCursorImplementationService },
    { provide: EditorCursor, useExisting: EditorCursorImplementationService }
   ]

   ...
  })

 export class AppModule { }
```

Add the collection editor config in component as below:
```javascript
...
import { collectionEditorConfig } from './data';
@Component({
  ...
  ...
  ...
})

export class AppComponent {
  ...
  public editorConfig: any = collectionEditorConfig;
}
```

## :label: Step 6: Send input to render Collection Editor

Use the mock config in your component to send input to Collection editor as `editorConfig`  
Click to see the mock - [collectionEditorConfig](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/data.ts)  

```html
<lib-editor [editorConfig]="editorConfig"></lib-editor>
```

## :orange_circle: Available components
|Feature| Notes| Selector|Code|Input|Output
|--|--|--|------------------------------------------------------------------------------------------|---|--|
| Collection Editor | Can be used to render Editor | lib-editor| *`<lib-editor [editorConfig]="editorConfig"></lib-editor>`*|editorConfig|editorEmitter|

### :small_red_triangle_down: Input Parameters
1. editorConfig: Object - [`Required`]  
```javascript
{
  context: Object   // Information about the telemetry and default settings for editor API requests
  config: Object    // default editor config such as sidebar menu list
}
```

### :small_red_triangle_down: Output Events
1. editorEmitter()    - It emits event for each action performed in the editor.
---


## :label: Step 7: Set the auth token and questionset identifier
From the root directory - go to server.js file


Update the host variable to which env your pointing. example if you are pointing sunbird dev instance update variable like below
```javascript
const BASE_URL = 'dev.sunbirded.org'
const API_AUTH_TOKEN = 'XXXX'
const USER_TOKEN= 'YYYY'
```
Note: You will need actual `API_AUTH_TOKEN` and `USER_TOKEN`

If you are pointing to sunbird dev -> [dev.sunbirded.org](https://dev.sunbirded.org/), create a textbook in sunbird dev, copy the textbook_id from the browser url and set the do_id of textbook data.ts file

```javascript
export const collectionEditorConfig = {
  context: {
       ...
       identifier: 'do_id', // identifier of textbook created in sunbird dev
      ...
  },
  config: {
      ...
  }
```

## :label: Step 8: Run the application

From the root directory - Start the server (Open  terminal in root folder and start the application) as: 


  `npm run start`

The  app will launch at [http://localhost:4200](http://localhost:4200)

Run Node server to proxy the APIs (Open another terminal in root folder and run the server.js ) as:


  `nodemon server.js`

# :bookmark_tabs: Editor Contribution and Configuration Guide

[Contribution guidelines for this project](docs/CONTRIBUTING.md)

[Configuration guidelines for this project](docs/CONFIGURATION.md)