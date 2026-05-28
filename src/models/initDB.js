const bcrypt = require('bcryptjs');
const db = require('../config/db');

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('pasien','dokter','admin')) NOT NULL,
      specialist TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER NOT NULL,
      hari TEXT NOT NULL,
      jam_mulai TEXT NOT NULL,
      jam_selesai TEXT NOT NULL,
      kuota INTEGER DEFAULT 10,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (doctor_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pasien_id INTEGER NOT NULL,
      schedule_id INTEGER NOT NULL,
      tanggal TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      nomor_antrian INTEGER,
      catatan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pasien_id) REFERENCES users(id),
      FOREIGN KEY (schedule_id) REFERENCES schedules(id)
    );
  `);

  const adminExists = db.prepare(
    "SELECT id FROM users WHERE email = ? AND role = 'admin'"
  ).get('adminrs@gmail.com');

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('passAdminRS', 10);

    db.prepare(`
      INSERT INTO users (name, email, password, role, is_active)
      VALUES (?, ?, ?, 'admin', 1)
    `).run(
      'Admin RS',
      'adminrs@gmail.com',
      hashedPassword
    );
  }

  console.log('✅ Database & tabel siap.');
};

module.exports = initDB;