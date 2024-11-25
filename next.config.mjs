/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gnspaurfwwhgmuorfldx.supabase.co",
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',  // Spotifyの画像用
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig