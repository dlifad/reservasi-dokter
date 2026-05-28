import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { ArrowRight, Calendar, Users, ClipboardList, Clock, Hash } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const avatarColors = [
  "bg-cyan-100 text-cyan-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
];
const getAvatarColor = (name = "") =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const statusConfig = {
  approved: { label: "Disetujui", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  rejected: { label: "Ditolak",   cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",         dot: "bg-rose-500" },
  pending:  { label: "Menunggu",  cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-400" },
};

const dayAbbr = { Senin:"Sen", Selasa:"Sel", Rabu:"Rab", Kamis:"Kam", Jumat:"Jum", Sabtu:"Sab", Minggu:"Min" };

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-center">
      <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const order = { Senin:1, Selasa:2, Rabu:3, Kamis:4, Jumat:5, Sabtu:6, Minggu:7 };

    Promise.all([
      api.get("/schedules/my"),
      api.get("/bookings/doctor"),
    ])
      .then(([s1, s2]) => {
        const sorted = [...(s1.data.schedules || [])].sort((a, b) => {
          const d = (order[a.hari] || 99) - (order[b.hari] || 99);
          return d !== 0 ? d : (a.jam_mulai || "").localeCompare(b.jam_mulai || "");
        });
        setSchedules(sorted);
        setBookings(s2.data.bookings || []);
      })
      .catch(() => { setSchedules([]); setBookings([]); })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    totalJadwal:  schedules.length,
    totalBooking: bookings.filter((b) => b.status === "pending").length,
    totalAntrian: bookings.filter((b) => b.status === "approved").length,
  }), [schedules, bookings]);

  const statCards = [
    { label: "Jadwal Saya",    value: stats.totalJadwal,  href: "/doctor/schedule", icon: Calendar,      color: "text-cyan-600",   bg: "bg-cyan-50",    ring: "ring-cyan-200"   },
    { label: "Booking Masuk",  value: stats.totalBooking, href: "/doctor/pasien",   icon: ClipboardList, color: "text-violet-600", bg: "bg-violet-50",  ring: "ring-violet-200" },
    { label: "Daftar Antrian", value: stats.totalAntrian, href: "/doctor/pasien",   icon: Users,         color: "text-emerald-600",bg: "bg-emerald-50", ring: "ring-emerald-200"},
  ];

  return (
    <div className="space-y-6">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-cyan-900 px-7 py-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 right-24 h-36 w-36 rounded-full bg-cyan-400/10 blur-xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-200 ring-1 ring-white/15">
              Dashboard Dokter
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Ringkasan Aktivitas Praktik
            </h2>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-slate-300">
              Pantau jadwal praktik, booking pasien, dan antrian langsung dari satu dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-3">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
              style={{ textDecoration: "none" }}
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-xl ${c.bg} p-2.5 ring-1 ${c.ring}`}>
                  <Icon className={`h-5 w-5 ${c.color}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-500" />
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {loading ? <span className="text-slate-300">—</span> : c.value}
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-500">{c.label}</p>

              <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-cyan-500 to-cyan-300 transition-all duration-300 group-hover:w-full`} />
            </Link>
          );
        })}
      </section>

      {/* ── Content Grid ─────────────────────────────────────────────────── */}
      <section className="grid gap-5 lg:grid-cols-2">

        {/* ── Jadwal ── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Jadwal Terbaru</h3>
              <p className="text-xs text-slate-400">Jadwal praktik yang sudah dibuat</p>
            </div>
            <Link
              to="/doctor/schedule"
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3.5 py-2 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200 transition hover:bg-cyan-100"
              style={{ textDecoration: "none" }}
            >
              Kelola
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-2 p-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : schedules.length === 0
              ? <EmptyState message="Belum ada jadwal praktik." />
              : schedules.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition hover:border-cyan-200 hover:bg-cyan-50/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-cyan-600 text-white shadow-sm shadow-cyan-200">
                      <span className="text-[10px] font-bold uppercase leading-none tracking-wide">
                        {dayAbbr[s.hari] ?? s.hari?.slice(0, 3)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{s.hari}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={11} />
                        <span>{s.jam_mulai} – {s.jam_selesai}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                      <Hash size={10} />
                      {s.kuota}
                    </span>
                  </div>
                ))}
          </div>

          {!loading && schedules.length > 4 && (
            <div className="border-t border-slate-100 px-6 py-3 text-center">
              <Link to="/doctor/schedule" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700" style={{ textDecoration: "none" }}>
                Lihat {schedules.length - 4} jadwal lainnya →
              </Link>
            </div>
          )}
        </div>

        {/* ── Booking ── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Booking Terkini</h3>
              <p className="text-xs text-slate-400">Permintaan booking pasien terbaru</p>
            </div>
            <Link
              to="/doctor/pasien"
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3.5 py-2 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200 transition hover:bg-cyan-100"
              style={{ textDecoration: "none" }}
            >
              Lihat Semua
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-2 p-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : bookings.length === 0
              ? <EmptyState message="Belum ada booking masuk." />
              : bookings.slice(0, 4).map((b) => {
                  const cfg = statusConfig[b.status] ?? statusConfig.pending;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition hover:border-cyan-200 hover:bg-cyan-50/30"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(b.pasien_name)}`}>
                        {getInitials(b.pasien_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{b.pasien_name}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{b.tanggal}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
          </div>

          {!loading && bookings.length > 4 && (
            <div className="border-t border-slate-100 px-6 py-3 text-center">
              <Link to="/doctor/pasien" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700" style={{ textDecoration: "none" }}>
                Lihat {bookings.length - 4} booking lainnya →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}