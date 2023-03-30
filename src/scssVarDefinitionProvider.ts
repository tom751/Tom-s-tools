import * as vscode from 'vscode'

export default class ScssVarDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): Promise<vscode.Definition | vscode.LocationLink[]> {
    const pathSetting = vscode.workspace.getConfiguration('tom.scssVar').get<string>('variableFilePath')

    if (!pathSetting) {
      return []
    }

    const wordRange = document.getWordRangeAtPosition(position)
    let varName = document.getText(wordRange)
    if (!varName.startsWith('$')) {
      varName = `$${varName}`
    }

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
    const location = this.searchForVar(doc, varName)
    return location ? [location] : []
  }

  private searchForVar(doc: vscode.TextDocument, varName: string) {
    const lines = doc.getText().split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes(varName)) {
        return new vscode.Location(doc.uri, new vscode.Position(i, 0))
      }
    }
    return null
  }
}
