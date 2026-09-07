import { defineConfig } from "vite";

const appVersion = Date.now().toString();

function versionPlugin(version) {
  const payload = JSON.stringify({ v: version });
  return {
    name: "app-version",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/version.json") {
          next();
          return;
        }
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(payload);
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: payload,
      });
    },
  };
}

export default defineConfig({
  base: "./",
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [versionPlugin(appVersion)],
  server: {
    port: 5173,
    host: true,
  },
});
