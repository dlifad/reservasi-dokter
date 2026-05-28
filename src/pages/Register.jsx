import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Pendaftaran gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans h-screen w-screen flex overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden md:flex w-[42%] bg-[#0a1628] flex-col justify-between px-14 py-11 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute -top-28 -right-20 w-120 h-120 rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.32)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-90 h-90 rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Brand */}
        <Link
          to="/"
          className="relative z-10 flex w-fit items-center gap-2.5 transition-opacity hover:opacity-85"
          style={{ textDecoration: "none" }}
        >
          <div className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-teal-600 text-lg font-bold text-white">
            +
          </div>

          <span className="font-display text-[15px] font-semibold tracking-[-0.2px] text-white">
            Reservasi Dokter
          </span>
        </Link>

        {/* Body */}
        <div className="relative z-10">
          <p className="font-sans text-[11px] font-semibold tracking-[2px] uppercase text-teal-500 mb-5">
            Sistem Antrian Dokter
          </p>

          <h1 className="font-display text-[36px] font-bold text-white leading-[1.2] tracking-[-0.5px] mb-4">
            Daftar sekali,<br />
            antri kapan saja.
          </h1>

          <p className="font-sans text-[14px] text-white/40 leading-[1.8] max-w-70">
            Buat akun pasien dan mulai ambil antrian dokter tanpa harus datang lebih awal ke klinik.
          </p>

          {/* Steps */}
          <div className="mt-10 flex flex-col gap-4">
            {[
              { num: "01", text: "Buat akun dengan data diri kamu" },
              { num: "02", text: "Pilih dokter dan jadwal yang tersedia" },
              { num: "03", text: "Ambil nomor antrian dan datang tepat waktu" },
            ].map(({ num, text }) => (
              <div key={num} className="flex items-center gap-4">
                <span className="font-display text-[11px] font-bold text-teal-500 w-6 shrink-0">
                  {num}
                </span>
                <div className="h-px w-5 bg-teal-500/30 shrink-0" />
                <p className="font-sans text-[13px] text-white/60 m-0">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <span className="relative z-10 font-sans text-[12px] text-white/20">
          © 2025 Reservasi Dokter
        </span>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-105">
          <h2 className="font-display text-[26px] font-bold text-slate-900 tracking-[-0.4px] mb-1.5">
            Buat akun baru
          </h2>
          <p className="font-sans text-[14px] text-slate-400 mb-6">
            Isi data di bawah untuk mendaftar sebagai pasien.
          </p>

          {error && (
            <div className="font-sans bg-red-50 border border-red-200 text-red-600 text-[13px] px-3.5 py-2.5 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            {/* Nama */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[13px] font-semibold text-slate-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nama lengkap Anda"
                value={form.name}
                onChange={change}
                className="font-sans w-full h-11.5 border-[1.5px] border-slate-200 rounded-[10px] px-3.5 text-[14px] text-slate-900 bg-white outline-none placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[13px] font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="contoh@email.com"
                value={form.email}
                onChange={change}
                className="font-sans w-full h-11.5 border-[1.5px] border-slate-200 rounded-[10px] px-3.5 text-[14px] text-slate-900 bg-white outline-none placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[13px] font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Minimal 8 karakter"
                value={form.password}
                onChange={change}
                className="font-sans w-full h-11.5 border-[1.5px] border-slate-200 rounded-[10px] px-3.5 text-[14px] text-slate-900 bg-white outline-none placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-sans w-full h-12 bg-teal-600 text-white rounded-[10px] text-[15px] font-semibold tracking-[0.1px] mt-1 cursor-pointer transition hover:bg-teal-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Mendaftarkan..." : "Buat Akun"}
            </button>
          </form>

          <p className="font-sans text-[12px] text-slate-400 text-center mt-3">
            Dengan mendaftar, Anda menyetujui syarat &amp; ketentuan kami.
          </p>

          <p className="font-sans text-center mt-4 text-[13.5px] text-slate-400">
            Sudah punya akun?
            <Link
              to="/login"
              className="ml-1 font-semibold text-teal-600 transition-opacity hover:opacity-80"
              style={{ textDecoration: "none" }}
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}