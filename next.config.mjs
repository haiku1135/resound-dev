/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gnspaurfwwhgmuorfldx.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig