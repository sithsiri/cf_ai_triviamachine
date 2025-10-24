import path from "node:path";
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  environments: {
    ssr: {
      keepProcessEnv: true
    }
  },
  // ensure the test runner resolves the same '@' alias as Vite
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    // https://github.com/cloudflare/workers-sdk/issues/9822
    deps: {
      optimizer: {
        ssr: {
          include: ["ajv"]
        }
      }
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" }
      }
    }
  }
});
