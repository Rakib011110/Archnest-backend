import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

// Public
router.post('/subscribe', NewsletterController.subscribe);
router.post('/unsubscribe', NewsletterController.unsubscribe);

// Admin
router.get('/', auth(USER_ROLE.ADMIN), NewsletterController.getAll);
router.delete('/:id', auth(USER_ROLE.ADMIN), NewsletterController.remove);

export const NewsletterRoutes = router;
