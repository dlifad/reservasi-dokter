const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const {
  getUsers,
  getSchedules,
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  resetDoctorPassword,
  getAdminSummary
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(requireRole('admin'));

// SUMMARY
router.get('/summary', getAdminSummary);

// USERS
router.get('/users', getUsers);

// SCHEDULES
router.get('/schedules', getSchedules);

// DOCTORS
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.put('/doctors/:id/reset-password', resetDoctorPassword);

module.exports = router;