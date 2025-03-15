# Table Block for Comet Components

Provides a table block for the WordPress editor that includes features missing from the core Gutenberg table block, such as merging and splitting cells, having table headers for rows (using `scope="row`), and adapting the layout for small viewports.

This is a fork of the [Flexible Table Block](https://github.com/t-hamano/flexible-table-block) plugin by [Aki Hamano](https://github.com/t-hamano). I have modified it to suit my needs as follows:
- use [Comet Components](https://github.com/doubleedesign/comet-components/) for front-end rendering
- remove some of the styling options because I control these from the themes I develop.

## Usage

You can install this repo straight into your `wp-content/plugins` directory and activate it from the WordPress admin. You just need to ensure that:
1. You have the [Comet Components](https://github.com/doubleedesign/comet-components/) plugin installed and activated 
2. you have the latest compiled version of the block code in the `build` directory of this plugin
3. `node_modules` will not be uploaded to your server (optional, but recommended)

### How to recompile

```sh
npm install
npm run build
```
