/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 개발 중 일시적으로 비활성화 (디버깅용)
  webpack: (config, { isServer }) => {
    // Supabase Edge Functions 폴더를 빌드에서 제외
    config.module.rules.push({
      test: /\.ts$/,
      include: /supabase\/functions/,
      use: 'ignore-loader',
    });
    return config;
  },
};

export default nextConfig;
