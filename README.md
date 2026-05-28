# 🏥 Doctor Reservation API

Backend REST API untuk sistem reservasi dokter berbasis Node.js, Express, dan SQLite.

---

## 🚀 Cara Menjalankan

### 1. Clone & Install
```bash
git clone <repo-url>
cd <nama-folder>
npm install
```

### 2. Buat file `.env`
```env
PORT=5000
JWT_SECRET=your_secret_key_here
DB_PATH=./database.db
```

### 3. Jalankan server
```bash
# Development (dengan nodemon)
npm run dev

# Production
npm start
```

Server berjalan di: `http://localhost:5000`

---

## 🗄️ Struktur Database

### Tabel `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER | Primary key, autoincrement |
| `name` | TEXT | Nama lengkap user |
| `email` | TEXT | Email unik (digunakan untuk login) |
| `password` | TEXT | Password ter-hash (bcrypt) |
| `role` | TEXT | `pasien` / `dokter` / `admin` |
| `specialist` | TEXT | Spesialisasi dokter (opsional) |
| `is_active` | INTEGER | `1` = aktif, `0` = nonaktif |
| `created_at` | DATETIME | Waktu dibuat |

### Tabel `schedules`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER | Primary key, autoincrement |
| `doctor_id` | INTEGER | FK → `users.id` |
| `hari` | TEXT | Hari praktik (Senin, Selasa, dst.) |
| `jam_mulai` | TEXT | Jam mulai (format: `HH:MM`) |
| `jam_selesai` | TEXT | Jam selesai (format: `HH:MM`) |
| `kuota` | INTEGER | Kuota pasien per sesi (default: 10) |
| `is_active` | INTEGER | `1` = aktif, `0` = nonaktif |

### Tabel `bookings`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER | Primary key, autoincrement |
| `pasien_id` | INTEGER | FK → `users.id` |
| `schedule_id` | INTEGER | FK → `schedules.id` |
| `tanggal` | TEXT | Tanggal booking (format: `YYYY-MM-DD`) |
| `status` | TEXT | `pending` / `approved` / `rejected` |
| `nomor_antrian` | INTEGER | Nomor antrian pasien |
| `catatan` | TEXT | Catatan tambahan dari pasien (opsional) |
| `created_at` | DATETIME | Waktu dibuat |

---

## 🔐 Akun Default

Admin default dibuat otomatis saat server pertama kali dijalankan.

| Field | Value |
|---|---|
| Email | `adminrs@gmail.com` |
| Password | `passAdminRS` |
| Role | `admin` |


---

## 🔑 Autentikasi

Semua endpoint yang membutuhkan autentikasi harus menyertakan token JWT di header:

```
Authorization: Bearer <token>
```

Token didapatkan setelah login berhasil.

---

## 📋 Daftar Endpoint

### Auth — `/api/auth`
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Registrasi pasien baru |
| `POST` | `/api/auth/login` | Public | Login semua role |

**Body register:**
```json
{
  "name": "Nama Lengkap",
  "email": "email@example.com",
  "password": "password123"
}
```

**Body login:**
```json
{
  "email": "email@example.com",
  "password": "password123"
}
```

---

### Schedules — `/api/schedules`
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `GET` | `/api/schedules` | Login | Lihat semua jadwal dokter aktif |
| `GET` | `/api/schedules/my` | Dokter | Lihat jadwal milik dokter sendiri |
| `POST` | `/api/schedules` | Dokter | Tambah jadwal baru |
| `PUT` | `/api/schedules/:id` | Dokter | Update jadwal |
| `DELETE` | `/api/schedules/:id` | Dokter | Hapus jadwal |

---

### Bookings — `/api/bookings`
| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `POST` | `/api/bookings` | Pasien | Buat booking baru |
| `GET` | `/api/bookings/my` | Pasien | Lihat booking milik pasien |
| `GET` | `/api/bookings/doctor` | Dokter | Lihat semua booking masuk |
| `GET` | `/api/bookings/antrian` | Dokter | Lihat antrian hari ini |
| `PUT` | `/api/bookings/:id/status` | Dokter | Update status booking (approve/reject) |
| `PUT` | `/api/bookings/:id/cancel` | Pasien | Batalkan booking |

---

### Admin — `/api/admin`
> Semua endpoint di bawah membutuhkan login sebagai **admin**.

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/admin/summary` | Ringkasan statistik sistem |
| `GET` | `/api/admin/users?role=pasien` | Daftar semua pasien |
| `GET` | `/api/admin/users?role=dokter` | Daftar semua dokter |
| `GET` | `/api/admin/schedules` | Lihat semua jadwal + status dokter |
| `GET` | `/api/admin/doctors` | Daftar dokter |
| `GET` | `/api/admin/doctors/:id` | Detail dokter |
| `POST` | `/api/admin/doctors` | Tambah dokter baru |
| `PUT` | `/api/admin/doctors/:id` | Edit data dokter |
| `DELETE` | `/api/admin/doctors/:id` | Hapus dokter |
| `PUT` | `/api/admin/doctors/:id/reset-password` | Reset password dokter |

**Body tambah dokter:**
```json
{
  "name": "Dr. Nama Dokter",
  "email": "dokter@example.com",
  "password": "password123",
  "specialist": "Umum"
}
```

**Body nonaktifkan dokter:**
```json
{
  "is_active": 0
}
```

---

## 📁 Struktur Folder

```
├── config/
│   └── db.js               # Koneksi SQLite (better-sqlite3)
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── bookingController.js
│   └── scheduleController.js
├── middleware/
│   ├── authMiddleware.js    # Verifikasi JWT
│   └── roleMiddleware.js    # Cek role user
├── models/
│   └── initDB.js            # Inisialisasi tabel & seed admin
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── booking.js
│   └── schedule.js
├── .env
├── app.js
└── package.json
```

---

## 🛡️ Role & Akses

| Role | Registrasi | Login | Aksi |
|---|---|---|---|
| `pasien` | Bisa daftar sendiri | ✅ | Booking jadwal, lihat riwayat |
| `dokter` | Dibuat oleh admin | ✅ (jika aktif) | Kelola jadwal, approve/reject booking |
| `admin` | Seed otomatis | ✅ | Kelola dokter, lihat semua data |

---

## 📦 Dependencies

```json
{
  "express": "^4.x",
  "better-sqlite3": "^x.x",
  "bcryptjs": "^x.x",
  "jsonwebtoken": "^x.x",
  "cors": "^x.x",
  "dotenv": "^x.x"
}
```

Install dev dependency:
```bash
npm install --save-dev nodemon
```

Script di `package.json`:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```
