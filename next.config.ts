const path = require("path");

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Deshabilitar módulos de Node.js en el cliente
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  // Asegurar que el archivo 'municipio.db' se incluye en el build
  experimental: {
    outputFileTracingIncludes: {
      "/**/*": ["data/municipio.db"], // Ruta de tu base de datos
    },
  },
  output: "standalone", // Requerido para Vercel si usas rutas dinámicas
};
