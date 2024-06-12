/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
      },
//       'swr/*': {
//     singleton: true,
//     requiredVersion: deps.swr,
//     eager: true,
// },
}

module.exports = nextConfig
