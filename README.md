# es6-npm-package
An ES6 npm module boilerplate which will transpile to ES5 when publishing.  Start coding and stop worrying!

## Install

```bash
$ git clone https://github.com/jcharrell/es6-npm-package.git your-module-name
$ cd your-module-name
$ rm -rf .git
$ git init
$ git remote add origin https://github.com/user/your-module-name.git
$ npm install
```

Update the name, description, author, and repository within `package.json`.

## Structure
Your original ES6 source code should exist within `src/`.  This boilerplate configuration defines the entry of the module as `dist/main.js`.  When publishing the npm module a `prepublish` task is automatically executed, which will transpile the original ES6 source code and store it within the `dist/` folder.

Mocha test scripts are located within `test/` and support generators via [co-mocha](https://github.com/blakeembrey/co-mocha).

The `.npmignore` file, defines the exclusion of the `src/` and `test/` folders from the published npm module.

## Usage
To publish your npm module, you must first have a registered account with [npm](https://www.npmjs.com/).

- Link the project with npm  
-- `$ npm adduser`
- Test your code!  You wrote tests right?  
-- `$ npm test`
- Publish to npm  
-- `$ npm publish`
