import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 3000,
	},
	define: {
		"process.env.GOOGLE_CLIENT_ID": JSON.stringify(
			process.env.GOOGLE_CLIENT_ID
		),
	},
	build: {
		commonjsOptions: { include: [] },
	},
	optimizeDeps: {
		disabled: false,
		// esbuildOptions: {
		//   target: 'es2020',
		// },
	},
	// esbuild: {
	//   // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
	//   logOverride: { 'this-is-undefined-in-esm': 'silent' },
	// },
	plugins: [svgr(), react()],
});
