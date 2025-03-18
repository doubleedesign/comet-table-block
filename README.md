# Table Block for Comet Components

Provides a table block for the WordPress editor that includes features missing from the core Gutenberg table block, such as merging and splitting cells, having table headers for rows (using `scope="row`), and adapting the layout for small viewports.

This is a fork of the [Flexible Table Block](https://github.com/t-hamano/flexible-table-block) plugin by [Aki Hamano](https://github.com/t-hamano). I have modified it to suit my needs and enhance the editor experience as follows:
- use [Comet Components](https://github.com/doubleedesign/comet-components/) for front-end rendering*
- remove some of the styling options because I control these from the themes I develop
- add a "first column is headers" option that automatically converts the first column cells to `<th scope="row">`
- if every cell in the first column of the body has been set to be a `<th>`, automatically toggle "first column is headers" on
- if every cell in the first row of the body has been set to be a `<th>`, automatically toggle "top header section" on and move the first row to the `<thead>` that that creates
- if the selected cells are in a defined header section, do not show the cell type or scope controls 
- in the "fixed headers" option, only show "fixed header row" if "top header section" is enabled and only show "fixed first column" if "first column header section" is enabled
- general tweaking of control positioning, label wording, etc.

*_The plugin itself contains very minimal styling for the output because it's assumed that Comet Components' CSS is available, and I want to avoid unnecessary duplication._

## Usage

You can install this repo straight into your `wp-content/plugins` directory and activate it from the WordPress admin. You just need to ensure that:
1. You have the [Comet Components](https://github.com/doubleedesign/comet-components/) plugin installed and activated 
2. you have the latest compiled version of the block code in the `build` directory of this plugin
3. `node_modules` will not be uploaded to your server (optional, but recommended)

### How to recompile

```bash
npm install
npm run build
```

### Development mode

Rebuild upon file changes:

```bash
npm install
npm run start
```
