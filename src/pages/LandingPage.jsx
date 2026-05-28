import { useState } from "react";
import { Link } from "react-router-dom";

/* ─── Icons ─── */
const Icons = {
  arrow: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  ticket: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a2 2 0 010-4h20a2 2 0 010 4M2 15a2 2 0 000 4h20a2 2 0 000-4M4 9v6M20 9v6" />
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

/* ─── FAQ Item ─── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${open ? "border-teal-500/30" : "border-slate-200"}`}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="font-sans w-full text-left flex items-center justify-between gap-4 px-5 py-4 cursor-pointer bg-transparent border-none"
      >
        <span className={`font-sans text-[14px] font-semibold transition-colors ${open ? "text-teal-700" : "text-[#0a1628]"}`}>
          {q}
        </span>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${open ? "bg-teal-600 rotate-45" : "bg-slate-100"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? "#fff" : "#64748b"} strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="font-sans text-[14px] text-slate-500 leading-relaxed m-0">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Main ─── */
export default function LandingPage() {
  return (
    <div className="font-sans bg-white min-h-screen overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="font-display w-8 h-8 bg-teal-600 rounded-[9px] flex items-center justify-center text-white font-bold text-base shrink-0">
              +
            </div>
            <span className="font-display text-[15px] font-semibold text-[#0a1628] tracking-[-0.2px]">
              Reservasi Dokter
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              ["Fitur", "#fitur"],
              ["Cara Kerja", "#cara-kerja"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="font-sans text-[14px] text-slate-500 hover:text-slate-900 transition-colors"
                style={{ textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="font-sans text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden md:block"
              style={{ textDecoration: "none" }}
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="font-sans inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-[14px] font-semibold px-4 py-2 rounded-[10px] transition-colors"
              style={{ textDecoration: "none" }}
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 bg-[#0a1628] overflow-hidden">
        <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.25)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-95 h-95 rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <p className="font-sans text-[11px] font-bold tracking-[2px] uppercase text-teal-400 mb-6">
            Sistem Antrian Dokter
          </p>

          <h1 className="font-display text-[clamp(34px,5vw,58px)] font-extrabold text-white leading-[1.1] tracking-[-1.5px] mb-6 max-w-3xl mx-auto">
            Antri ketemu dokter,{" "}
            <span className="text-teal-400">
              tanpa harus datang lebih awal.
            </span>
          </h1>

          <p className="font-sans text-[16px] text-white/50 leading-[1.8] max-w-115 mx-auto mb-10">
            Ambil nomor antrian dari mana saja, pilih dokter yang tersedia, dan
            datang tepat waktu.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link
              to="/register"
              className="font-sans inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-[15px] font-bold px-6 py-3.5 rounded-xl transition-colors w-full sm:w-auto"
              style={{ textDecoration: "none" }}
            >
              Mulai Sekarang
              {Icons.arrow}
            </Link>

            <Link
              to="/login"
              className="font-sans inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/12 text-white/70 text-[14px] font-semibold px-5 py-3.5 rounded-xl transition-colors w-full sm:w-auto"
              style={{ textDecoration: "none" }}
            >
              Sudah punya akun
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fitur" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] font-bold tracking-[2px] uppercase text-teal-600 mb-3">
              Fitur
            </p>
            <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold text-[#0a1628] tracking-[-0.6px]">
              Dirancang untuk pasien
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Icons.search,
                title: "Cari Dokter",
                desc: "Temukan dokter dan jadwal yang tersedia.",
              },
              {
                icon: Icons.ticket,
                title: "Ambil Antrian",
                desc: "Nomor antrian instan tanpa perlu ke klinik dulu.",
              },
              {
                icon: Icons.clock,
                title: "Pantau Status",
                desc: "Lihat posisi antrianmu dan datang tepat waktu.",
              },
              {
                icon: Icons.user,
                title: "Riwayat Lengkap",
                desc: "Semua riwayat kunjungan tersimpan di satu tempat.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/8 border border-teal-500/20 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#0a1628] mb-1">
                    {title}
                  </h3>
                  <p className="font-sans text-[13px] text-slate-500 leading-relaxed m-0">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="cara-kerja" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] font-bold tracking-[2px] uppercase text-teal-600 mb-3">
              Cara Kerja
            </p>
            <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold text-[#0a1628] tracking-[-0.6px]">
              3 langkah, selesai
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                num: "01",
                title: "Buat akun",
                desc: "Daftar gratis dengan nama dan email. Hanya butuh beberapa menit.",
              },
              {
                num: "02",
                title: "Pilih dokter",
                desc: "Cari dokter yang tersedia dan lihat sisa kuota antriannya.",
              },
              {
                num: "03",
                title: "Ambil nomor antrian",
                desc: "Konfirmasi booking dan dapatkan nomor antrian secara otomatis.",
              },
            ].map(({ num, title, desc }, i) => (
              <div
                key={num}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#0a1628] border-2 border-teal-500/40 flex items-center justify-center shrink-0">
                  <span className="font-display text-[13px] font-bold text-teal-400">
                    {num}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-[15px] font-bold text-[#0a1628] mb-1.5">
                    {title}
                  </h4>
                  <p className="font-sans text-[13px] text-slate-500 leading-relaxed m-0">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="font-sans inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#0f2040] text-white text-[14px] font-bold px-6 py-3 rounded-[10px] transition-colors"
              style={{ textDecoration: "none" }}
            >
              Coba Sekarang
              {Icons.arrow}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="font-sans text-[11px] font-bold tracking-[2px] uppercase text-teal-600 mb-3">
              FAQ
            </p>
            <h2 className="font-display text-[clamp(22px,3vw,32px)] font-extrabold text-[#0a1628] tracking-[-0.5px]">
              Pertanyaan umum
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                q: "Apakah gratis untuk mendaftar?",
                a: "Ya, membuat akun pasien sepenuhnya gratis. Kamu bisa langsung booking antrian tanpa biaya pendaftaran.",
              },
              {
                q: "Bagaimana saya tahu kapan giliran saya?",
                a: "Setelah booking, kamu bisa memantau posisi antrianmu di halaman Booking Saya.",
              },
              {
                q: "Bisa booking untuk orang lain?",
                a: "Saat ini booking dilakukan atas nama akun yang terdaftar. Pastikan data sesuai pasien yang akan berobat.",
              },
              {
                q: "Apakah saya bisa membatalkan antrian?",
                a: "Pembatalan bisa dilakukan selama status masih menunggu. Hubungi klinik jika ada kendala.",
              },
            ].map(({ q, a }, i) => (
              <FaqItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-70 rounded-full bg-teal-500/12 blur-3xl pointer-events-none" />

        <div className="relative max-w-xl mx-auto px-6 text-center">
          <h2 className="font-display text-[clamp(26px,4vw,40px)] font-extrabold text-white tracking-[-0.8px] leading-[1.2] mb-4">
            Siap ambil antrian
            <br />
            <span className="text-teal-400">tanpa keluar rumah?</span>
          </h2>
          <p className="font-sans text-[14px] text-white/40 mb-8 leading-relaxed">
            Daftar sekarang dan mulai booking antrian dokter dengan mudah.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="font-sans inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-[14px] font-bold px-6 py-3.5 rounded-xl transition-colors"
              style={{ textDecoration: "none" }}
            >
              Daftar Gratis
              {Icons.arrow}
            </Link>

            <Link
              to="/login"
              className="font-sans inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/12 text-white/60 text-[14px] font-semibold px-5 py-3.5 rounded-xl transition-colors"
              style={{ textDecoration: "none" }}
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-100 py-7">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="font-display w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              +
            </div>
            <span className="font-display text-[14px] font-semibold text-[#0a1628]">
              Reservasi Dokter
            </span>
          </div>
          <p className="font-sans text-[13px] text-slate-400 m-0">
            © 2025 Reservasi Dokter
          </p>
        </div>
      </footer>
    </div>
  );
}