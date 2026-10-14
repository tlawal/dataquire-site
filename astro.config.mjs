import {defineConfig} from "astro/config";
import {leadMiddleware} from "./lib/webhook-proxy.js";

export default defineConfig({
  site: "https://dataquire.si",
  output: "static",
  devToolbar: {enabled:false},
  integrations: [{
    name: "dataquire-local-webhook",
    hooks: {
      "astro:server:setup": ({server}) => {
        server.middlewares.use(leadMiddleware());
      }
    }
  }]
});
