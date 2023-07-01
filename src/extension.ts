import * as vscode from 'vscode'
import TsMonorepoDefinitionProvider from './definition-providers/tsMonorepoDefinitionProvider'
import runTestFile from './commands/runTestFile'
import ScssVarDefinitionProvider from './definition-providers/scssVarDefinitionProvider'
import toggleCommentStyle from './commands/toggleCommentStyle'
import toggleTestFile from './commands/toggleTestFile'
import ScssVarCompletionProvider from './completion-providers/scssVarCompletionProvider'
import { readScssVarFile } from './utils/bootstrap'
import { StateKeys } from './enums'
import ScssVarHoverProvider from './hover-providers/scssVarHoverProvider'

export async function activate(context: vscode.ExtensionContext) {
  await readScssVarFile(context)

  const toggleCommentSub = vscode.commands.registerCommand('toms-tools.toggleCommentStyle', () => toggleCommentStyle())
  const toggleTestSub = vscode.commands.registerCommand('toms-tools.toggleTestFile', () => toggleTestFile())
  const runTestSub = vscode.commands.registerCommand('toms-tools.runTestFile', () => runTestFile())
  const runTestWatchSub = vscode.commands.registerCommand('toms-tools.runTestFileWatch', () => runTestFile(true))

  const scssVarDefinitionProvider = vscode.languages.registerDefinitionProvider(
    ['vue', 'scss'],
    new ScssVarDefinitionProvider(),
  )
  const defProvider = vscode.languages.registerDefinitionProvider(
    ['javascript', 'typescript', 'vue'],
    new TsMonorepoDefinitionProvider(),
  )

  const scssCompletionItemProvider = vscode.languages.registerCompletionItemProvider(
    ['vue', 'scss'],
    new ScssVarCompletionProvider(context.globalState.get(StateKeys.ScssVars)),
    '$',
  )

  const scssVarHoverProvider = vscode.languages.registerHoverProvider(
    ['vue', 'scss'],
    new ScssVarHoverProvider(context.globalState.get(StateKeys.ScssVars)),
  )

  context.subscriptions.push(toggleCommentSub)
  context.subscriptions.push(toggleTestSub)
  context.subscriptions.push(runTestSub)
  context.subscriptions.push(runTestWatchSub)
  context.subscriptions.push(scssVarDefinitionProvider)
  context.subscriptions.push(defProvider)
  context.subscriptions.push(scssCompletionItemProvider)
  context.subscriptions.push(scssVarHoverProvider)
}

export function deactivate() {}
