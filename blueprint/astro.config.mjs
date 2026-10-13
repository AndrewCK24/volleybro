import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import emdash from "emdash/astro";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { unified } from "@astrojs/markdown-remark";
import { designSections } from "./src/lib/design-sections.mjs";
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
    react(),
    mdx({ extendMarkdownConfig: true, syntaxHighlight: false }),
    emdash({
      database: d1({ binding: "BLUEPRINT_DB" }),
      storage: r2({ binding: "BLUEPRINT_MEDIA" }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
};

export default astroConfig;
