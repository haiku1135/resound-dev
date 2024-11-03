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
}

export default nextConfig