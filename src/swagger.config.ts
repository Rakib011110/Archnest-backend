import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SWAGGER API DOCUMENTATION CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Version: 1.0.0
 * Features: Auth, Users, and Banner modules
 */

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArchNest Studio API',
      version: '1.0.0',
      description: `
## ArchNest Studio REST API Documentation

### 🌍 i18n Support
Translatable fields use a nested object format:
\`\`\`json
{
  "name": { "en": "Project Name", "bn": "প্রজেক্টের নাম" }
}
\`\`\`
      `,
      contact: {
        name: 'ArchNest Support',
        email: 'support@archnest.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token',
        },
      },
      schemas: {
        // ─────────────────────────────────────────────────────────────────────
        // Common Response Schemas
        // ─────────────────────────────────────────────────────────────────────
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'array', items: {} },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 20 },
                total: { type: 'number', example: 150 },
                totalPages: { type: 'number', example: 8 },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
            errorSources: { type: 'array', items: { type: 'object' } },
          },
        },

        // ─────────────────────────────────────────────────────────────────────
        // Auth Schemas
        // ─────────────────────────────────────────────────────────────────────
        LoginPayload: {
          type: 'object',
          required: ['password'],
          description: 'Login with email OR phone',
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            phone: { type: 'string', example: '01712345678' },
            password: { type: 'string', example: 'password123' },
          },
        },
        RegisterPayload: {
          type: 'object',
          required: ['name', 'phone', 'password'],
          properties: {
            name: { type: 'string', example: 'Rahim Uddin' },
            phone: { type: 'string', example: '01712345678' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
            name: { type: 'string', example: 'Rahim Uddin' },
            phone: { type: 'string', example: '01712345678' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
            status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'BLOCKED'], example: 'ACTIVE' },
            profilePhoto: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Banners', description: 'Banner management endpoints' },
    ],
  },
  apis: [
    './src/app/routes/**/*.ts',
    './src/app/modules/**/*.routes.ts',
    './src/swagger-docs/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'ArchNest Studio API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger docs available at: http://localhost:5000/api-docs');
}

export default swaggerSpec;
