# Tom's tools vscode extension

## Install

Download the latest .vsix from the releases page

```sh
code --install-extension toms-tools-X.X.X.vsix
```

## Commands

All commands are prefixed `TOM:`

### Toggle comment style

`Toggle comment style`: Converts block comments to line comments

```js
/**
 * hello
 * world
 */
```

to

```js
// hello
// world
```

### Toggle test file

`Toggle test file`: Switches between `*.spec.{ts,tsx}` file and its implementation file. Creates the test file if it doesn't exist.

### Run test file

`Run test file`: Opens a terminal, cd's to the correct workspace directory and runs `npx vitest run` for the current open `*.spec.{ts,tsx}` file. If not in a test file, it will look for a `*.spec.{ts,tsx}` file that has the same name as the current open file and runs `npx vitest run`. The command can be changed in the extension setting `tom.runTestFile.script`.

### Run test file and watch

`Run test file and watch`: The same as "run test file" but runs in watch mode. The command can be changed in the extension setting `tom.runTestFileWatch.script`.

## Intellisense

### Monorepo go to definition improvements

Improves go to definition functionality in vscode for monorepos. Configure path aliases under a new setting `tom.tsMonorepoDefinitionProvider.pathAliases` with the key being the alias, and the value being the path to the folder within your workspace.

For example '@core' being the alias and 'src/projects/core/src' being the path.

If multiple definitions found, you can change `editor.gotoLocation.multipleDefinitions` to `goto`.

### SCSS variable go to definition

Allows ctrl + clicking on SCSS variables, providing all variables are defined in a single file. The file path must be configured with `tom.scssVar.variableFilePath`.

### SCSS variable hover

Hover over a SCSS variable to see its value, `tom.scssVar.variableFilePath` must be set for this to work.

### SCSS variable autocomplete

Adds autocomplete for SCSS variables, `tom.scssVar.variableFilePath` must be set for this to work.