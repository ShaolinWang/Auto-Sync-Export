export interface ExportType {
  isDefault: boolean
  moduleName: string
}

const defaultExportRegex = /export default [A-Za-z]+/g
const namedExportRegex = /export \{[\s]*[\s\S]*[\s]*\}/g
const variableNameRegex = /[A-Za-z]+/g

export default function parse(content: string) {
  return [...parseDefaultExport(content), ...parseNamedExport(content)]
}

function parseNamedExport(content: string) {
  const result: ExportType[] = []
  const matches = content.match(namedExportRegex)
  if (!matches) return result

  for (const match of matches) {
    const variables = match.match(variableNameRegex) || []
    const moduleNames = variables.filter(segment => segment !== 'export')
    if (!moduleNames.length) return result

    result.push(
      ...moduleNames.map(moduleName => ({
        isDefault: false,
        moduleName,
      })),
    )
  }
  return result
}

function parseDefaultExport(content: string) {
  const result: ExportType[] = []
  const matches = content.match(defaultExportRegex)
  if (!matches || matches.length > 1) return result

  const variables = matches[0].match(variableNameRegex) || []
  const moduleName = variables.filter(
    segment => segment !== 'export' && segment !== 'default',
  )[0]
  if (!moduleName) return result

  result.push({
    isDefault: true,
    moduleName,
  })
  return result
}
