
# :diamond_shape_with_a_dot_inside: Collection Editor library for Sunbird platform
Contains Collection Editor library components powered by angular. These components are designed to be used in the sunbirdEd portal and web portal to drive reusability, maintainability hence reducing the redundant development effort significantly.

![image](https://user-images.githubusercontent.com/36467967/153172086-5552cfe4-ad39-4b70-b015-e7553610a6fa.png)

# :bookmark_tabs: Getting Started

# Use as web components	
Any web based application can use this library as a web component. It accepts couple of inputs and triggers editorEmitter events back to the application.

Follow below-mentioned steps to use it in plain javascript project:

- Insert [library](https://github.com/Sunbird-Knowlg/sunbird-collection-editor/blob/release-5.6.0/web-component/sunbird-collection-editor.js) as below:
	```javascript
	<script type="text/javascript" src="sunbird-collection-editor.js"></script>
	```
- Update below script in index.html file 
	```javascript
      <script src="https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect.min.js"
      integrity="sha512-jvbPH2TH5BSZumEfOJZn9IV+5bSwwN+qG4dvthYe3KCGC3/9HmxZ4phADbt9Pfcp+XSyyfc2vGZ/RMsSUZ9tbQ=="
      crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	```

- Get sample editorConfig from here: [editorConfig](https://github.com/Sunbird-Knowlg/sunbird-collection-editor/blob/release-5.6.0/web-component-demo/index.html)

- Create a custom html element: `lib-editor`
	```javascript
    const  editorElement = document.createElement('lib-editor');
   ```

- Pass data using `editor-config`
	```javascript
	editorElement.setAttribute('editor-config', JSON.stringify(editorConfig));
	```

	**Note:** Attribute name should be in kebab-case regardless of the actual Attribute name used in the Angular app. The value of the attribute should be in **string** type, as web-component does not accept any objects or arrays.

- Listen for the output events: **editorEmitter**

	```javascript
	editorElement.addEventListener('editorEmitter', (event) => {
		console.log("On editorEmitter", event);
	});
	```
- Append this element to existing element
	```javascript
	const  collectionEditor = document.getElementById("my-editor");
	collectionEditor.appendChild(editorElement);
	```
- Refer demo [example](https://github.com/Sunbird-Knowlg/sunbird-collection-editor/blob/release-5.6.0/web-component-demo/index.html)

- To run the demo project, use the following commands:
	```bash
  cd web-component-demo
	npx http-server --cors .
	```
	open [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
	**Note:** Due to cors errors when you open the index.html from demo folder as file, it is recomanded to run a static server in it like [http-server](https://www.npmjs.com/package/http-server).


# Use as Web component  in the Angular app

- Run command 
  ```bash
    npm i @project-sunbird/sunbird-collection-editor-web-component
    npm i reflect-metadata
  ```

- Add these entries in angular json file inside assets, scripts and styles like below

  ```bash
            "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*.*",
                "input": "./node_modules/@project-sunbird/sunbird-collection-editor-web-component/assets",
                "output": "/assets/"
              }
            ],
            "styles": [
              "src/styles.scss",
              "node_modules/@project-sunbird/sunbird-collection-editor-web-component/styles.css"
            ],
            "scripts": [
              "node_modules/reflect-metadata/Reflect.js",
              "node_modules/@project-sunbird/sunbird-collection-editor-web-component/sunbird-collection-editor.js"
            ]

  ```

- Import  CUSTOM_ELEMENTS_SCHEMA in app module and add it to the NgModule as part of schemas like below

	```javascript
  ...
  import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
  ...

  @NgModule({
    ...
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    ...
  })

	```

- Integrating sunbird-collection-editor web component in angular component
    
  Create a viewChild in html template of the angular component like

  ```bash

      <div #editor></div>

  ```

  Refer the viewChild in ts file of the component and create the pdf player using document.createElement, then attach the player config and listen to the player and telemetry events like below and since we are rendering using viewChild these steps should be under ngAfterViewInit hook of the angular component.

```bash

....

@ViewChild('editor') editor: ElementRef;

  ....
 ngAfterViewInit() {
    const editorConfig = <Config need be added>;
      const editorElement = document.createElement('lib-editor');
      editorElement.setAttribute('editor-config', JSON.stringify(editorConfig));

      editorElement.addEventListener('editorEmitter', (event) => {
        console.log("On editorEmitter event", event);
      });

      this.editor.nativeElement.append(editorElement);
  }
  ....

```


# Use as Angular library in angular app
This guide explains how to set up your Angular project to begin using the collection editor library. It includes information on prerequisites, installing editor library, and optionally displaying a sample editor library component in your application to verify your setup.

If you are new to Angular or getting started with a new Angular application, see [Angular's full Getting Started Guide](https://angular.io/start) and [Setting up your environment](https://angular.io/guide/setup-local).

> **_NOTE:_**
  `@project-sunbird/sunbird-collection-editor@5.1.*` versions will refer to angular 9 to 12 upgradation changes.


For existing applications, follow the steps below to begin using Collection editor library.
## :label: Step 1: Install the packages

The following commands will add `sunbird-collection-editor` library to your package.json file along with its dependencies.

```red
npm i @project-sunbird/sunbird-collection-editor --save
```

Don't forget to install the below peer dependencies of the library in your application. that need to be installed in order to use the library in your angular project.

```
npm i common-form-elements-web-v9 --save
npm i ng2-semantic-ui-v9 --save
npm i ngx-infinite-scroll --save
npm i lodash-es --save
npm i jquery.fancytree --save
npm i uuid --save
npm i @project-sunbird/client-services --save
npm i export-to-csv --save
npm i moment --save
npm i @project-sunbird/ckeditor-build-classic --save
npm i @project-sunbird/sunbird-pdf-player-web-component
npm i @project-sunbird/sunbird-epub-player-web-component
npm i @project-sunbird/sunbird-video-player-web-component
npm i @project-sunbird/sunbird-quml-player --save
npm i ngx-bootstrap@6.0.0 --save
npm i fine-uploader --save
npm i ngx-chips@2.2.0 --save
npm i jquery --save
npm i express-http-proxy --save
npm i mathjax-full --save
npm i svg2img --save
npm i font-awesome --save
npm i @project-sunbird/sb-styles
```


Note: *As Collection library is build with angular version 12, we are using **bootstrap@4.6.1** and **ngx-bootstrap@6.0.0** which are the compatible versions.
For more reference Check compatibility document for ng-bootstrap [here](https://valor-software.com/ngx-bootstrap/#/documentation#compatibility)*  

## :label: Step 2: create and copy required assests

After installing the above dependencies, now we have to copy the required assets from the given folder to the assets folder of your angular application. It contains styles and plugins.

- Copy the assets from: [assets](https://github.com/Sunbird-Ed/sunbird-collection-editor/tree/release-4.8.0/src/assets)

<img width="320" alt="image" src="https://user-images.githubusercontent.com/36467967/154430084-44060eda-97a9-4fd4-a3c0-06364a8ba86f.png">

- Create a latexService.js in the root folder. Refer: [latexService.js](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.8.0/latexService.js)

- Create a proxy.conf.json in the root folder. Refer: [proxy.conf.json](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.8.0/proxy.conf.json)

- Create server.js in the root folder. Refer: [server.js](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.8.0/server.js) 


## :label: Step 3: Include the styles, scripts and assets in angular.json

Now open the `angular.json` file and add the following under `architect.build.assets` for default project
  
```diff
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
+        {
+          "glob": "**/*",
+          "input": "node_modules/@project-sunbird/sunbird-pdf-player-web-component/lib/assets/",
+         "output": "/assets/"
+        },
+        {
+          "glob": "**/*",
+          "input": "node_modules/@project-sunbird/sunbird-video-player-web-component/lib/assets/",
+          "output": "/assets/"
+        },
{
+          "glob": "**/*",
+          "input": "node_modules/@project-sunbird/sunbird-epub-player-web-component/lib/assets/",
+          "output": "/assets/"
+        },
+        {
+          "glob": "**/*",
+          "input": "node_modules/@project-sunbird/sunbird-collection-editor/lib/assets",
+          "output": "/assets/"
+        },
+        {
+          "glob": "**/*",
+          "input": "node_modules/@project-sunbird/sunbird-quml-player/lib/assets/",
+          "output": "/assets/"
+        }
      ],
      "styles": [
        ...
+        "src/assets/quml-styles/quml-carousel.css",
+        "node_modules/@project-sunbird/sb-styles/assets/_styles.scss",
+        "src/assets/lib/semantic/semantic.min.css",
+        "src/assets/styles/styles.scss",
+        "node_modules/font-awesome/css/font-awesome.css",
+        "node_modules/@project-sunbird/sunbird-pdf-player-web-component/styles.css",
+        "node_modules/@project-sunbird/sunbird-video-player-web-component/styles.css",
+        "node_modules/@project-sunbird/sunbird-epub-player-web-component/styles.css",

      ],
      "scripts": [
        ...

+        "src/assets/libs/iziToast/iziToast.min.js",
+        "node_modules/jquery/dist/jquery.min.js",
+        "node_modules/jquery.fancytree/dist/jquery.fancytree-all-deps.min.js",
+        "src/assets/lib/dimmer.min.js",
+        "src/assets/lib/transition.min.js",
+        "src/assets/lib/modal.min.js",
+        "src/assets/lib/semantic-ui-tree-picker.js",
+        "node_modules/@project-sunbird/client-services/index.js",
+        "node_modules/@project-sunbird/sunbird-pdf-player-web-component/sunbird-pdf-player.js",
+        "node_modules/@project-sunbird/sunbird-video-player-web-component/sunbird-video-player.js",
+        "node_modules/@project-sunbird/sunbird-epub-player-web-component/sunbird-epub-player.js",

      ]
    }
  }
  ...
  ...
}
```
 

## :label: Step 4: Add question-cursor-implementation.service
Create a **`question-cursor-implementation.service.ts`** in a project and which will implement the `QuestionCursor` and `EditorCursor` abstract class.  
`QuestionCursor` and `EditorCursor` is an abstract class, exported from the library, which needs to be implemented. Basically it has some methods which should make an API request over HTTP  

Let's create the `question-cursor-implementation` service by running the following command:
```
cd src/app
ng g service question-cursor-implementation
```

Now open `app.module.ts` file and import like this:
 
```diff
+ import { EditorCursor } from 'collection-editor-library';
+ import { QuestionCursor } from '@project-sunbird/sunbird-quml-player';
+ import { EditorCursorImplementationService } from './editor-cursor-implementation.service';

@NgModule({
  providers: [
+    { provide: QuestionCursor, useExisting: EditorCursorImplementationService },
+    { provide: EditorCursor, useExisting: EditorCursorImplementationService }
  ],
})
export class AppModule { }

```


For more information refer [question-cursor-implementation.service.ts](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.7.0/src/app/editor-cursor-implementation.service.ts) and do not forgot to add your question list API URL
**For example:** `https://staging.sunbirded.org/api/question/v1/list`




## :label: Step 5: Import the modules and components

Include `CollectionEditorLibraryModule` in your app module:

```diff
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
+  import { CollectionEditorLibraryModule, EditorCursor } from '@project-sunbird/sunbird-collection-editor';
  import { RouterModule } from '@angular/router';
  import { QuestionCursor } from '@project-sunbird/sunbird-quml-player';
  import { EditorCursorImplementationService } from './editor-cursor-implementation.service';

  @NgModule({
   ...

   imports: [ 
+      CollectionEditorLibraryModule,
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

Once your library is imported, you can use its main component, `lib-editor` in your Angular application.

Add the <lib-editor> tag to the `app.component.html` like so:

```
<lib-editor [editorConfig]="editorConfig" (editorEmitter)="editorEventListener($event)"></lib-editor>
```

## :label: Step 6: Send input to render Collection Editor

Create a data.ts file which contains the `collectionEditorConfig`   Refer: [data.ts](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.8.0/src/app/data.ts)

(Note: `data.ts` contains the mock config used in component to send it as input to collection Editor. We need only [collectionEditorConfig](https://github.com/Sunbird-Ed/sunbird-collection-editor/blob/release-4.8.0/src/app/data.ts#L143).Use the mock config in your component to send input to collection editor as `editorConfig`)  

**app.component.ts**
```diff
   ...
+  import { collectionEditorConfig } from './data';
   @Component({
     ...
   })
   export class AppComponent {
     ...
+     public editorConfig: any = collectionEditorConfig;
   }
```

**app.component.html**

```html
<lib-editor [editorConfig]="editorConfig" (editorEmitter)="editorEventListener($event)"></lib-editor>
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
For more information refer this documentation: [CONFIGURATION.MD](/docs/CONFIGURATION.md)

### :small_red_triangle_down: Output Events
1. editorEmitter()    - It emits event for each action performed in the editor.
---


## :label: Step 7: Set the auth token and collection identifier
Go to the root directory - Open `server.js` file


Update the host variable to which env your pointing. example if you are pointing sunbird dev instance update variable like below
```javascript
const BASE_URL = 'dev.sunbirded.org'
const API_AUTH_TOKEN = 'XXXX'
const USER_TOKEN= 'YYYY'
```
Note: You will need actual `API_AUTH_TOKEN` and `USER_TOKEN`

If you are pointing to sunbird dev -> [dev.sunbirded.org](https://dev.sunbirded.org/), create a textbook in sunbird dev, copy the `textbook_id` from the browser url and set the do_id of textbook in the `data.ts` file

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
## :label: Step 8: Build the library
 
Run `npm run build-lib` to build the library. The build artifacts will be stored in the dist/ directory.
 
## :label: Step 9: Run the application
 
Before running the application, we have to start the node server to proxy the APIs by running the following command:

```
nodemon server.js
```

Once that is done, Use the following CLI command to run your application locally


```
npm run start
```

To see your application in the browser, go to [http://localhost:4200](http://localhost:4200).


# :bookmark_tabs: Editor Contribution and Configuration Guide

[Contribution guidelines for this project](docs/CONTRIBUTING.md)

[Configuration guidelines for this project](docs/CONFIGURATION.md)


## Code Quality

The project maintains code quality through automated checks that run on every pull request:

1. **Linting**
   - ESLint for code style and quality
   - Command: `npm run lint`

2. **Dependencies**
   - Uses `npm ` for deterministic installations
   - GitHub Actions cache for faster builds

3. **Testing**
   - Unit tests using Karma
   - Command: `npm run test-coverage`

These checks ensure consistent code style, secure dependency management, and reliable testing.
