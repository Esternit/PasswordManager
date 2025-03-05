/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Экспорт статических файлов
  // assetPrefix: "/", // Указывает, что ресурсы загружаются локально (убрал тк мешало npm run dev)
};

export default nextConfig;
