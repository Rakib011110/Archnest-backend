import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// ============================================================================
// ARCHNEST STUDIO — MULTER UPLOAD CONFIGURATION
// ============================================================================

// Upload directories mapped to ArchNest modules
const UPLOAD_DIRS = {
  profiles: 'uploads/profiles',
  banners: 'uploads/banners',
  services: 'uploads/services',
  projects: 'uploads/projects',
  gallery: 'uploads/gallery',
  blog: 'uploads/blog',
  team: 'uploads/team',
  testimonials: 'uploads/testimonials',
  inquiries: 'uploads/inquiries',
  site: 'uploads/site',
} as const;

// Ensure all upload directories exist on startup
Object.values(UPLOAD_DIRS).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY: DRY storage creator
// ─────────────────────────────────────────────────────────────────────────────

const createStorage = (dir: string, prefix: string) =>
  multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

// ─────────────────────────────────────────────────────────────────────────────
// FILE FILTERS
// ─────────────────────────────────────────────────────────────────────────────

/** Accept images only (jpg, png, webp, gif, svg) */
const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

/** Accept images + PDF documents */
const documentFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed!'));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Profile photos — single image, 2MB */
export const uploadProfilePhoto = multer({
  storage: createStorage(UPLOAD_DIRS.profiles, 'profile'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

/** Banner images — single image, 5MB */
export const uploadBannerImage = multer({
  storage: createStorage(UPLOAD_DIRS.banners, 'banner'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Service images — single image, 5MB */
export const uploadServiceImage = multer({
  storage: createStorage(UPLOAD_DIRS.services, 'service'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Project images — multiple images (up to 20), 5MB each */
export const uploadProjectImages = multer({
  storage: createStorage(UPLOAD_DIRS.projects, 'project'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 20 },
});

/** Gallery items — single, 10MB (high-res architectural photos) */
export const uploadGalleryItem = multer({
  storage: createStorage(UPLOAD_DIRS.gallery, 'gallery'),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/** Blog images — single image, 5MB */
export const uploadBlogImage = multer({
  storage: createStorage(UPLOAD_DIRS.blog, 'blog'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Content inline images (used inside Markdown) — single, 5MB */
export const uploadContentImage = multer({
  storage: createStorage(UPLOAD_DIRS.blog, 'content'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Team member photos — single, 2MB */
export const uploadTeamPhoto = multer({
  storage: createStorage(UPLOAD_DIRS.team, 'team'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

/** Testimonial client photos — single, 2MB */
export const uploadTestimonialPhoto = multer({
  storage: createStorage(UPLOAD_DIRS.testimonials, 'testimonial'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

/** Inquiry attachments — images + PDF, up to 5 files, 10MB each */
export const uploadInquiryAttachments = multer({
  storage: createStorage(UPLOAD_DIRS.inquiries, 'inquiry'),
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

/** Site assets (logo, favicon) — single, 5MB */
export const uploadSiteAsset = multer({
  storage: createStorage(UPLOAD_DIRS.site, 'site'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
