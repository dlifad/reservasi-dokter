import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

/* ─── Icons ─── */
const Icon = {
  arrow: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  doctor: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4M12 3a9 9 0 100 18A9 9 0 0012 3z" />
    </svg>
  ),
};

/* ─── Stat Card ─── */
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center justify-between gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div>
        <p className="font-sans text-[12px] font-medium text-slate-400 uppercase tracking-wide m-0">
          {label}
        </p>
        <p className="font-display text-[28px] font-bold text-[#0a1628] tracking-tight leading-none mt-1.5 m-0">
          {value}
        </p>
      </div>
      <div className="w-10.5 h-10.5 rounded-[10px] bg-teal-500/8 border border-teal-500/18 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  );
}

/* ─── Doctor Card ─── */
function DoctorCard({ s }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1">

      {/* Card Header */}
      <div className="bg-[#0a1628] px-5.5 pt-4 pb-5 relative overflow-hidden">
        <div className="absolute -top-5 -right-5 w-25 h-25 rounded-full bg-teal-500/25 blur-2xl pointer-events-none" />

        {/* Badge Hari */}
        <span className="font-sans inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[1.2px] uppercase bg-teal-500/18 border border-teal-500/30 text-teal-300">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
          {s.hari}
        </span>

        {/* Nama Dokter */}
        <h4 className="font-display text-[17px] font-bold text-white tracking-[-0.2px] mt-2 mb-0.5">
          {s.doctor_name}
        </h4>

        {/* Spesialis */}
        <p className="font-sans text-[12px] text-white/40">
          Dokter {s.specialist || "Umum"}
        </p>
      </div>

      {/* Time Badge */}
      <div className="px-5.5 -mt-8 relative z-10">
        <div className="font-sans w-full inline-flex items-center gap-1.75 bg-teal-50 border border-teal-500/20 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold text-teal-600">
          {Icon.clock}
          {s.jam_mulai} – {s.jam_selesai}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5.5 pt-3.5 pb-5.5 flex flex-col gap-3 flex-1">

        {/* Kuota */}
        <div className="font-sans flex items-center justify-between bg-slate-50 border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-[13px]">
          <span className="text-slate-500">
            Kuota Tersisa
          </span>

          <span className="font-bold text-[#0a1628]">
            {s.kuota}
            <span className="font-normal text-slate-400 ml-1">
              slot
            </span>
          </span>
        </div>

        {/* Button */}
        <Link
          to={`/book/${s.id}`}
          className="font-sans flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.75 text-[13px] font-bold text-white bg-teal-600 tracking-[0.1px] transition-opacity hover:opacity-80"
          style={{ textDecoration: "none" }}
        >
          Booking Sekarang
          {Icon.arrow}
        </Link>
      </div>
    </article>
  );
}

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="h-27.5 bg-slate-200" />
      <div className="p-5.5 flex flex-col gap-2.5">
        <div className="h-3 w-[70%] bg-slate-200 rounded-md animate-pulse" />
        <div className="h-3 w-[50%] bg-slate-200 rounded-md animate-pulse" />
        <div className="h-10 bg-slate-200 rounded-[10px] mt-1 animate-pulse" />
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/schedules")
      .then((r) => setSchedules(r.data.schedules || []))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      totalDokter: new Set(schedules.map((s) => s.doctor_name)).size,
      totalJadwal: schedules.length,
      totalKuota: schedules.reduce((acc, s) => acc + (Number(s.kuota) || 0), 0),
    }),
    [schedules],
  );

  return (
    <div className="font-sans flex flex-col gap-7">

      {/* ── Hero Banner ── */}
      <section className="bg-[#0a1628] rounded-[18px] px-10 py-9 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-55 h-55 rounded-full bg-teal-500/22 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 left-20 w-40 h-40 rounded-full bg-teal-500/10 blur-[36px] pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-130">
            <h2 className="font-display text-[clamp(20px,2.5vw,28px)] font-extrabold text-white tracking-[-0.6px] leading-[1.3] mt-3.5 mb-0">
              Selamat datang! Yuk jadwalkan
              <br />
              kunjunganmu.
            </h2>
            <p className="font-sans text-[13px] text-white/40 leading-[1.7] mt-2.5 mb-0 max-w-100">
              Pilih dokter, tentukan tanggal, dan booking dalam hitungan detik. Tanpa antri di tempat.
            </p>
          </div>

          <Link
            to="/patient/bookings"
            className="font-sans inline-flex items-center gap-2 rounded-[10px] px-5 py-2.75 bg-teal-600 text-white text-[13px] font-bold whitespace-nowrap shrink-0 transition-opacity hover:opacity-80"
            style={{ textDecoration: "none" }}
          >
            <span className="no-underline">Lihat Booking Saya</span>
            {Icon.arrow}
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <StatCard label="Dokter Aktif"      value={loading ? "—" : stats.totalDokter}            icon={Icon.doctor}   />
        <StatCard label="Jadwal Tersedia"   value={loading ? "—" : stats.totalJadwal}            icon={Icon.calendar} />
        <StatCard label="Total Kuota"       value={loading ? "—" : `${stats.totalKuota} slot`}   icon={Icon.check}    />
      </section>

      {/* ── Doctor Schedule List ── */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h3 className="font-display text-[20px] font-bold text-[#0a1628] tracking-[-0.3px] m-0">
              Jadwal Dokter
            </h3>
            <p className="font-sans text-[13px] text-slate-400 mt-1 mb-0">
              Pilih jadwal lalu lakukan booking
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-dashed border-teal-500/25 bg-teal-500/3 py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-500/8 border border-teal-500/20 flex items-center justify-center">
              {Icon.calendar}
            </div>
            <p className="font-display text-[14px] font-bold text-[#0a1628] m-0">
              Belum ada jadwal aktif
            </p>
            <p className="font-sans text-[13px] text-slate-400 m-0">
              Jadwal dokter belum tersedia saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
            {schedules.map((s) => <DoctorCard key={s.id} s={s} />)}
          </div>
        )}
      </section>
    </div>
  );
}