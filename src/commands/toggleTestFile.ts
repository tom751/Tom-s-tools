import * as vscode from 'vscode'
import { getDocumentFolderPath, getFileNameFromPath, getFileNameWithoutExtension } from '../utils/document'

export default function toggleTestFile() {
  const editor = vscode.window.activeTextEditor
  if (editor) {
    const folder = getDocumentFolderPath(editor.document.fileName)
    const fileName = getFileNameFromPath(editor.document.fileName)
    const fileNameWithoutExtension = getFileNameWithoutExtension(fileName)
    const isInTestFile = fileName.endsWith('.spec.ts') || fileName.endsWith('.spec.tsx')
    const isTsx = fileName.endsWith('.tsx')
    const testFileName = `${fileNameWithoutExtension}.spec.${isTsx ? 'tsx' : 'ts'}`

    const params: SwitchFileParams = {
      folder,
      fileNameToCreate: !isInTestFile ? testFileName : undefined,
      searchGlob: isInTestFile ? `${fileNameWithoutExtension}.{ts,tsx,js,vue}` : testFileName,
    }

    switchFile(params)
  }
}

interface SwitchFileParams {
  folder: string
  fileNameToCreate?: string
  searchGlob: string
}

function switchFile({ folder, fileNameToCreate, searchGlob }: SwitchFileParams) {
  const pattern = new vscode.RelativePattern(folder, searchGlob)
  vscode.workspace.findFiles(pattern).then((vals) => {
    if (vals.length > 0) {
      // Open the file
      openDocument(vals[0].fsPath)
    } else if (fileNameToCreate) {
      // Create the file
      const filePath = vscode.Uri.file(`${folder}/${fileNameToCreate}`)
      const wsedit = new vscode.WorkspaceEdit()
      wsedit.createFile(filePath)
      vscode.workspace.applyEdit(wsedit).then(
        () => openDocument(filePath.fsPath),
        (err) => vscode.window.showErrorMessage('Error creating file', err),
      )
    } else {
      vscode.window.showWarningMessage('Could not find file to switch to')
    }
  })
}

function openDocument(filePath: string) {
  vscode.workspace.openTextDocument(filePath).then(
    (doc) => vscode.window.showTextDocument(doc, { preview: false }),
    (err) => vscode.window.showErrorMessage('Error switching to file', err),
  )
}
