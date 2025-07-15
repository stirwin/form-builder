/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions: true
    },
    serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;
