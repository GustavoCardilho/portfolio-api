export const corsConfig = {
  development: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite dev server
      'http://localhost:4173', // Vite preview
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
  },
  production: {
    origin: ['https://gustavocardilho.com.br', 'https://www.gustavocardilho.com.br'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
  },
};

export const getCorsConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? corsConfig.development : corsConfig.production;
};
