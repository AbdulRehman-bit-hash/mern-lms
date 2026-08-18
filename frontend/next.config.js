/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  webpack: (config) => {
    // socket.io-client pulls in the "ws" package, which optionally uses two
    // native performance add-ons ("utf-8-validate" and "bufferutil") if
    // they're installed — falling back to a pure-JS implementation if not,
    // which is exactly what happens in a browser bundle anyway (the actual
    // WebSocket connection uses the browser's native WebSocket API, not
    // "ws", regardless). Webpack still tries to statically resolve those
    // two optional requires during the build and fails since they're not
    // installed. Marking them as externals tells webpack to leave those
    // require() calls alone instead of trying to bundle them — safe here
    // since that code path never actually runs in the browser.
    config.externals = [...(config.externals || []), "utf-8-validate", "bufferutil"];
    return config;
  },
};

module.exports = nextConfig;
