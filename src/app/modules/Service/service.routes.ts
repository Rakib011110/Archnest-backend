import { Router } from 'express';
import { ServiceController } from './service.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadServiceImage } from '../../../lib/multer/multer';

// ============================================================================
// SERVICE ROUTES
// ============================================================================

const router = Router();

// Public routes
router.get('/', ServiceController.getAllServices);
router.get('/slug/:slug', ServiceController.getServiceBySlug);
router.get('/:id', ServiceController.getServiceById);

// Admin routes
router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  uploadServiceImage.single('heroImage'),
  ServiceController.createService
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  uploadServiceImage.single('heroImage'),
  ServiceController.updateService
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  ServiceController.deleteService
);

export const ServiceRoutes = router;
