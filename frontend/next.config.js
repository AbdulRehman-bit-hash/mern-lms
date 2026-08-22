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
  async rewrites() {
    // Proxies every REST API call through this Next.js app's own domain
    // instead of hitting the backend's onrender.com domain directly.
    //
    // Why: the frontend and backend live on two different domains. iOS
    // Safari (and every other iOS browser, since Apple requires them all to
    // use Safari's engine) applies Intelligent Tracking Prevention, which
    // aggressively restricts cookies set across two different domains —
    // even ones correctly configured with sameSite: "none"; secure: true.
    // That silently breaks the login cookie on iPhones specifically, which
    // is why data loaded fine on desktop but came back empty on mobile.
    //
    // With this rewrite, the browser only ever talks to this Vercel domain
    // directly — Vercel forwards the request to the real backend behind
    // the scenes and relays the response back, including the Set-Cookie
    // header. Since the browser never directly contacts onrender.com, it
    // sees the cookie as same-site and stops blocking it.
    //
    // BACKEND_URL is a server-only env var (deliberately not prefixed with
    // NEXT_PUBLIC_, since it's only needed here, at build/edge time, never
    // in browser JS).
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
