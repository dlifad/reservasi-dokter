const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
  getAllSchedules,
  getMySchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');

router.get('/',      auth, getAllSchedules); 
router.get('/my',    auth, requireRole('dokter'), getMySchedules);
router.post('/',     auth, requireRole('dokter'), createSchedule);
router.put('/:id',   auth, requireRole('dokter'), updateSchedule);
router.delete('/:id',auth, requireRole('dokter'), deleteSchedule);

module.exports = router;
