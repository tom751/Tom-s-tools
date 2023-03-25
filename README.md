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

`Toggle test file`: Switches between `*.spec.ts` file and its implementation file. Creates the test file if it doesn't exist.

### Run test file

`Run test file`: Opens a terminal, cd's to the correct workspace directory and runs `yarn unit` for the current open `*.spec.ts` file. If not in a test file, it will look for a `*.spec.ts` file that has the same name as the current open file and runs `yarn unit`.

### Run test file and watch

`Run test file and watch`: The same as "run test file" but adds `--watch` to the end of the command.
