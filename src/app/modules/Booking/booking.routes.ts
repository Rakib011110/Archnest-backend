import { Router } from 'express';
import { BookingController } from './booking.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

// Public — anyone can book & view available slots
router.post('/', BookingController.createBooking);
router.get('/slots', BookingController.getAllSlots);

// Admin — manage bookings & slots
router.get('/', auth(USER_ROLE.ADMIN), BookingController.getAllBookings);
router.get('/:id', auth(USER_ROLE.ADMIN), BookingController.getBookingById);
router.patch('/:id', auth(USER_ROLE.ADMIN), BookingController.updateBooking);
router.delete('/:id', auth(USER_ROLE.ADMIN), BookingController.deleteBooking);

// Admin — slot management
router.post('/slots', auth(USER_ROLE.ADMIN), BookingController.createSlot);
router.patch('/slots/:id', auth(USER_ROLE.ADMIN), BookingController.updateSlot);
router.delete('/slots/:id', auth(USER_ROLE.ADMIN), BookingController.deleteSlot);

export const BookingRoutes = router;
