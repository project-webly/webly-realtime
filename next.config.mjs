/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async => [
        {
            source: '/webly-api/:path*',
            destination: 'http://localhost:8080/:path*'
        }
    ]
};

export default nextConfig;
