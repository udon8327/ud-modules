import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";
import fs from "fs";
import portfinder from "portfinder";

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  const isDev = command === "serve";
  const useHttps = env.VITE_APP_DEV_HTTPS === "true";
  const useProxy = Boolean(env.VITE_APP_DEV_PROXY);

  // port 設定
  const basePort = Number(env.VITE_APP_DEV_PORT) || 8053;
  const devPort = isDev ? await portfinder.getPortPromise({ port: basePort }) : basePort;

  // https 設定
  let httpsConfig = false;
  let plugins = [vue()];

  if (isDev && useHttps) {
    if (
      env.VITE_APP_DEV_SSL_KEY &&
      env.VITE_APP_DEV_SSL_CERT &&
      fs.existsSync(env.VITE_APP_DEV_SSL_KEY) &&
      fs.existsSync(env.VITE_APP_DEV_SSL_CERT)
    ) {
      // 使用提供的 SSL 金鑰和憑證
      httpsConfig = {
        key: fs.readFileSync(env.VITE_APP_DEV_SSL_KEY),
        cert: fs.readFileSync(env.VITE_APP_DEV_SSL_CERT)
      };
    } else {
      // 使用 @vitejs/plugin-basic-ssl 自動生成自簽憑證
      plugins.push(basicSsl());
      httpsConfig = true;
    }
  }

  // proxy 設定
  const proxyConfig =
    isDev && useProxy
      ? {
          "/api": {
            target: env.VITE_APP_DEV_PROXY,
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, "")
          }
        }
      : {};

  return {
    base: env.VITE_APP_PUBLIC_PATH || "/",
    plugins: plugins,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: env.VITE_APP_DEV_HOST || "localhost",
      https: httpsConfig,
      proxy: proxyConfig,
      port: devPort
    },
    build: {
      outDir: env.VITE_APP_OUTPUT_DIR || "dist",
      sourcemap: mode === "development",
      assetsInlineLimit: 10240
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@use "@/style/variables" as *;`,
          quietDeps: true
        }
      }
    }
  };
});
