# Tom's tools vscode extension

## Install

Download the .vsix from the releases page

```sh
code --install-extension filename.vsix
```

## Commands

### toggle comment style

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

### toggle test file

`Toggle test file`: Switches between `*.spec.ts` file and its implementation file. Creates the test file if it doesn't exist.

### run test file

`Run test file`: Opens a terminal, cd's to the correct workspace directory and runs `yarn unit` for the current open `*.spec.ts` file.

### run test file and watch

`Run test file and watch`: The same as "run test file" but adds `--watch` to the end of the command.
