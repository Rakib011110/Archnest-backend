// /* eslint-disable no-console */
// import { Server } from 'http';
// import mongoose from 'mongoose';
// import app from './app';
// import config from './config';

// let server: Server;

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
//   process.exit(1);
// });

// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled Rejection:', error);
//   if (server) {
//     server.close(() => {
//       console.error('Server closed due to unhandled rejection');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// });

// async function bootstrap() {
//   try {
//     await mongoose.connect(config.db_url as string);
//     console.log('🛢 Database connected successfully');
//     // await seed();
//     server = app.listen(config.port, () => {
//       console.log(`🚀 Application is running on port ${config.port}`);
//     });
//   } catch (err) {
//     console.error('Failed to connect to database:', err);
//     process.exit(1);
//   } 
// }

// bootstrap();

// process.on('SIGTERM', () => {
//   console.log('SIGTERM received');
//   if (server) {
//     server.close(() => {
//       console.log('Server closed due to SIGTERM');
//       process.exit(0);
//     });
//   } else {
//     process.exit(0);
//   }
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received');
//   if (server) {
//     server.close(() => {
//       console.log('Server closed due to SIGINT');
//       process.exit(0);
//     });
//   } else {
//     process.exit(0);
//   }
// });

/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

import app from './app';
import config from './config';
import { connectRedis, cacheService } from './config/redis';

let server: Server;

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  if (server) {
    server.close(() => {
      console.error('Server closed due to unhandled rejection');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// ✅ uploads & subfolders ensure করা (Multer diskStorage এর জন্য)
function ensureUploadDirs() {
  // NOTE: এটা আপনার app.ts এর uploadsPath এর সাথে consistent
  const uploadsPath = path.join(__dirname, '../uploads');

  const requiredDirs = [
    uploadsPath,
    path.join(uploadsPath, 'profiledocs'), 
  ];

  requiredDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  console.log(`📌 Upload base dir: ${uploadsPath}`);
}

async function bootstrap() {
  try {
    ensureUploadDirs();

    // Connect to MongoDB
    await mongoose.connect(config.db_url as string);
    console.log('🛢 Database connected successfully');

    // Connect to Redis (optional - app works without it)
    try {
      await connectRedis();
      await cacheService.init();
      console.log('✅ Cache service initialized');
    } catch (redisError) {
      console.warn('⚠️ Redis not available - continuing without cache');
    }

    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close(() => {
      console.log('Server closed due to SIGTERM');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  if (server) {
    server.close(() => {
      console.log('Server closed due to SIGINT');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
