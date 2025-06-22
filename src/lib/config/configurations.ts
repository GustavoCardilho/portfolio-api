export const configurations = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
  },
  authentication: {
    hash: process.env.ROUTE_AUTHENTICATION_HASH,
  },
  email: {
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM,
  },
});
