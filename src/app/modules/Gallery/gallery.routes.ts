import { Router } from 'express';
import { GalleryController } from './gallery.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadGalleryItem } from '../../../lib/multer/multer';

const router = Router();

router.get('/', GalleryController.getAllItems);
router.get('/:id', GalleryController.getItemById);
router.post('/', auth(USER_ROLE.ADMIN), uploadGalleryItem.single('file'), GalleryController.createItem);
router.patch('/:id', auth(USER_ROLE.ADMIN), uploadGalleryItem.single('file'), GalleryController.updateItem);
router.delete('/:id', auth(USER_ROLE.ADMIN), GalleryController.deleteItem);

export const GalleryRoutes = router;
