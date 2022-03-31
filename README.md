# Sunbird Collection Editor

## Run Locally

`Use node version 14.15.0`

Fork the project

```bash
  https://github.com/Sunbird-Ed/sunbird-collection-editor.git
```

### Setting up the Collection Editor Library
Go to the root directory

```bash
  cd sunbird-collection-editor
```

Install dependencies

```bash
  npm install
```

Build the library

```bash
  npm run build-lib
```

It will create a `/dist/collection-editor-library` folder at the root directory and also copy all the required assets.


### Starting up Sample application

A sample angular application is included as part of this repo

In another terminal tab -

From the root directory - Start the server

```bash
  npm run start
```
The demo app will launch at `http://localhost:4200`

### Run Node server to proxy the APIs
From the root directory - go to `server.js` file
```bash
Update the host variable to which env your pointing. example if you are pointing sunbird dev instance update veriable like below
const host = 'dev.sunbirded.org'

add `authorization` token as shown below
proxyReqOpts.headers['authorization'] = 'Bearer XXXX'
```

### How to use NPM Sunbird-Questionset-Editor library in your Project

For help getting started with a new Angular app, check out the Angular CLI.

For existing apps, follow these steps to begin using .

###### Step 1: Install the following packages

    npm i @project-sunbird/sunbird-collection-editor-v9

######  Step 2: Include the Sunbird assets in angular.json

    "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "./node_modules/@project-sunbird/sunbird-collection-editor-v9/lib/assets/",
                "output": "/assets/"
              }
            ],

######  Step 3: Import the modules and components

Add to `NgModule` for the application in which you want to use:

    import { CollectionEditorLibraryModule } from 'sunbird-collection-editor-v9';


    @NgModule({
	    ...
	    imports: [
            CollectionEditorLibraryModule,
	    ...
    })

### How to use question editor
In your template add

	<lib-editor [editorConfig]="editorConfig" (editorEmitter)="editorEventListener($event)" ></lib-editor>

#### Input for library

A sample config file is included in the demo app at `src/app/data.ts`

    editorConfig: {
        context: {
            identifier: 'do_1132125506761932801130',
            user: {},
            framework: '',
            channel: '',
            uid: "
        },
        config: {
            mode: 'edit', // edit / review / read
            maxDepth: 0,
            objectType: 'QuestionSet',
            primaryCategory: 'Practice Question Set',
            isRoot: true,
            iconClass: 'fa fa-book',
            children: {
                Question: [
                    'Multiple Choice Question',
                    'Subjective Question'
                ]
            },
            hierarchy: {}
        }
    }
