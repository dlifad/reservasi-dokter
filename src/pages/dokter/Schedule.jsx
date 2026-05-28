import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Hash,
  Calendar,
  StickyNote,
  ChevronRight,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const avatarColors = [
  "bg-cyan-100 text-cyan-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
];
const getAvatarColor = (name = "") =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="h-1 bg-slate-200" />
      <div className="space-y-2.5 p-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-2.5 w-32 rounded bg-slate-100" />
          </div>
          <div className="h-5 w-16 rounded-full bg-slate-200" />
        </div>
        <div className="h-7 rounded-lg bg-slate-100" />
        <div className="h-7 rounded-lg bg-slate-100" />
        <div className="flex gap-1.5 pt-0.5">
          <div className="h-7 flex-1 rounded-lg bg-slate-200" />
          <div className="h-7 flex-1 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ message }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-20 text-center">
      <ClipboardList className="h-12 w-12 text-slate-300" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ b, type, onApprove, onReject }) {
  const accentTop =
    type === "pending"
      ? "bg-amber-400"
      : type === "approved"
        ? "bg-emerald-500"
        : "bg-rose-500";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${accentTop}`} />

      <div className="flex flex-1 flex-col p-4">
        {/* ── Patient Header ── */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${getAvatarColor(b.pasien_name)}`}
          >
            {getInitials(b.pasien_name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {b.pasien_name}
            </p>
            <p className="truncate text-[11px] text-slate-400">{b.pasien_email}</p>
          </div>

          {/* Status badge */}
          {type === "pending" && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Menunggu
            </span>
          )}
          {type === "approved" && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Disetujui
            </span>
          )}
          {type === "rejected" && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-rose-200">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Ditolak
            </span>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="my-3 border-t border-slate-100" />

        {/* ── Details ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="h-3 w-3" />
              Tanggal
            </span>
            <span className="font-semibold text-slate-800">{b.tanggal}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="h-3 w-3" />
              Jadwal
            </span>
            <span className="font-semibold text-slate-800">
              {b.hari} • {b.jam_mulai}–{b.jam_selesai}
            </span>
          </div>

          {type === "approved" && (
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs ring-1 ring-emerald-200">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <Hash className="h-3 w-3" />
                Antrian
              </span>
              <span className="text-base font-extrabold text-emerald-600">
                #{b.nomor_antrian}
              </span>
            </div>
          )}

          {b.catatan && (
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <StickyNote className="h-3 w-3" />
                Catatan
              </span>
              <p className="mt-1 text-slate-700">{b.catatan}</p>
            </div>
          )}
        </div>

        {/* ── Actions (pending only) ── */}
        {type === "pending" && (
          <div className="mt-3 flex gap-1.5">
            <button
              onClick={onApprove}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              onClick={onReject}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 active:scale-95"
            >
              <XCircle className="h-3.5 w-3.5" />
              Tolak
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Tab Button ────────────────────────────────────────────────────────────────
function TabButton({ active, onClick, color, label, count }) {
  const activeStyles = {
    pending: "bg-amber-500 text-white shadow-sm shadow-amber-200",
    approved: "bg-emerald-500 text-white shadow-sm shadow-emerald-200",
    rejected: "bg-rose-500 text-white shadow-sm shadow-rose-200",
  };
  const inactiveStyles =
    "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
        active ? activeStyles[color] : inactiveStyles
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DoctorDaftarPasien() {
  const [bookings, setBookings] = useState([]);
  const [antrian, setAntrian]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  /* ── Load ── */
  const load = () =>
    Promise.all([
      api.get("/bookings/doctor"),
      api.get("/bookings/antrian"),
    ])
      .then(([r1, r2]) => {
        setBookings(r1.data.bookings || []);
        setAntrian(r2.data.antrian   || []);
      })
      .catch(() => { setBookings([]); setAntrian([]); })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  /* ── Update status ── */
  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    load();
  };

  /* ── Filtered lists ── */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === "pending"),
    [bookings],
  );
  const approvedBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "approved")
        .sort((a, b) => {
          const da = Math.abs(new Date(a.tanggal) - today);
          const db = Math.abs(new Date(b.tanggal) - today);
          return da - db;
        }),
    [bookings],
  );
  const rejectedBookings = useMemo(
    () => bookings.filter((b) => b.status === "rejected"),
    [bookings],
  );

  const currentData =
    activeTab === "pending"
      ? pendingBookings
      : activeTab === "approved"
        ? approvedBookings
        : rejectedBookings;

  /* ── Stat cards ── */
  const statCards = [
    {
      label: "Booking Masuk",
      value: pendingBookings.length,
      icon: ClipboardList,
      color: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-200",
      tab: "pending",
    },
    {
      label: "Daftar Antrian",
      value: approvedBookings.length,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-200",
      tab: "approved",
    },
    {
      label: "Ditolak",
      value: rejectedBookings.length,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      ring: "ring-rose-200",
      tab: "rejected",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-cyan-900 px-7 py-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 right-24 h-36 w-36 rounded-full bg-cyan-400/10 blur-xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-200 ring-1 ring-white/15">
              Daftar Pasien
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Kelola Booking Pasien
            </h2>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-slate-300">
              Approve booking, pantau antrian aktif, dan lihat riwayat booking
              yang ditolak.
            </p>
          </div>

          {/* Antrian active mini-stat */}
          <div className="flex gap-3 sm:flex-col sm:items-end sm:gap-2">
            <div className="rounded-xl bg-white/10 px-4 py-2.5 text-center ring-1 ring-white/10">
              <p className="text-[11px] text-slate-400">Daftar antrian</p>
              <p className="text-2xl font-bold text-white">
                {loading ? (
                  <span className="opacity-40">—</span>
                ) : (
                  approvedBookings.length
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-3">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => setActiveTab(c.tab)}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
            >
              <div className={`rounded-xl ${c.bg} p-3 ring-1 ${c.ring}`}>
                <Icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-slate-400">{c.label}</p>
                <p className="mt-0.5 text-2xl font-bold text-slate-900">
                  {loading ? (
                    <span className="text-slate-300">—</span>
                  ) : (
                    c.value
                  )}
                </p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
            </button>
          );
        })}
      </section>

      {/* ── Tab Panel ─────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Tab header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-4">
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            color="pending"
            label="Booking Masuk"
            count={pendingBookings.length}
          />
          <TabButton
            active={activeTab === "approved"}
            onClick={() => setActiveTab("approved")}
            color="approved"
            label="Daftar Antrian"
            count={approvedBookings.length}
          />
          <TabButton
            active={activeTab === "rejected"}
            onClick={() => setActiveTab("rejected")}
            color="rejected"
            label="Ditolak"
            count={rejectedBookings.length}
          />
        </div>

        {/* Tab content */}
        <div className="p-5">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : currentData.length === 0 ? (
            <div className="grid">
              <EmptyState
                message={
                  activeTab === "pending"
                    ? "Belum ada booking masuk."
                    : activeTab === "approved"
                      ? "Belum ada antrian aktif."
                      : "Belum ada booking yang ditolak."
                }
              />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {currentData.map((b) => (
                <BookingCard
                  key={b.id}
                  b={b}
                  type={activeTab}
                  onApprove={() => updateStatus(b.id, "approved")}
                  onReject={() => updateStatus(b.id, "rejected")}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}