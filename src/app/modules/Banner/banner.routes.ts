import express from 'express';
import * as Controller from './banner.controller';
import { uploadBannerImage } from '../../../lib/multer/multer';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.get('/', Controller.getAllBanners);
router.get('/:id', Controller.getBanner);

// ── Admin Routes ──────────────────────────────────────────────────────────────
router.post('/upload-image',
  auth(USER_ROLE.ADMIN),
  uploadBannerImage.single('image'),
  Controller.uploadImage
);
router.post('/', auth(USER_ROLE.ADMIN), Controller.createBanner);
router.patch('/:id', auth(USER_ROLE.ADMIN), Controller.updateBanner);
router.delete('/:id', auth(USER_ROLE.ADMIN), Controller.deleteBanner);

export const BannerRoutes = router;