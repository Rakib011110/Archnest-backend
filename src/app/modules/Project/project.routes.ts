import { Router } from 'express';
import { ProjectController } from './project.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadProjectImages } from '../../../lib/multer/multer';

// ============================================================================
// PROJECT ROUTES
// ============================================================================

const router = Router();

// Public
router.get('/', ProjectController.getAllProjects);
router.get('/slug/:slug', ProjectController.getProjectBySlug);
router.get('/:id', ProjectController.getProjectById);

// Admin
router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.EDITOR),
  uploadProjectImages.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 20 }
  ]),
  ProjectController.createProject
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.EDITOR),
  uploadProjectImages.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 20 }
  ]),
  ProjectController.updateProject
);

router.delete('/:id', auth(USER_ROLE.ADMIN), ProjectController.deleteProject);

export const ProjectRoutes = router;
