import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

const isDocker = process.env.DOCKER_ENV === 'true';

export default defineConfig({
  plugins: [pluginReact(), pluginTypeCheck()],
  server: {
    proxy: [
      {
        pathFilter: '/api',
        target: isDocker ? 'http://app-server:3100' : 'http://localhost:3100',
      },
    ],
  },
});
