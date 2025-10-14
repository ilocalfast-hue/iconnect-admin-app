/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://3001-firebase-iconnect-1760349907569.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
