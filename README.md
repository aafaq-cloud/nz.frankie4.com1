# Lambify

Lambify is a Shopify theme and build-tooling system designed to enable an efficient workflow in creating and maintaining custom Shopify themes.

## Structure

Lambify v2 separates compiled code from template code. Under the `src` folder, there are 5 subfolders:

- **Theme** - this is where all the Shopify template files live. They will be copied across to the site with no further processing. You can put pre-compiled assets in the assets folder, and icons will be made available as snippets - for example, you could use `{% render 'icon-chevron' %}` to inline that icon.
- **Interface** - This houses compile-able assets (scripts, styles and icons). The Autoloader here can be used to load sections, snippets and components on-demand.

## Commands

With the 2.0.0 release, Lambify now uses custom scripts to compile and upload files to Shopify themes (formerly based on Slate v1). If you are used to the workflows with Slate v0 or v1, these are similar, but not necessarily equivalent.

- `npm start`. Refreshes the `dist` folder to match current theme assets, watches for changes to theme template files / assets and boots Webpack Dev Server. **IMPORTANT** - this command syncs up `script-tags` and `style-tags` to point to your local assets but does not push up the whole theme.
- `npm run deploy`. Rebuilds and pushes up the current code to the server.
- `npm run go-live`. **NEW** this command runs a production build and syncs up compiled assets as well as `script-tags` and `style-tags` so that they point to the live files.


## Online Store 2.0
Lambify uses json templates and is Online Store 2.0 compatible. Because data is tied to the json template, all files in the template folder are added to the deployment ignore. This is to keep data management out of the repository.
New templates created will either need to be made on live or on a theme that will be deployed.
