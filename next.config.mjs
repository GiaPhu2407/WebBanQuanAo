/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.aceternity.com"], // Thêm domain utfs.io vào danh sách cho phép
  },
  images: {
    domains: ["utfs.io"], // Add any other domains you need here
  },
};

export default nextConfig;
