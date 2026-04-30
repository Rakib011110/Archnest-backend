import { Router } from 'express';
import { SiteSettingsController } from './siteSettings.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadSiteAsset } from '../../../lib/multer/multer';

const router = Router();

// Public — frontend reads settings
router.get('/', SiteSettingsController.getSettings);

// Admin — update settings
router.patch('/', auth(USER_ROLE.ADMIN), uploadSiteAsset.single('logo'), SiteSettingsController.updateSettings);

export const SiteSettingsRoutes = router;
