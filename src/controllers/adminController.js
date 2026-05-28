const bcrypt = require('bcryptjs');
const db = require('../config/db');

const getUsers = (req, res) => {
  const { role } = req.query;

  let query = `
    SELECT id, name, email, role, specialist, is_active, created_at
    FROM users
  `;
  const params = [];

  if (role) {
    query += ` WHERE role = ?`;
    params.push(role);
  }

  query += ` ORDER BY created_at DESC`;

  const users = db.prepare(query).all(...params);
  return res.status(200).json({ users });
};

const createDoctor = (req, res) => {
  const { name, email, password, specialist } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email sudah terdaftar.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(`
    INSERT INTO users (name, email, password, role, specialist, is_active)
    VALUES (?, ?, ?, 'dokter', ?, 1)
  `).run(name, email, hashedPassword, specialist || null);

  return res.status(201).json({
    message: 'Dokter berhasil ditambahkan.',
    doctor: {
      id: result.lastInsertRowid,
      name,
      email,
      role: 'dokter',
      specialist: specialist || null,
      is_active: 1
    }
  });
};

const getDoctors = (req, res) => {
  const doctors = db.prepare(`
    SELECT id, name, email, specialist, is_active, created_at
    FROM users
    WHERE role = 'dokter'
    ORDER BY created_at DESC
  `).all();

  return res.status(200).json({ doctors });
};

const getDoctorById = (req, res) => {
  const { id } = req.params;

  const doctor = db.prepare(`
    SELECT id, name, email, specialist, is_active, created_at
    FROM users
    WHERE id = ? AND role = 'dokter'
  `).get(id);

  if (!doctor) {
    return res.status(404).json({ message: 'Dokter tidak ditemukan.' });
  }

  return res.status(200).json({ doctor });
};

const updateDoctor = (req, res) => {
  const { id } = req.params;
  const { name, email, specialist, is_active } = req.body;

  const doctor = db.prepare(`
    SELECT * FROM users
    WHERE id = ? AND role = 'dokter'
  `).get(id);

  if (!doctor) {
    return res.status(404).json({ message: 'Dokter tidak ditemukan.' });
  }

  if (email && email !== doctor.email) {
    const emailUsed = db.prepare(
      'SELECT id FROM users WHERE email = ? AND id != ?'
    ).get(email, id);

    if (emailUsed) {
      return res.status(409).json({ message: 'Email sudah digunakan oleh user lain.' });
    }
  }

  const nextActive = is_active ?? doctor.is_active;

  db.prepare(`
    UPDATE users
    SET name = ?,
        email = ?,
        specialist = ?,
        is_active = ?
    WHERE id = ? AND role = 'dokter'
  `).run(
    name?.trim() || doctor.name,
    email?.trim() || doctor.email,
    specialist?.trim() || doctor.specialist,
    nextActive,
    id
  );

  if (Number(nextActive) === 0) {
    db.prepare(`
      UPDATE schedules
      SET is_active = 0
      WHERE doctor_id = ?
    `).run(id);
  }

  return res.status(200).json({ message: 'Data dokter berhasil diperbarui.' });
};

const deleteDoctor = (req, res) => {
  const { id } = req.params;

  const doctor = db.prepare(`
    SELECT id FROM users
    WHERE id = ? AND role = 'dokter'
  `).get(id);

  if (!doctor) {
    return res.status(404).json({ message: 'Dokter tidak ditemukan.' });
  }

  db.prepare('DELETE FROM users WHERE id = ? AND role = \'dokter\'').run(id);
  return res.status(200).json({ message: 'Dokter berhasil dihapus.' });
};

const resetDoctorPassword = (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password baru wajib diisi.' });
  }

  const doctor = db.prepare(`
    SELECT id FROM users
    WHERE id = ? AND role = 'dokter'
  `).get(id);

  if (!doctor) {
    return res.status(404).json({ message: 'Dokter tidak ditemukan.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.prepare(`
    UPDATE users
    SET password = ?
    WHERE id = ? AND role = 'dokter'
  `).run(hashedPassword, id);

  return res.status(200).json({ message: 'Password dokter berhasil direset.' });
};

const getSchedules = (req, res) => {
  const schedules = db.prepare(`
    SELECT
      s.id,
      s.doctor_id,
      s.hari,
      s.jam_mulai,
      s.jam_selesai,
      s.kuota,
      s.is_active,
      u.name AS doctor_name,
      u.is_active AS doctor_active
    FROM schedules s
    JOIN users u ON s.doctor_id = u.id
    ORDER BY s.hari, s.jam_mulai
  `).all();

  return res.status(200).json({ schedules });
};

const getAdminSummary = (req, res) => {
  const totalDoctors = db.prepare(`
    SELECT COUNT(*) AS total FROM users WHERE role = 'dokter'
  `).get();

  const activeDoctors = db.prepare(`
    SELECT COUNT(*) AS total FROM users WHERE role = 'dokter' AND is_active = 1
  `).get();

  const inactiveDoctors = db.prepare(`
    SELECT COUNT(*) AS total FROM users WHERE role = 'dokter' AND is_active = 0
  `).get();

  const activeSchedules = db.prepare(`
    SELECT COUNT(*) AS total FROM schedules WHERE is_active = 1
  `).get();

  const today = new Date().toISOString().split('T')[0];
  const bookingsToday = db.prepare(`
    SELECT COUNT(*) AS total FROM bookings WHERE tanggal = ?
  `).get(today);

  return res.status(200).json({
    summary: {
      totalDoctors: totalDoctors.total,
      activeDoctors: activeDoctors.total,
      inactiveDoctors: inactiveDoctors.total,
      activeSchedules: activeSchedules.total,
      bookingsToday: bookingsToday.total
    }
  });
};

module.exports = {
  getUsers,
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  resetDoctorPassword,
  getSchedules,
  getAdminSummary
};  