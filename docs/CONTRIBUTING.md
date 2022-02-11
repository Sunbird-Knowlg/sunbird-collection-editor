# Welcome to Editor contributing guide <!-- omit in toc -->

In this guide you will get an overview of the contribution workflow of the editor.

**If you don't have git on your machine,** [install it](https://help.github.com/articles/set-up-git/).

## Getting started

#### Fork the project
```
https://github.com/Sunbird-Ed/sunbird-collection-editor.git
```
#### Clone the repository

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the copy to clipboard icon.

Open a terminal and run the following git command:

```
git clone "url you just copied"
```
For example: `git clone https://github.com/Sunbird-Ed/sunbird-collection-editor.git`

#### Go to the root directory and run the following command

```
cd sunbird-collection-editor
```

#### Install dependencies

```
npm install
```

#### Build the library

```
npm run build-lib
```

It will create a `/dist/collection-editor-library` folder at the root directory and also copy all the required assets.

### Starting up the Sample application

A sample angular application is included as part of this repo
In another terminal tab -

From the root directory - Start the server


```
npm run start
```

The demo app will launch at http://localhost:4200


### Set the auth token and textbook identifier

From the root directory - go to `server.js` file


Update the host variable to which env your pointing. example if you are pointing sunbird dev instance update variable like below
```javascript
const BASE_URL = 'dev.sunbirded.org'
const API_AUTH_TOKEN = 'XXXX'
const USER_TOKEN= 'YYYY'
```
Note: You will need actual `API_AUTH_TOKEN` and `USER_TOKEN`

If you are pointing to sunbird dev ([dev.sunbirded.org](https://dev.sunbirded.org/)), create a textbook in sunbird dev and set the do_id of textbook in `data.ts` file

```javascript
export const collectionEditorConfig = {
  context: {
    ...
    identifier: 'do_id', // identifier of textbook created in sunbird dev
    ...
  },
  config: {
    ...
    ...
  }
}
```
Run Node server to proxy the APIs (Open one more terminal in root folder and run the server.js ) as:


  ```
nodemon server.js
```

**Create a working branch and start with your changes!**
