/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // ⚠️ Désactivé car on utilise des API routes
  images: {
    unoptimized: true,
  },
  
  // Configuration pour les fichiers de mise à jour
  async headers() {
    return [
      {
        // Headers pour les fichiers .exe
        source: '/updates/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
          {
            key: 'Content-Disposition',
            value: 'attachment',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        // Headers pour version.json
        source: '/updates/version.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

