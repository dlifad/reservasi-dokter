# 🏥 Doctor Reservation Frontend

Frontend aplikasi reservasi dokter berbasis **React + Vite**.

---

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Buat file `.env`

Isi environment variable berikut:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Jalankan aplikasi

```bash
npm run dev
```

Aplikasi biasanya berjalan di:

```bash
http://localhost:5173
```

---

## 📁 Struktur Halaman

### Public

- `/` → Landing Page
- `/login` → Login
- `/register` → Register pasien

### Pasien

- `/patient` → Dashboard pasien
- `/patient/bookings` → Riwayat booking
- `/book/:id` → Booking jadwal

### Dokter

- `/doctor` → Dashboard dokter
- `/doctor/schedule` → Kelola jadwal
- `/doctor/pasien` → Daftar pasien / booking masuk

### Admin

- `/admin` → Dashboard admin

---

## 🔐 Role & Akses

| Role     | Akses                                                      |
| -------- | ---------------------------------------------------------- |
| `pasien` | Melihat jadwal dokter, booking, dan riwayat booking        |
| `dokter` | Mengelola jadwal, melihat booking masuk, dan daftar pasien |
| `admin`  | Mengelola dokter, pasien, dan melihat semua jadwal         |

Akses route dilindungi menggunakan `ProtectedRoute` berdasarkan role user yang tersimpan di `AuthContext`.

---
## 🔑 Login Default Admin

Akun admin dibuat otomatis dari backend:

| Field    | Value               |
| -------- | ------------------- |
| Email    | `adminrs@gmail.com` |
| Password | `passAdminRS`       |
| Role     | `admin`             |

---

## 🧱 Komponen Penting

### `AuthContext`

Menyimpan user login dan token ke `localStorage` agar sesi tetap aktif setelah refresh.

### `ProtectedRoute`

Membatasi akses halaman berdasarkan role:

- `pasien` → halaman pasien
- `dokter` → halaman dokter
- `admin` → halaman admin

### `Navbar`

Menampilkan menu berbeda berdasarkan role user yang login.

---

## 📦 Tech Stack

- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS

---

## 📌 Catatan

- Pastikan backend sudah aktif sebelum membuka frontend.
- Jika endpoint backend berubah, sesuaikan `VITE_API_BASE_URL` di file `.env`.
- File `LandingPage`, `Login`, `Register`, `DashboardAdmin`, dan halaman role-based lain harus tersedia sesuai route di `App.jsx`.

---

## 🛠️ Script Umum

```bash
npm run dev
npm run build
npm run preview
```

---

## 📂 Contoh Struktur Folder

```bash
src/
├── api.js
├── App.jsx
├── main.jsx
├── context/
│   └── AuthContext.jsx
├── components/
│   ├── Navbar/
│   └── ProtectedRoute.jsx
└── pages/
    ├── LandingPage.jsx
    ├── Login.jsx
    ├── Register.jsx
    ├── admin/
    │   └── DashboardAdmin.jsx
    ├── dokter/
    │   ├── Dashboard.jsx
    │   ├── Schedule.jsx
    │   └── DaftarPasien.jsx
    └── pasien/
        ├── Dashboard.jsx
        ├── Booking.jsx
        └── MyBookings.jsx
```
