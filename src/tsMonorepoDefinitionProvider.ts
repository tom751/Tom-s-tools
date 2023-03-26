import * as vscode from 'vscode'

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
      // TODO - navigate to export in file
      console.log('found')
      return {
        uri: foundFiles[0],
        range: new vscode.Range(0, 0, 0, 0),
      }
    } else {
      console.log('found nothing')
      return []
    }
  }
}
