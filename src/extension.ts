// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import TsMonorepoDefinitionProvider from './tsMonorepoDefinitionProvider'
import runTestFile from './runTestFile'
import ScssVarDefinitionProvider from './scssVarDefinitionProvider'
import toggleCommentStyle from './toggleCommentStyle'
import toggleTestFile from './toggleTestFile'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const toggleCommentSub = vscode.commands.registerCommand('toms-tools.toggleCommentStyle', () => toggleCommentStyle())
  const toggleTestSub = vscode.commands.registerCommand('toms-tools.toggleTestFile', () => toggleTestFile())
  const runTestSub = vscode.commands.registerCommand('toms-tools.runTestFile', () => runTestFile())
  const runTestWatchSub = vscode.commands.registerCommand('toms-tools.runTestFileWatch', () => runTestFile(true))

  context.subscriptions.push(toggleCommentSub)
  context.subscriptions.push(toggleTestSub)
  context.subscriptions.push(runTestSub)
  context.subscriptions.push(runTestWatchSub)

  const scssVarDefinitionProvider = vscode.languages.registerDefinitionProvider(
    ['vue', 'scss'],
    new ScssVarDefinitionProvider(),
  )
  const defProvider = vscode.languages.registerDefinitionProvider(
    ['javascript', 'typescript', 'vue'],
    new TsMonorepoDefinitionProvider(),
  )

  context.subscriptions.push(scssVarDefinitionProvider)
  context.subscriptions.push(defProvider)
}

// this method is called when your extension is deactivated
export function deactivate() {}
