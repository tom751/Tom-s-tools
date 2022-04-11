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
