import * as vscode from 'vscode'
import { searchForVar } from '../utils/search'

export default class TsMonorepoDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): Promise<vscode.Definition | vscode.LocationLink[]> {
    const aliasSetting = vscode.workspace
      .getConfiguration('tom.tsMonorepoDefinitionProvider')
      .get<Record<string, string>>('pathAliases')

    if (!aliasSetting || Object.keys(aliasSetting).length === 0) {
      return []
    }

    const aliases = Object.keys(aliasSetting)
    const line = document.lineAt(position)
    const matchingKey = aliases.find((alias) => line.text.includes(alias))

    if (!matchingKey) {
      return []
    }

    const aliasResolvesTo = aliasSetting[matchingKey]
    const aliasIndex = line.text.indexOf(matchingKey)
    const filePath = line.text
      .substring(aliasIndex + matchingKey.length)
      .replace("'", '')
      .replace(';', '')

    let glob = `**/${aliasResolvesTo}${filePath}`
    // Some imports already include the file extension
    if (!filePath.includes('.')) {
      // Append glob pattern for supported file types
      glob += '.{ts,tsx,js,vue}'
    }

    const foundFiles = await vscode.workspace.findFiles(glob)
    if (foundFiles.length > 0) {
      const wordRange = document.getWordRangeAtPosition(position)
      if (!wordRange) {
        return []
      }
      const importName = document.getText(new vscode.Range(wordRange.start, wordRange.end))

      const fileUri = foundFiles[0]
      const doc = await vscode.workspace.openTextDocument(fileUri)
      const startsWith = ['export', 'const', 'let', 'var']
      const location = searchForVar(doc, importName, startsWith)
      return {
        uri: fileUri,
        range: location?.range || new vscode.Range(0, 0, 0, 0),
      }
    }

    return []
  }
}
