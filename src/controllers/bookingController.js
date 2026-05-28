const db = require("../config/db");

// POST /bookings — buat booking baru (pasien)
const hariMap = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

// cari tanggal terdekat sesuai hari jadwal
const getNextDateByDay = (hari) => {
  const today = new Date();

  const targetDay = hariMap[hari];
  const currentDay = today.getDay();

  let diff = targetDay - currentDay;

  // jika hari sudah lewat / hari ini
  // ambil minggu depan
  if (diff <= 0) {
    diff += 7;
  }

  const nextDate = new Date();

  nextDate.setDate(today.getDate() + diff);

  return nextDate.toISOString().split("T")[0];
};

// POST /bookings — buat booking baru (pasien)
const createBooking = (req, res) => {
  const { schedule_id, catatan } = req.body;

  const pasien_id = req.user.id;

  if (!schedule_id) {
    return res.status(400).json({
      message: "schedule_id wajib diisi.",
    });
  }

  // [1] cek jadwal
  const schedule = db.prepare(`
    SELECT * FROM schedules
    WHERE id = ? AND is_active = 1
  `).get(schedule_id);

  if (!schedule) {
    return res.status(404).json({
      message: "Jadwal tidak ditemukan atau tidak aktif.",
    });
  }

  // [2] generate tanggal otomatis
  const tanggal = getNextDateByDay(schedule.hari);

  // [3] cek kuota
  if (schedule.kuota <= 0) {
    return res.status(409).json({
      message: "Kuota jadwal sudah penuh.",
    });
  }

  // [4] cek duplicate booking
  const duplicate = db.prepare(`
    SELECT id FROM bookings
    WHERE pasien_id = ?
    AND schedule_id = ?
    AND tanggal = ?
    AND status != 'rejected'
  `).get(
    pasien_id,
    schedule_id,
    tanggal
  );

  if (duplicate) {
    return res.status(409).json({
      message: "Anda sudah memiliki booking untuk jadwal ini.",
    });
  }

  // [5] insert booking
  const result = db.prepare(`
    INSERT INTO bookings
    (pasien_id, schedule_id, tanggal, catatan)
    VALUES (?, ?, ?, ?)
  `).run(
    pasien_id,
    schedule_id,
    tanggal,
    catatan || null
  );

  // [6] kurangi slot
  db.prepare(`
    UPDATE schedules
    SET kuota = kuota - 1
    WHERE id = ?
  `).run(schedule_id);

  return res.status(201).json({
    message: "Booking berhasil dibuat.",
    booking: {
      id: result.lastInsertRowid,
      status: "pending",
      tanggal,
    },
  });
};

// GET /bookings/my
const getMyBookings = (req, res) => {
  const bookings = db
    .prepare(
      `
    SELECT b.*, s.hari, s.jam_mulai, s.jam_selesai,
           u.name AS doctor_name
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.id
    JOIN users u ON s.doctor_id = u.id
    WHERE b.pasien_id = ?
    ORDER BY b.created_at DESC
  `,
    )
    .all(req.user.id);

  return res.status(200).json({ bookings });
};

// GET /bookings/doctor
const getDoctorBookings = (req, res) => {
  const bookings = db
    .prepare(
      `
    SELECT b.*, u.name AS pasien_name,
           u.email AS pasien_email,
           s.hari, s.jam_mulai, s.jam_selesai
    FROM bookings b
    JOIN users u ON b.pasien_id = u.id
    JOIN schedules s ON b.schedule_id = s.id
    WHERE s.doctor_id = ?
    ORDER BY b.tanggal ASC, b.created_at ASC
  `,
    )
    .all(req.user.id);

  return res.status(200).json({ bookings });
};

// GET /bookings/antrian
const getAntrian = (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const bookings = db
    .prepare(
      `
    SELECT b.*, u.name AS pasien_name,
           s.hari, s.jam_mulai, s.jam_selesai
    FROM bookings b
    JOIN users u ON b.pasien_id = u.id
    JOIN schedules s ON b.schedule_id = s.id
    WHERE s.doctor_id = ?
    AND b.tanggal = ?
    AND b.status = 'approved'
    ORDER BY b.nomor_antrian ASC
  `,
    )
    .all(req.user.id, today);

  const antrian = bookings.map((b, i) => ({
    ...b,
    urutan: i + 1,
  }));

  return res.status(200).json({
    tanggal: today,
    antrian,
  });
};

// PUT /bookings/:id/status
const updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Status harus approved atau rejected.",
    });
  }

  // cek booking
  const booking = db
    .prepare(
      `
    SELECT b.*, s.doctor_id
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.id
    WHERE b.id = ?
  `,
    )
    .get(id);

  if (!booking) {
    return res.status(404).json({
      message: "Booking tidak ditemukan.",
    });
  }

  // cek owner dokter
  if (booking.doctor_id !== req.user.id) {
    return res.status(403).json({
      message: "Anda tidak berhak mengubah booking ini.",
    });
  }

  // hanya pending yg bisa diproses
  if (booking.status !== "pending") {
    return res.status(400).json({
      message: "Booking sudah diproses.",
    });
  }

  let nomor_antrian = null;

  // jika approve → buat nomor antrian
  if (status === "approved") {
    const approvedCount = db
      .prepare(
        `
      SELECT COUNT(*) AS total
      FROM bookings
      WHERE schedule_id = ?
      AND tanggal = ?
      AND status = 'approved'
    `,
      )
      .get(booking.schedule_id, booking.tanggal);

    nomor_antrian = approvedCount.total + 1;
  }

  // update booking
  db.prepare(
    `
    UPDATE bookings
    SET status = ?, nomor_antrian = ?
    WHERE id = ?
  `,
  ).run(status, nomor_antrian, id);

  // jika reject → kembalikan slot
  if (status === "rejected") {
    db.prepare(
      `
      UPDATE schedules
      SET kuota = kuota + 1
      WHERE id = ?
    `,
    ).run(booking.schedule_id);
  }

  return res.status(200).json({
    message: `Booking berhasil ${
      status === "approved" ? "disetujui" : "ditolak"
    }.`,
    booking: {
      id: Number(id),
      status,
      nomor_antrian,
    },
  });
};

// PUT /bookings/:id/cancel
const cancelBooking = (req, res) => {
  const { id } = req.params;
  const pasien_id = req.user.id;

  const booking = db.prepare(`
    SELECT * FROM bookings WHERE id = ?
  `).get(id);

  if (!booking) {
    return res.status(404).json({ message: "Booking tidak ditemukan." });
  }

  if (booking.pasien_id !== pasien_id) {
    return res.status(403).json({ message: "Anda tidak berhak membatalkan booking ini." });
  }

  if (booking.status !== "pending") {
    return res.status(400).json({ message: "Hanya booking dengan status menunggu yang bisa dibatalkan." });
  }

  db.prepare(`
    UPDATE bookings SET status = 'rejected' WHERE id = ?
  `).run(id);

  // kembalikan slot kuota
  db.prepare(`
    UPDATE schedules SET kuota = kuota + 1 WHERE id = ?
  `).run(booking.schedule_id);

  return res.status(200).json({ message: "Booking berhasil dibatalkan." });
};

module.exports = {
  createBooking,
  getMyBookings,
  getDoctorBookings,
  getAntrian,
  updateBookingStatus,
  cancelBooking,
};
