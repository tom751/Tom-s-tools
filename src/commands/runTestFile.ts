import * as vscode from 'vscode'
import { getDocumentFolderPath, getFileNameFromPath, getFileNameWithoutExtension } from '../utils/document'

export default async function runTestFile(watch = false) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active text editor')
    return
  }

  const scriptToRun = vscode.workspace
    .getConfiguration(watch ? 'tom.runTestFileWatch' : 'tom.runTestFile')
    .get<string>('script')

  if (!scriptToRun) {
    vscode.window.showErrorMessage(
      'No script to run - you need to set extension setting tom.runTestFile.script and tom.runTestFileWatch.script e.g. `npm t`',
    )
    return
  }

  let fileUri = editor.document.uri
  const fileName = getFileNameFromPath(editor.document.fileName)

  if (!fileName.endsWith('.spec.ts') && !fileName.endsWith('.spec.tsx')) {
    // Switch to the test file
    const folder = getDocumentFolderPath(editor.document.fileName)
    const fileNameWithoutExtension = getFileNameWithoutExtension(fileName)
    const pattern = new vscode.RelativePattern(folder, `${fileNameWithoutExtension}.spec.{ts,tsx}`)

    const vals = await vscode.workspace.findFiles(pattern)
    if (vals.length > 0) {
      fileUri = vals[0]
    } else {
      vscode.window.showInformationMessage('Could not find a suitable test file to run')
      return
    }
  }

  const projectIndex = editor.document.fileName.lastIndexOf('/src/')
  if (projectIndex === -1) {
    return
  }

  const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Terminal')
  terminal.show()

  const projectPath = editor.document.fileName.slice(0, projectIndex)
  const command = `cd ${projectPath} && ${scriptToRun} ${fileUri.path}`
  terminal.sendText(command)
}
