import * as vscode from 'vscode'

export default function toggleCommentStyle() {
  const editor = vscode.window.activeTextEditor
  if (editor) {
    const document = editor.document
    const selection = editor.selection
    const currentLineNumber = selection.active.line
    const { text } = document.lineAt(currentLineNumber)
    const lines: Line[] = [{ lineNumber: currentLineNumber, text }]
    const textTrimmed = text.trim()

    if (textTrimmed.startsWith('/**')) {
      lines.push(...getLinesBelow(currentLineNumber + 1, document))
    } else if (textTrimmed.startsWith('*/')) {
      lines.push(...getLinesAbove(currentLineNumber - 1, document))
    } else if (textTrimmed.startsWith('*')) {
      lines.push(...getLinesBelow(currentLineNumber + 1, document))
      lines.push(...getLinesAbove(currentLineNumber - 1, document))
    } else {
      // not a comment, return
      return
    }

    editor.edit((editBuilder) => {
      lines.forEach((line) => {
        if (line.text.trim().startsWith('/*') || line.text.trim().startsWith('*/')) {
          const range = document.lineAt(line.lineNumber).rangeIncludingLineBreak
          editBuilder.delete(range)
        } else {
          const range = document.lineAt(line.lineNumber).range

          const lineText = line.text.replace(' *', '//')
          editBuilder.replace(range, lineText)
        }
      })
    })
  }
}

interface Line {
  lineNumber: number
  text: string
}

function getLinesAbove(startingLineNumber: number, document: vscode.TextDocument): Line[] {
  const lines: Line[] = []
  let foundTop = false
  let lineNumber = startingLineNumber

  while (!foundTop) {
    const { text } = document.lineAt(lineNumber)
    const textTrimmed = text.trim()

    lines.push({ text, lineNumber })
    if (textTrimmed.startsWith('/**')) {
      foundTop = true
    }
    lineNumber--
  }

  return lines
}

function getLinesBelow(startingLineNumber: number, document: vscode.TextDocument): Line[] {
  const lines: Line[] = []
  let foundBottom = false
  let lineNumber = startingLineNumber

  while (!foundBottom) {
    const { text } = document.lineAt(lineNumber)
    const textTrimmed = text.trim()

    lines.push({ text, lineNumber })
    if (textTrimmed.startsWith('*/')) {
      foundBottom = true
    }
    lineNumber++
  }

  return lines
}
