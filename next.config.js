/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_AZURE_SPEECH_KEY: process.env.REACT_APP_AZURE_SPEECH_KEY,
    REACT_APP_AZURE_SPEECH_REGION: process.env.REACT_APP_AZURE_SPEECH_REGION,
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/chat_page': { page: '/chat_page' }, // Add this line
      // Add other routes here, e.g.,
      // '/about': { page: '/about' },
    };
  },
  trailingSlash: true, // Optional: adds a trailing slash to the URLs
};

export default nextConfig;
