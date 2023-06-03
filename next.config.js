const isDev = process.env.NODE_ENV !== 'production';

const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        //removeConsole: isDev ? false : true,
    },
};

module.exports = withPWA({
    ...nextConfig,
});
