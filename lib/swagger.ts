import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Agent Petshouse API',
        version: '1.0.0',
        description: `
REST API proxy for Pets House Odoo store. 
This API provides access to products, orders, and inventory management.

**Authentication**: Use either Bearer token or X-API-Key header.

**Rate Limiting**: 100 requests per minute per IP.

**Base URLs**:
- Development: http://localhost:3000
- Production: Update after Vercel deployment
        `.trim(),
        contact: {
          name: 'API Support',
          email: 'saleh.touil.3@gmail.com',
        },
      },
      servers: [
        {
          url: process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          description: process.env.VERCEL_URL ? 'Production server' : 'Development server',
        },
        {
          url: 'http://localhost:3000',
          description: 'Local development',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your bearer token',
          },
          apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
            description: 'Enter your API key',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
        {
          apiKeyAuth: [],
        },
      ],
    },
  });
  return spec;
};
