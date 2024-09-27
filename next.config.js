const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
          port: "",
          pathname: "**",
        },
      ],
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      // Note: This is only an example. If you use Pages Router,
      // use something else that works, such as "service-worker/index.ts".
      swSrc: "src/app/sw.js",
      swDest: "public/sw.js",
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};
