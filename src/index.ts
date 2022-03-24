import { Position, Uri, window, workspace } from 'vscode'
import type { ExportType } from './parse'
import parse from './parse'

const supportedFileExtensions = [
  'typescript',
  'typescriptreact',
  'javascript',
  'javascriptreact',
]

const map: Record<string, string> = {
  typescript: 'ts',
  typescriptreact: 'tsx',
  javascript: 'js',
  javascriptreact: 'jsx',
}

async function getIndexFileName(fileName: string) {
  const filePathSegments = fileName.split('/')
  filePathSegments.pop()
  for (const extension of supportedFileExtensions) {
    try {
      filePathSegments.push(`index.${map[extension]}`)
      await workspace.fs.readFile(Uri.file(filePathSegments.join('/')))
      break
    }
    catch (e) {
      filePathSegments.pop()
    }
  }
  return filePathSegments.join('/')
}

function getExportString(patch: ExportType, path?: string) {
  if (!path) return ''
  if (patch.isDefault) return `export { default as ${patch.moduleName} } from '${path}'`
  return `{export {${patch.moduleName}} from '${path}'}`
}

export function activate() {
  workspace.onDidSaveTextDocument(async(currentFileDocument) => {
    if (!supportedFileExtensions.includes(currentFileDocument.languageId))
      return

    const indexFileName = await getIndexFileName(currentFileDocument.fileName)

    if (indexFileName === currentFileDocument.fileName)
      return

    const patches = parse(currentFileDocument.getText())

    const path = `./${currentFileDocument.fileName.split('/').pop()?.split('.')[0]}`

    const indexFileDocument = await workspace.openTextDocument(
      indexFileName,
    )

    const output = patches
      .map(patch => getExportString(patch, path))
      .filter((patchStr) => {
        return !indexFileDocument.getText().includes(patchStr)
      })
      .map(patchStr => `${patchStr};`)
      .join('\n')

    if (!output) return

    await window.showTextDocument(indexFileDocument)
    window.activeTextEditor?.edit((editBuilder) => {
      editBuilder.insert(new Position(0, 0), `${output}\n`)
    })
  })
}

export function deactivate() {}
