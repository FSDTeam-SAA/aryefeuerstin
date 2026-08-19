import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('Next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
