import { findExports, hasESMSyntax } from 'mlly'
export interface ExportType {
  isDefault: boolean
  moduleName: string
}

export default function parse(content: string) {
  if (!hasESMSyntax(content))
    return []
  const a = findExports(content).reduce((acc, exportType) => {
    if (exportType.type === 'default') {
      acc.push({
        isDefault: true,
        moduleName: 'unknown',
      })
      return acc
    }
    acc.push(...exportType.names
      .filter(name => !!name)
      .map(name => ({
        isDefault: false,
        moduleName: name,
      })),
    )
    return acc
  }, [] as ExportType[])
  return a
}
