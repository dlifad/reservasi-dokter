const db = require('../config/db');

// GET /schedules — semua jadwal aktif (untuk pasien)
const getAllSchedules = (req, res) => {
  const schedules = db.prepare(`
    SELECT
      s.*,
      u.name AS doctor_name,
      u.specialist
    FROM schedules s
    JOIN users u
      ON s.doctor_id = u.id
    WHERE s.is_active = 1
    ORDER BY s.hari, s.jam_mulai
  `).all();

  return res.status(200).json({ schedules });
};

// GET /schedules/my — jadwal milik dokter yang login
const getMySchedules = (req, res) => {
  const schedules = db.prepare(
    'SELECT * FROM schedules WHERE doctor_id = ? ORDER BY hari, jam_mulai'
  ).all(req.user.id);

  return res.status(200).json({ schedules });
};

// POST /schedules — tambah jadwal baru (dokter)
const createSchedule = (req, res) => {
  const { hari, jam_mulai, jam_selesai, kuota } = req.body;

  if (!hari || !jam_mulai || !jam_selesai) {
    return res.status(400).json({ message: 'Hari, jam mulai, dan jam selesai wajib diisi.' });
  }

  const existingSchedules = db.prepare(
    'SELECT * FROM schedules WHERE doctor_id = ?'
  ).all(req.user.id);

  for (const s of existingSchedules) {
    if (
      s.hari === hari &&
      !(jam_selesai <= s.jam_mulai || jam_mulai >= s.jam_selesai)
    ) {
      return res.status(409).json({ message: 'Jadwal bentrok dengan jadwal lain.' });
    }
  }

  const result = db.prepare(`
    INSERT INTO schedules (doctor_id, hari, jam_mulai, jam_selesai, kuota)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.id, hari, jam_mulai, jam_selesai, kuota || 10);

  return res.status(201).json({
    message: 'Jadwal berhasil ditambahkan.',
    schedule: { id: result.lastInsertRowid, hari, jam_mulai, jam_selesai, kuota: kuota || 10 }
  });
};

// PUT /schedules/:id — edit jadwal (dokter)
const updateSchedule = (req, res) => {
  const { id } = req.params;
  const { hari, jam_mulai, jam_selesai, kuota, is_active } = req.body;

  const schedule = db.prepare('SELECT * FROM schedules WHERE id = ? AND doctor_id = ?').get(id, req.user.id);
  if (!schedule) {
    return res.status(404).json({ message: 'Jadwal tidak ditemukan atau bukan milik Anda.' });
  }

  db.prepare(`
    UPDATE schedules
    SET hari = ?, jam_mulai = ?, jam_selesai = ?, kuota = ?, is_active = ?
    WHERE id = ?
  `).run(
    hari ?? schedule.hari,
    jam_mulai ?? schedule.jam_mulai,
    jam_selesai ?? schedule.jam_selesai,
    kuota ?? schedule.kuota,
    is_active ?? schedule.is_active,
    id
  );

  return res.status(200).json({ message: 'Jadwal berhasil diperbarui.' });
};

// DELETE /schedules/:id — hapus jadwal (dokter)
const deleteSchedule = (req, res) => {
  const { id } = req.params;

  const schedule = db.prepare('SELECT * FROM schedules WHERE id = ? AND doctor_id = ?').get(id, req.user.id);
  if (!schedule) {
    return res.status(404).json({ message: 'Jadwal tidak ditemukan atau bukan milik Anda.' });
  }

  db.prepare('DELETE FROM schedules WHERE id = ?').run(id);
  return res.status(200).json({ message: 'Jadwal berhasil dihapus.' });
};

module.exports = { getAllSchedules, getMySchedules, createSchedule, updateSchedule, deleteSchedule };
