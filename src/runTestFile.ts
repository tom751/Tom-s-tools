import * as vscode from 'vscode'

export default function runTestFile(watch: boolean = false) {
  const editor = vscode.window.activeTextEditor
  if (editor) {
    const fileName = editor.document.fileName
    editor.document.uri
    const fileNameParts = fileName.split('/')
    const file = fileNameParts.pop() || ''

    if (!file.endsWith('.spec.ts')) {
      // For now don't do anything else
      vscode.window.showInformationMessage(`This isn't a test file`)
      return
    }

    const projectIndex = fileName.lastIndexOf('/src/')
    if (projectIndex === -1) {
      return
    }
    const projectPath = fileName.slice(0, projectIndex)
    const relativePath = vscode.workspace.asRelativePath(editor.document.uri)

    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Terminal')
    terminal.show()

    const command = `cd ${projectPath} && yarn unit ${relativePath} ${watch ? '--watch' : ''}`
    terminal.sendText(command)
  }
}
