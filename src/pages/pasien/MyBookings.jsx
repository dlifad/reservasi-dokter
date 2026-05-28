import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

/* ─── Status Config ─── */
const STATUS = {
  pending: {
    label: "Menunggu",
    classes: "bg-amber-500/[0.08] border border-amber-400/25 text-amber-700",
    dotClass: "bg-amber-400",
  },
  approved: {
    label: "Disetujui",
    classes: "bg-emerald-500/[0.08] border border-emerald-400/25 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  rejected: {
    label: "Ditolak",
    classes: "bg-red-500/[0.08] border border-red-400/20 text-red-700",
    dotClass: "bg-red-500",
  },
};

/* ─── Icons ─── */
const Icon = {
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  ),
};

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="h-21.5 bg-slate-200" />
      <div className="px-5.5 py-4.5 flex flex-col gap-2">
        <div className="h-2.75 w-[65%] bg-slate-200 rounded-md animate-pulse" />
        <div className="h-2.75 w-[45%] bg-slate-200 rounded-md animate-pulse" />
        <div className="h-2" />
        <div className="h-9 bg-slate-100 rounded-[9px] animate-pulse" />
        <div className="h-9 bg-slate-100 rounded-[9px] animate-pulse" />
      </div>
    </div>
  );
}

/* ─── Confirm Dialog ─── */
function ConfirmDialog({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-[16px] font-bold text-[#0a1628] m-0">
            Batalkan Booking?
          </h3>
          <p className="font-sans text-[13px] text-slate-500 m-0 leading-relaxed">
            Booking yang dibatalkan tidak bisa dikembalikan. Kuota akan otomatis dikembalikan.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="font-sans flex-1 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            Tidak
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="font-sans flex-1 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Membatalkan..." : "Ya, Batalkan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Booking Card ─── */
function BookingCard({ b, onCancel }) {
  const st = STATUS[b.status] ?? STATUS.pending;
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      await api.put(`/bookings/${b.id}/cancel`);
      onCancel(b.id);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan booking.");
      setShowConfirm(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          loading={cancelling}
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-[0_8px_24px_rgba(10,22,40,0.10)] hover:-translate-y-0.5">
        {/* Header */}
        <div className="bg-[#0a1628] px-5.5 pt-4.5 pb-3 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-teal-500/20 blur-[18px] pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <p className="font-sans text-[10px] font-bold tracking-[1px] uppercase text-teal-300 m-0">
                Dokter
              </p>
              <h4 className="font-display text-[15px] font-bold text-white tracking-[-0.2px] mt-1 mb-0">
                {b.doctor_name}
              </h4>
            </div>
            <span className={`font-sans inline-flex items-center gap-1.25 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shrink-0 ${st.classes}`}>
              <span className={`w-1.25 h-1.25 rounded-full shrink-0 ${st.dotClass}`} />
              {st.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5.5 pt-3.5 pb-5 flex flex-col gap-2">
          <div className="font-sans flex items-center justify-between bg-slate-50 border border-slate-200 rounded-[9px] px-3 py-2.25 text-[13px]">
            <span className="text-slate-400">Tanggal</span>
            <span className="font-semibold text-[#0a1628]">{b.tanggal}</span>
          </div>

          <div className="font-sans flex items-center justify-between bg-slate-50 border border-slate-200 rounded-[9px] px-3 py-2.25 text-[13px]">
            <span className="text-slate-400">Jadwal</span>
            <span className="font-semibold text-[#0a1628]">
              {b.hari} • {b.jam_mulai}–{b.jam_selesai}
            </span>
          </div>

          {b.nomor_antrian && (
            <div className="font-sans flex items-center justify-between bg-teal-500/6 border border-teal-500/18 rounded-[9px] px-3 py-2.25 text-[13px]">
              <span className="font-medium text-teal-600">Nomor Antrian</span>
              <span className="font-extrabold text-[15px] text-teal-600">#{b.nomor_antrian}</span>
            </div>
          )}

          {/* Tombol Batal — hanya muncul jika status pending */}
          {b.status === "pending" && (
            <button
              onClick={() => setShowConfirm(true)}
              className="font-sans mt-1 w-full flex items-center justify-center rounded-[9px] px-3 py-2.25 text-[13px] font-semibold text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
            >
              Batalkan Booking
            </button>
          )}
        </div>
      </article>
    </>
  );
}

/* ─── Main Component ─── */
export default function PatientBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((r) => setBookings(r.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  // hapus card dari state setelah berhasil dibatalkan
  const handleCancel = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="font-sans flex flex-col gap-7">

      {/* ── Hero ── */}
      <section className="bg-[#0a1628] rounded-[18px] px-9 py-7 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-50 h-50 rounded-full bg-teal-500/22 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 left-15 w-35 h-35 rounded-full bg-teal-500/10 blur-[32px] pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-[clamp(18px,2.2vw,24px)] font-extrabold text-white tracking-[-0.4px] leading-tight mt-2.5 mb-1">
              Booking Saya
            </h2>
            <p className="font-sans text-[12px] text-white/40 m-0">
              Riwayat dan status reservasi kamu
            </p>
          </div>
        <Link
          to="/patient"
          className="font-sans inline-flex items-center gap-2 rounded-[10px] px-4.5 py-2.75 bg-teal-600 text-white text-[13px] font-bold whitespace-nowrap shrink-0 transition-opacity hover:opacity-80"
          style={{ textDecoration: "none" }}
        >
          <span style={{ textDecoration: "none" }}>
            + Booking Baru
          </span>
        </Link>
        </div>
      </section>

      {/* ── List ── */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4.5">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-15 px-6 bg-white rounded-[18px] border border-dashed border-slate-200 gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-teal-500/8 border border-teal-500/18 flex items-center justify-center">
            {Icon.calendar}
          </div>
          <p className="font-display text-[15px] font-bold text-[#0a1628] m-0">Belum ada booking</p>
          <p className="font-sans text-[13px] text-slate-400 m-0">Kamu belum memiliki riwayat reservasi.</p>
          <Link
            to="/patient"
            className="font-sans inline-flex items-center gap-1.75 rounded-[10px] px-4.5 py-2.5 bg-teal-600 text-white text-[13px] font-bold no-underline mt-1 transition-opacity hover:opacity-80"
          >
            Lihat Jadwal Dokter {Icon.arrow}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4.5">
          {bookings.map((b) => (
            <BookingCard key={b.id} b={b} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
}