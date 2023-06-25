import * as vscode from 'vscode'
import { GitExtension } from './types/git'
import { constants } from 'fs'
import { access } from 'fs/promises'

export default async function runModifiedTestFiles() {
  const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')
  if (!gitExtension) {
    vscode.window.showErrorMessage('Git extension not installed')
    return
  }

  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    vscode.window.showInformationMessage('Not in a workspace folder')
    return
  }

  const api = gitExtension.exports.getAPI(1)
  const rootPath = vscode.workspace.workspaceFolders[0].uri
  const repo = api.repositories.find((r) => r.rootUri.fsPath === rootPath.fsPath)
  if (!repo) {
    vscode.window.showInformationMessage('Not in a Git repository')
    return
  }

  const indexChanges = repo.state.indexChanges.map((f) => f.uri.path)
  const workingTreeChanges = repo.state.workingTreeChanges.map((f) => f.uri.path)
  const modifiedFilePaths = [...new Set([...indexChanges, ...workingTreeChanges])]
  const modifiedTestFilePaths = modifiedFilePaths.filter((p) => p.endsWith('.spec.ts'))
  const unmodifiedTestsToRun = await getUnmodifiedTestsToRun(modifiedFilePaths)

  const testsToRun = [...modifiedTestFilePaths, ...unmodifiedTestsToRun]
  runTests(testsToRun)
}

/**
 * Get the list of files that we need to check whether they have a test
 * because the related file has been modified
 * @param modifiedFilePaths The filepath list of modified files
 */
async function getUnmodifiedTestsToRun(modifiedFilePaths: string[]): Promise<string[]> {
  const results: string[] = []

  // The list of files that we need to check whether they have a test, because
  // a related test file isn't in the list of current changes
  const filesThatMightHaveTests = modifiedFilePaths.filter((p) => {
    if (p.endsWith('.spec.ts')) {
      return false
    }

    // This assumes tests are in the same directory as the file being tested
    // Note this won't match anything in a __tests__ directory
    const pathToCheck = `${p.split('.')[0]}.spec.ts`
    const testFileAlreadyModified = modifiedFilePaths.find((fp) => fp === pathToCheck)
    return !testFileAlreadyModified
  })

  if (filesThatMightHaveTests.length === 0) {
    return results
  }

  const testFilesToSearchFor = filesThatMightHaveTests.map((f) => `${f.split('.')[0]}.spec.ts`)

  // Check whether that file exists
  for (const file of testFilesToSearchFor) {
    try {
      await access(file, constants.F_OK)
      results.push(file)
      console.log('file exists', file)
    } catch {
      // File doesn't exist, do nothing
      console.log('file doesnt exist', file)
    }
  }

  return results
}

/**
 * Run the tests of the provided file paths
 * @param filePaths The file paths of the tests to run
 */
function runTests(filePaths: string[]): void {
  // Group paths by project
  const projectGroups = new Map<string, string[]>()
  for (const file of filePaths) {
    const relativePath = vscode.workspace.asRelativePath(file)
    const projectIndex = file.lastIndexOf('/src/')

    if (projectIndex === -1) {
      continue
    }

    const projectPath = file.slice(0, projectIndex)
    if (!projectGroups.has(projectPath)) {
      projectGroups.set(projectPath, [relativePath])
      continue
    }

    // rome-ignore lint/style/noNonNullAssertion: Checking whether the key exists above
    const currentPaths = projectGroups.get(projectPath)!
    projectGroups.set(projectPath, [...currentPaths, relativePath])
  }

  let command = ''
  for (const projectPath of projectGroups.keys()) {
    // rome-ignore lint/style/noNonNullAssertion: Looping over keys
    const filesInProject = projectGroups.get(projectPath)!
    const list = filesInProject.join(' ')

    if (command) {
      command += ' && '
    }

    command += `cd ${projectPath} && yarn unit ${list}`
  }

  const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Terminal')
  terminal.show()
  terminal.sendText(command)
}
