import * as vscode from 'vscode'
import TsMonorepoDefinitionProvider from './tsMonorepoDefinitionProvider'
import runTestFile from './runTestFile'
import ScssVarDefinitionProvider from './scssVarDefinitionProvider'
import toggleCommentStyle from './toggleCommentStyle'
import toggleTestFile from './toggleTestFile'
import ScssVarCompletionProvider from './scssVarCompletionProvider'
import { readScssVarFile } from './utils/bootstrap'
import { StateKeys } from './enums'
import runModifiedTestFiles from './runModifiedTestFiles'

export async function activate(context: vscode.ExtensionContext) {
  await readScssVarFile(context)

  const toggleCommentSub = vscode.commands.registerCommand('toms-tools.toggleCommentStyle', () => toggleCommentStyle())
  const toggleTestSub = vscode.commands.registerCommand('toms-tools.toggleTestFile', () => toggleTestFile())
  const runTestSub = vscode.commands.registerCommand('toms-tools.runTestFile', () => runTestFile())
  const runTestWatchSub = vscode.commands.registerCommand('toms-tools.runTestFileWatch', () => runTestFile(true))
  const runModifiedTestFilesSub = vscode.commands.registerCommand('toms-tools.runModifiedTestFiles', () =>
    runModifiedTestFiles(),
  )

  const scssVarDefinitionProvider = vscode.languages.registerDefinitionProvider(
    ['vue', 'scss'],
    new ScssVarDefinitionProvider(),
  )
  const scssCompletionItemProvider = vscode.languages.registerCompletionItemProvider(
    ['vue', 'scss'],
    new ScssVarCompletionProvider(context.globalState.get(StateKeys.ScssVars)),
    '$',
  )
  const defProvider = vscode.languages.registerDefinitionProvider(
    ['javascript', 'typescript', 'vue'],
    new TsMonorepoDefinitionProvider(),
  )

  context.subscriptions.push(toggleCommentSub)
  context.subscriptions.push(toggleTestSub)
  context.subscriptions.push(runTestSub)
  context.subscriptions.push(runTestWatchSub)
  context.subscriptions.push(runModifiedTestFilesSub)
  context.subscriptions.push(scssVarDefinitionProvider)
  context.subscriptions.push(defProvider)
  context.subscriptions.push(scssCompletionItemProvider)
}

export function deactivate() {}
