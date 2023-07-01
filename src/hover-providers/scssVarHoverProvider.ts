import * as vscode from 'vscode'
import { isInStyleTag } from '../utils/document'
import { scssVarRegex } from '../utils/search'

export default class ScssVarHoverProvider implements vscode.HoverProvider {
  constructor(private scssVars?: Map<string, string>) {}

  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
    if (!this.scssVars?.size) {
      return undefined
    }

    if (document.languageId === 'vue' && !isInStyleTag(document, position)) {
      return undefined
    }

    const wordRange = document.getWordRangeAtPosition(position, scssVarRegex)
    const varName = document.getText(wordRange)

    const result = this.scssVars.get(varName)
    if (!result) {
      return undefined
    }

    return new vscode.Hover(result)
  }
}
