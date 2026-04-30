import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import routes from "./routes";
import notFound from "./app/middlewares/notFound";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { setupSwagger } from "./swagger.config";

dotenv.config();

const app = express();

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

// ============================================================================
// SECURITY & HEADERS
// ============================================================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ============================================================================
// BODY PARSING
// ============================================================================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ============================================================================
// STATIC FILE SERVING — Uploads
// ============================================================================

const uploadsPath = path.join(__dirname, '../uploads');

app.use('/uploads', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) res.setHeader('Content-Type', 'application/pdf');
    if (filePath.match(/\.(jpg|jpeg)$/i)) res.setHeader('Content-Type', 'image/jpeg');
    if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
    if (filePath.endsWith('.webp')) res.setHeader('Content-Type', 'image/webp');
    if (filePath.endsWith('.gif')) res.setHeader('Content-Type', 'image/gif');
    if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
  },
  fallthrough: true,
  index: false,
}));

// ============================================================================
// API ROUTES
// ============================================================================

app.use("/api", routes);

// Swagger API Documentation
setupSwagger(app);

app.get("/", (_req, res) => {
  res.send("Welcome to ArchNest Studio API!");
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(globalErrorHandler as express.ErrorRequestHandler);
app.use(notFound as express.RequestHandler);

export default app;
