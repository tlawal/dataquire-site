import {defineConfig} from "astro/config";
import {leadMiddleware} from "./lib/webhook-proxy.js";
import {redirectAlias} from "./lib/route-aliases.js";

export default defineConfig({
  site: "https://dataquire.si",
  output: "static",
  devToolbar: {enabled:false},
  integrations: [{
    name: "dataquire-local-webhook",
    hooks: {
      "astro:server:setup": ({server}) => {
        server.middlewares.use(redirectAlias);
        server.middlewares.use(leadMiddleware());
      }
    }
  }]
});
