const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
  createBooking,
  getMyBookings,
  getDoctorBookings,
  getAntrian,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');

router.post('/',            auth, requireRole('pasien'), createBooking);
router.get('/my',           auth, requireRole('pasien'), getMyBookings);
router.get('/doctor',       auth, requireRole('dokter'), getDoctorBookings);
router.get('/antrian',      auth, requireRole('dokter'), getAntrian);
router.put('/:id/status',   auth, requireRole('dokter'), updateBookingStatus);
router.put('/:id/cancel',   auth, requireRole('pasien'), cancelBooking);

module.exports = router;