/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许局域网 IP 访问开发资源（解决 WebSocket HMR 和字体 403 问题）
  allowedDevOrigins: ['192.168.3.94', 'localhost'],
}

module.exports = nextConfig
