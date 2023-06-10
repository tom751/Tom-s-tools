import * as vscode from 'vscode'

// Returns whether the position is within vue style tags
export function isInStyleTag(document: vscode.TextDocument, position: vscode.Position): boolean {
  const lines = document.getText().split('\n')
  const styleTagStart = lines.findIndex((l) => l.startsWith('<style') && l.includes('lang="scss"'))
  const styleTagEnd = lines.findIndex((l) => l.startsWith('</style>'))

  if (styleTagStart === -1 || styleTagEnd === -1) {
    // No style tag in this document
    return false
  }

  const styleTagStartLine = document.lineAt(styleTagStart)
  const styleTagEndLine = document.lineAt(styleTagEnd)

  return position.isAfter(styleTagStartLine.range.end) && position.isBefore(styleTagEndLine.range.end)
}
