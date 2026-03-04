/** @type {import('next').NextConfig} */
const nextConfig = {
  // 你可能还有其他配置...
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/active',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
