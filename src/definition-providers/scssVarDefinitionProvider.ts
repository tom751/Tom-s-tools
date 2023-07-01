import * as vscode from 'vscode'
import { scssVarRegex, searchForVar } from '../utils/search'
import { isInStyleTag } from '../utils/document'

export default class ScssVarDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): Promise<vscode.Definition | vscode.LocationLink[]> {
    const pathSetting = vscode.workspace.getConfiguration('tom.scssVar').get<string>('variableFilePath')

    if (!pathSetting) {
      return []
    }

    if (document.languageId === 'vue' && !isInStyleTag(document, position)) {
      return []
    }

    const wordRange = document.getWordRangeAtPosition(position, scssVarRegex)
    const varName = document.getText(wordRange)

    const line = document.lineAt(position)
    if (!line.text.includes(varName)) {
      return []
    }

    const foundFiles = await vscode.workspace.findFiles(pathSetting)
    if (foundFiles.length === 0) {
      return []
    }

    const fileUri = foundFiles[0]
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const location = searchForVar(doc, varName)
    return location ? [location] : []
  }
}
