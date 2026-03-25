import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './env';

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "ReputeChain API",
    version: "1.0.0",
    description: "API documentation for the ReputeChain platform."
  },
  servers: [
    {
      url: `http://localhost:${env.port}/api`,
      description: "Local Dev Server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User registered successfully" }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login user",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "User logged in successfully" }
        }
      }
    },
    "/reputation/calculate": {
      get: {
        summary: "Calculate reputation score",
        responses: {
          "200": { description: "Score calculated" }
        }
      }
    }
  }
};

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
