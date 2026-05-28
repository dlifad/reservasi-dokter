import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  const getRedirectPath = (role) => {
    if (role === "admin") return "/admin";
    if (role === "dokter") return "/doctor";
    return "/patient";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      nav(getRedirectPath(data.user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal. Periksa email dan password Anda.");
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
            Antri ketemu dokter,<br />
            dari mana saja.
          </h1>

          <p className="font-sans text-[14px] text-white/40 leading-[1.8] max-w-70">
            Ambil nomor antrian, pilih dokter, dan pantau status kunjunganmu, tanpa harus datang lebih awal.
          </p>

          {/* Steps */}
          <div className="mt-10 flex flex-col gap-4">
            {[
              { num: "01", text: "Pilih dokter dan jadwal yang tersedia" },
              { num: "02", text: "Dapatkan nomor antrian secara instan" },
              { num: "03", text: "Pantau status dan datang tepat waktu" },
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
        <div className="w-full max-w-100">
          <h2 className="font-display text-[26px] font-bold text-slate-900 tracking-[-0.4px] mb-1.5">
            Selamat datang kembali
          </h2>
          <p className="font-sans text-[14px] text-slate-400 mb-7">
            Masukkan email dan password Anda untuk melanjutkan.
          </p>

          {error && (
            <div className="font-sans bg-red-50 border border-red-200 text-red-600 text-[13px] px-3.5 py-2.5 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[13px] font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-sans w-full h-11.5 border-[1.5px] border-slate-200 rounded-[10px] px-3.5 text-[14px] text-slate-900 bg-white outline-none placeholder:text-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
              />
            </div>
            <a
              href="#"
              className="font-sans text-[13px] font-medium text-teal-600 text-right -mt-1 transition-opacity hover:opacity-80"
              style={{ textDecoration: "none" }}
            >
              Lupa password?
            </a>

            <button
              type="submit"
              disabled={loading}
              className="font-sans w-full h-12 bg-teal-600 text-white rounded-[10px] text-[15px] font-semibold tracking-[0.1px] cursor-pointer transition hover:bg-teal-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="font-sans text-center mt-5 text-[13.5px] text-slate-400">
            Belum punya akun?
            <Link
              to="/register"
              className="ml-1 font-semibold text-teal-600 transition-opacity hover:opacity-80"
              style={{ textDecoration: "none" }}
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}