import { Router } from 'express';
import { TeamMemberController } from './teamMember.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadTeamPhoto } from '../../../lib/multer/multer';

const router = Router();

router.get('/', TeamMemberController.getAll);
router.get('/:id', TeamMemberController.getById);
router.post('/', auth(USER_ROLE.ADMIN), uploadTeamPhoto.single('photo'), TeamMemberController.create);
router.patch('/:id', auth(USER_ROLE.ADMIN), uploadTeamPhoto.single('photo'), TeamMemberController.update);
router.delete('/:id', auth(USER_ROLE.ADMIN), TeamMemberController.remove);

export const TeamMemberRoutes = router;
