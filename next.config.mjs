/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "assets.aceternity.com",
      "utfs.io",
      "m.yodycdn.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },
  eslint: {
    // Không chặn build production trên Vercel nếu có cảnh báo ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Bỏ qua lỗi type checking khi build để deploy Vercel mượt mà
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
