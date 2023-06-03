import * as vscode from 'vscode'

export default async function runTestFile(watch = false) {
  const editor = vscode.window.activeTextEditor
  if (editor) {
    let fileUri = editor.document.uri
    const fileName = editor.document.fileName
    const fileNameParts = fileName.split('/')
    const file = fileNameParts.pop() || ''

    if (!file.endsWith('.spec.ts')) {
      // Switch to the test file
      const folder = fileNameParts.join('/')
      const fileNameWithoutExtension = file.split('.').shift() || ''
      const pattern = new vscode.RelativePattern(folder, `${fileNameWithoutExtension}.spec.ts`)

      const vals = await vscode.workspace.findFiles(pattern)
      if (vals.length > 0) {
        fileUri = vals[0]
      } else {
        vscode.window.showInformationMessage('Could not find a suitable test file to run')
        return
      }
    }

    const projectIndex = fileName.lastIndexOf('/src/')
    if (projectIndex === -1) {
      return
    }

    const projectPath = fileName.slice(0, projectIndex)
    const relativePath = vscode.workspace.asRelativePath(fileUri)

    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Terminal')
    terminal.show()

    const command = `cd ${projectPath} && yarn unit ${relativePath} ${watch ? '--watch' : ''}`
    terminal.sendText(command)
  }
}
