// JavaScript shim for Prisma client - loaded at runtime
// This file is used as a webpack alias to avoid TypeScript parsing issues

module.exports = function getPrismaClient() {
  // This function will be called at runtime to get the actual PrismaClient
  const path = require('path');
  const clientPath = path.resolve(__dirname, '../node_modules/.prisma/client/client.ts');
  
  // Register ts-node
  process.env.TS_NODE_SKIP_IGNORE = 'true';
  if (!require.extensions['.ts']) {
    require('ts-node').register({
      transpileOnly: true,
      skipIgnore: true,
      compilerOptions: {
        module: 'commonjs',
        target: 'es2020',
        esModuleInterop: true,
        skipLibCheck: true,
      },
    });
  }
  
  // Change to client directory for proper resolution
  const originalCwd = process.cwd();
  const clientDir = path.dirname(clientPath);
  process.chdir(clientDir);
  
  try {
    const clientModule = require('./client.ts');
    return clientModule.PrismaClient;
  } finally {
    process.chdir(originalCwd);
  }
};


