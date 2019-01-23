# Lambify Theme

The Lambify theme is built upon the Slate v1 Shopify build. The Lambify theme takes this base framework and adds a structure familiar to the Lamb Wordpress theme.
The theme is a bare bones theme designed to be used as a base for Shopify projects and provides all the appropriate tooling for efficient Shopify development.

[Github: Slate v1](https://github.com/Shopify/slate)

## System requirements

You'll want to ensure you have the following already installed on your local machine before getting started with Starter theme:

- **Node:** The current LTS (long-term support) release. We like to use a Node Version Manager like [NVM](https://github.com/creationix/nvm).

- **NPM 5+ or Yarn:** Both of these package managers have [ups and downs](https://blog.risingstack.com/yarn-vs-npm-node-js-package-managers/), choose whichever you prefer. Follow the installation instructions [for Yarn](https://yarnpkg.com/en/docs/install) or [NPM](https://www.npmjs.com/get-npm) to make sure you're using the latest version.

## Getting started

Slate provide all the necessary documentation for development. [Slate docs](https://github.com/Shopify/slate/wiki/).

To get started with the Lambify Theme clone the Lambify repository. Run the following command in your terminal:

```
$ npm install
```

Create a development Shopify store and connect it to the project store. For more information on connecting your new project with a Shopify store, see the [Slate docs](https://github.com/Shopify/slate/wiki/3.-Connect-to-your-store).

## Project structure

Your project will consist of the following file structure:

```bash
├── .babelrc [1]
├── .env [2]
├── .eslintrc [3]
├── .gitignore
├── .stylelintrc [4]
├── package.json [5]
├── slate.config.js [6]
├── yarn.lock [7]
└── src
   ├── assets
   │   ├── fonts
   │   ├── images
   │   ├── scripts [8]
   │   └── styles [9]
   │   └── svg [10]
   │   └── static [11]
   ├── config [12]
   ├── layout [12]
   ├── locales [12]
   ├── sections [12]
   ├── snippets [12]
   └── templates [12]
```

#### 1. Babel config

`.babelrc` (optional)

Starter Theme comes with [Babel](https://babeljs.io/) preconfigured with [`shopify/babel-preset-shopify`](https://github.com/Shopify/babel-preset-shopify). You can modify this config file based on your project requirements, or remove it completely if you do not wish to take advantage of ES6+ transpilation for legacy browser support

#### 2. Shopify API environment variables

`.env`

Slate will use the environment variables declared in this file to connect to deploy files to your Shopify store. For more information, visit the [`@shopify/slate-env` docs](https://github.com/Shopify/slate/wiki/Deploy-environments).

This file, along with any other `.env.{environment}` files, contain sensitive information and should not be commited to Github. These environment files are ignored by default in `.gitignore`.

#### 3. ESLint config

`.eslintrc` (optional)

Starter Theme comes with [ESLint](https://eslint.org/) preconfigured with [`shopify/eslint-plugin-shopify`](https://github.com/Shopify/eslint-plugin-shopify). You can modify this config file based on your project requirements, or remove it completely if you do not wish to have JavaScript linting in your project.

#### 4. Stylelint config

`.stylelintrc` (optional)

Starter Theme comes with [Stylelint](https://stylelint.io/) preconfigured with [`shopify/stylelint-config-shopify`](https://github.com/Shopify/stylelint-config-shopify). You can modify this config file based on your project requirements, or remove it completely if you do not wish to have style linting in your project.

#### 5. Package.json

`package.json`

A copy of the theme `package.json` will be included in your new project. It's a good idea to update its contents to match your new project, such as updating the name, version, repository, author and description.

The `package.json` includes NPM/Yarn scripts for you to be able to use Slate Tools commands easily (e.g. `yarn start`).

#### 6. Slate config

`slate.config.js`

The Slate config file enables users to customize Slate to their specific needs. For more information, visit the [`@shopify/slate-config` docs](https://github.com/Shopify/slate/wiki/Slate-config).

#### 7. Yarn.lock

`yarn.lock`

The Shopify Themes Team uses [Yarn](https://yarnpkg.com/en/) while developing themes because of its speed. However, Starter Theme works with NPM as well. Simply delete the `yarn.lock` file and run `npm install` to install the list of dependencies.

#### 8. JavaScript files

`src/assets/scripts`

This folder constains all your JS modules. A `theme.js` must be present, as it will act as the entry point for your JS application.

You can use ES6/ES2015's standard, which allows you to require your modules with the `import` syntax:

```js
import { contains } from 'lodash';
import Foo from './modules/foo';
// const Bar = require('./modules/bar') is also available if that's your jam!
```

The JavaScript has been setup to use a class structure for components, snippets and sections. 
When a component/snippet/section is added or removed it must be added or removed from the Autoloader class.

`
src/assets/scripts/class/Autoloader.js
`

The Autoloader class contains a variable `autoloadClasses` which handles the loading and instantiation of all component/snippet/section classes.

```js
let autoloadClasses = {
    'ComponentSelect': ComponentSelect,
    'CartModalSnippet': CartModalSnippet,
    'HeaderSection': HeaderSection,
};
```

When creating a component/snippet/section follow the pattern and structure of pre-existing classes.

#### 9. Sass, SCSS and CSS files

`src/assets/styles`

Slate fully supports `.css`, `.scss` and `.sass` files and their syntax, including `@import`.

You **must** include your style index file at the top of your `theme.js` file for Webpack to be able to load your styles into its build process. For example:

```js
import '../styles/theme.scss';
```

Liquid variables are accessible in `.css`, `.scss`, and `.sass` files via CSS custom properties that are declared in the `layout/theme.liquid`. For more information, visit the [Slate docs](https://github.com/Shopify/slate/wiki/Local-SASS-compilation).

#### 10. SVGs

`src/assets/svg`

On build, Slate moves all SVGs contained within this folder to the `snippets/` folder and renames them to `.liquid` files. To use an SVG in your theme, include it like any other snippet:

```liquid
{% include 'icon-shopify' %}
```

#### 11. Static folder

`src/assets/static`

Sometimes you need the ability to upload unmodified files to the Shopify server. This is where the `static` directory comes in. Any files placed inside this directory will be uploaded, as-is, to Shopify. To reference them in your `.liquid` files, you'll want to [ensure Webpack doesn't parse your liquid filters](https://github.com/Shopify/slate/wiki/Slate%20Tools#how-to-prevent-webpack-from-parsing-some-liquid-methods-and-filters) when referencing those files.

This special directory can be useful for files added by plugins you've installed, or for when you need to construct an image URL in Liquid.

#### 12. Shopify required files and folders

`src/config`, `src/layout/theme.liquid`, `src/locales`, `src/sections`, `src/snippets`, `src/templates/*.liquid`

The aforementioned [files and folders are required by Shopify](https://help.shopify.com/themes/development/templates) for any given theme.