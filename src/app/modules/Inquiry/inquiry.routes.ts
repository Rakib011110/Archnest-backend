import { Router } from 'express';
import { InquiryController } from './inquiry.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadInquiryAttachments } from '../../../lib/multer/multer';

const router = Router();

// Public — anyone can submit an inquiry
router.post('/', uploadInquiryAttachments.array('attachments', 5), InquiryController.create);

// Admin — manage inquiries
router.get('/', auth(USER_ROLE.ADMIN), InquiryController.getAll);
router.get('/:id', auth(USER_ROLE.ADMIN), InquiryController.getById);
router.patch('/:id', auth(USER_ROLE.ADMIN), InquiryController.update);
router.delete('/:id', auth(USER_ROLE.ADMIN), InquiryController.remove);

export const InquiryRoutes = router;
