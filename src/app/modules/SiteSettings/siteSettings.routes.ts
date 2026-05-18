import { Router } from 'express';
import { SiteSettingsController } from './siteSettings.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadSiteAsset } from '../../../lib/multer/multer';

const router = Router();

// Upload fields: logo, logoDark, profileIcon_0..N, partnerLogo_0..N
const siteUploadFields = uploadSiteAsset.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'logoDark', maxCount: 1 },
  ...Array.from({ length: 20 }, (_, i) => ({ name: `profileIcon_${i}`, maxCount: 1 })),
  ...Array.from({ length: 20 }, (_, i) => ({ name: `partnerLogo_${i}`, maxCount: 1 })),
]);

// Public — frontend reads settings
router.get('/', SiteSettingsController.getSettings);

// Admin — update settings with multi-file support
router.patch('/', auth(USER_ROLE.ADMIN), siteUploadFields, SiteSettingsController.updateSettings);

export const SiteSettingsRoutes = router;
