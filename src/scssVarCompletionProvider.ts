import * as vscode from 'vscode'

export default class ScssVarCompletionProvider implements vscode.CompletionItemProvider {
  constructor(private scssVars?: Map<string, string>) {}

  provideCompletionItems(): vscode.ProviderResult<
    vscode.CompletionList<vscode.CompletionItem> | vscode.CompletionItem[]
  > {
    if (!this.scssVars?.size) {
      return []
    }

    const results: vscode.CompletionItem[] = []
    for (const [key, val] of this.scssVars) {
      const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Variable)
      item.detail = val

      // Prevents double $ when selecting result
      const keyWithoutDollar = key.slice(1)
      item.insertText = keyWithoutDollar

      results.push(item)
    }

    return results
  }
}
