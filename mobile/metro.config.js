const { getDefaultConfig } = require('expo/metro-config')
const { resolve: metroResolve } = require('metro-resolver')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
// Nested RN packages (e.g. @react-native/virtualized-lists) live under
// react-native/node_modules. Hierarchical lookup is required for the EAS
// "Bundle JavaScript" phase; nodeModulesPaths alone does not see them.

const originalResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const remap =
    typeof moduleName === 'string' &&
    moduleName.endsWith('.js') &&
    (moduleName.startsWith('.') || moduleName.startsWith('/'))
      ? moduleName.replace(/\.js$/, '')
      : moduleName

  const next = { ...context, resolveRequest: originalResolveRequest }
  if (originalResolveRequest) {
    return originalResolveRequest(next, remap, platform)
  }
  return metroResolve(next, remap, platform)
}

module.exports = config
