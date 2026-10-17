import { blueprintStaticGeneration } from "./build/static-generation.mjs";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import emdash from "emdash/astro";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { unified } from "@astrojs/markdown-remark";
import { fileURLToPath } from "node:url";
import { designSections } from "./src/lib/design-sections.mjs";
import { emdashPublicationPolicy } from "./src/lib/emdash-publication-policy.ts";
import {
  rehypeCode,
  remarkCodeTab,
  remarkHeading,
  remarkNpm,
  remarkStructure,
} from "fumadocs-core/mdx-plugins";

const astroConfig = {
  output: "server",
  adapter: cloudflare({
    configPath: "./wrangler.jsonc",
    imageService: "passthrough",
    sessionKVBindingName: "SESSION",
  }),
  build: { format: "file" },
  trailingSlash: "never",
  server: {
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 4321,
  },
  markdown: {
    processor: unified({
      syntaxHighlight: false,
      remarkPlugins: [
        remarkHeading,
        remarkCodeTab,
        remarkNpm,
        designSections,
        [remarkStructure, { exportAs: "structuredData" }],
      ],
      rehypePlugins: [rehypeCode],
    }),
  },
  integrations: [
    await blueprintStaticGeneration(
      fileURLToPath(new URL("./", import.meta.url)),
    ),
    react(),
    mdx({ extendMarkdownConfig: true, syntaxHighlight: false }),
    emdash({
      toolbar: false,
      database: d1({ binding: "BLUEPRINT_DB" }),
      storage: r2({ binding: "BLUEPRINT_MEDIA" }),
      plugins: [
        emdashPublicationPolicy(
          fileURLToPath(
            new URL("./src/lib/emdash-publication-policy.ts", import.meta.url),
          ),
        ),
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
};

export default astroConfig;
