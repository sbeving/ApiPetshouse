import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Odoo API Proxy',
        version: '1.0.0',
        description: 'REST API proxy for Odoo Online with Bearer and X-API-Key authentication',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://your-domain.vercel.app',
          description: 'Production server',
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
