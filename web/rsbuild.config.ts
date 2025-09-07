import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const isDocker = process.env.DOCKER_ENV === "true";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    proxy: [
      {
        context: "/api",
        target: isDocker ? "http://app-server:3001" : "http://localhost:3001",
      },
    ],
  },
});
