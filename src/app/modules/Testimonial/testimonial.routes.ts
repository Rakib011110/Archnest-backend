import { Router } from 'express';
import { TestimonialController } from './testimonial.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadTestimonialPhoto } from '../../../lib/multer/multer';

const router = Router();

router.get('/', TestimonialController.getAll);
router.get('/:id', TestimonialController.getById);
router.post('/', auth(USER_ROLE.ADMIN), uploadTestimonialPhoto.single('clientPhoto'), TestimonialController.create);
router.patch('/:id', auth(USER_ROLE.ADMIN), uploadTestimonialPhoto.single('clientPhoto'), TestimonialController.update);
router.delete('/:id', auth(USER_ROLE.ADMIN), TestimonialController.remove);

export const TestimonialRoutes = router;
