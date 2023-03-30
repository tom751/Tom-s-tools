import * as vscode from 'vscode'

export function searchForVar(doc: vscode.TextDocument, varName: string, lineStartsWith: string[] = ['']) {
  const lines = doc.getText().split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes(varName) && lineStartsWith.some((l) => line.startsWith(l))) {
      return new vscode.Location(doc.uri, new vscode.Position(i, 0))
    }
  }
  return null
}
