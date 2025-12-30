import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Treat Prisma client as external (server-only)
  serverExternalPackages: ["@prisma/client"],
  // Also externalize the generated client path
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add alias to redirect Prisma client imports to our JS shim
      config.resolve.alias = {
        ...config.resolve.alias,
        // Redirect .prisma/client/client.ts imports to our shim (match both absolute and relative paths)
        [path.resolve(__dirname, 'node_modules/.prisma/client/client.ts')]: 
          path.resolve(__dirname, 'lib/prisma-shim.js'),
        // Also match relative imports from lib/
        '../node_modules/.prisma/client/client': 
          path.resolve(__dirname, 'lib/prisma-shim.js'),
        '../../node_modules/.prisma/client/client': 
          path.resolve(__dirname, 'lib/prisma-shim.js'),
      };
      
      // Add a rule to ignore .ts files in .prisma/client (as backup)
      config.module.rules.push({
        test: /node_modules\/\.prisma\/client\/.*\.ts$/,
        use: {
          loader: 'null-loader',
        },
      });
      
      // Externalize Prisma client completely
      const originalExternals = config.externals;
      const externalsFunction = ({ request }: any) => {
        if (!request) return;
        
        // Externalize any Prisma-related imports
        if (
          request.includes('@prisma/client') || 
          request.includes('.prisma/client')
        ) {
          return `commonjs ${request}`;
        }
      };
      
      if (typeof originalExternals === 'function') {
        config.externals = [originalExternals, externalsFunction];
      } else if (Array.isArray(originalExternals)) {
        config.externals = [...originalExternals, externalsFunction];
      } else {
        config.externals = [originalExternals, externalsFunction];
      }
    }
    return config;
  },
};

export default nextConfig;
