import { Router } from 'express';
import { BlogController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadBlogImage } from '../../../lib/multer/multer';

const router = Router();

router.get('/', BlogController.getAllBlogs);
router.get('/slug/:slug', BlogController.getBlogBySlug);
router.get('/:id', BlogController.getBlogById);
router.post('/', auth(USER_ROLE.ADMIN), uploadBlogImage.single('featuredImage'), BlogController.createBlog);
router.patch('/:id', auth(USER_ROLE.ADMIN), uploadBlogImage.single('featuredImage'), BlogController.updateBlog);
router.delete('/:id', auth(USER_ROLE.ADMIN), BlogController.deleteBlog);

export const BlogRoutes = router;
