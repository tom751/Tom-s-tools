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

// Returns the path without the filename on the end
export function getDocumentFolderPath(filePath: string): string {
  return filePath.split('/').slice(0, -1).join('/')
}

// Returns just the filename from a path
export function getFileNameFromPath(filePath: string): string {
  return filePath.split('/').slice(-1).join('/')
}

// Returns the filename with an extension
export function getFileNameWithoutExtension(fileName: string): string {
  return fileName.split('.').slice(0, -1).join('.') || ''
}
