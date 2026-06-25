import express from 'express';
import * as Controller from './banner.controller';
import { uploadBannerImage, uploadBannerVideo } from '../../../lib/multer/multer';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { BannerValidation } from './banner.validation';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.get('/', Controller.getAllBanners);

// ── Admin Routes ──────────────────────────────────────────────────────────────
// NOTE: keep specific paths above the `/:id` param route
router.get('/admin/all', auth(USER_ROLE.ADMIN), Controller.getAllBannersAdmin);

router.post('/upload-image',
  auth(USER_ROLE.ADMIN),
  uploadBannerImage.single('image'),
  Controller.uploadImage
);
router.post('/upload-video',
  auth(USER_ROLE.ADMIN),
  uploadBannerVideo.single('video'),
  Controller.uploadVideo
);

router.post('/',
  auth(USER_ROLE.ADMIN),
  validateRequest(BannerValidation.createBannerValidationSchema),
  Controller.createBanner
);
router.patch('/:id',
  auth(USER_ROLE.ADMIN),
  validateRequest(BannerValidation.updateBannerValidationSchema),
  Controller.updateBanner
);
router.delete('/:id', auth(USER_ROLE.ADMIN), Controller.deleteBanner);

// Public single-banner lookup (kept last so it doesn't shadow `/admin/all`)
router.get('/:id', Controller.getBanner);

export const BannerRoutes = router;
