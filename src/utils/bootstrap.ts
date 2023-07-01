import * as vscode from 'vscode'
import { StateKeys } from '../enums'
import { scssVarRegex } from './search'

export async function readScssVarFile(context: vscode.ExtensionContext): Promise<void> {
  const pathSetting = vscode.workspace.getConfiguration('tom.scssVar').get<string>('variableFilePath')
  if (!pathSetting) {
    return
  }

  const foundFiles = await vscode.workspace.findFiles(pathSetting)
  if (foundFiles.length === 0) {
    return
  }

  const fileUri = foundFiles[0]
  const doc = await vscode.workspace.openTextDocument(fileUri)
  const lines = doc.getText().split('\n')
  const scssVars = new Map<string, string>()

  for (const line of lines) {
    const varName = line.match(scssVarRegex)
    if (!varName) {
      continue
    }

    const parts = line.split(':')
    const endPart = parts.pop()
    const value = endPart?.slice(1, endPart.length - 1)
    if (!value) {
      continue
    }

    scssVars.set(varName[0], value)
  }

  context.globalState.update(StateKeys.ScssVars, scssVars)
}
