import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

const isDocker = process.env.DOCKER_ENV === 'true';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact({ reactCompiler: true }), pluginTailwindcss(), pluginTypeCheck()],
  html: {
    template: './index.html',
  },
  output: {
    polyfill: 'usage',
  },
  server: {
    proxy: [
      {
        pathFilter: '/api',
        target: isDocker ? 'http://app-server:3100' : 'http://localhost:3100',
      },
    ],
  },
});
