import { Router } from 'express';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

// Admin routes
router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.EDITOR),
  CategoryController.createCategory
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.EDITOR),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.EDITOR),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
