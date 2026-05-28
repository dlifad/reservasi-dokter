import { useEffect, useState } from "react";
import api from "../../api";
import {
  Plus, Pencil, Trash2, Clock, Hash, CalendarDays,
  X, Check, AlertTriangle, ChevronDown,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const HARI_LIST = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DAY_ORDER = Object.fromEntries(HARI_LIST.map((h, i) => [h, i + 1]));

const DAY_COLOR = {
  Senin:  "bg-cyan-600",
  Selasa: "bg-violet-600",
  Rabu:   "bg-emerald-600",
  Kamis:  "bg-amber-500",
  Jumat:  "bg-rose-500",
  Sabtu:  "bg-indigo-500",
  Minggu: "bg-pink-500",
};

const DAY_ABBR = {
  Senin:"Sen", Selasa:"Sel", Rabu:"Rab",
  Kamis:"Kam", Jumat:"Jum", Sabtu:"Sab", Minggu:"Min",
};

const EMPTY_FORM = { hari: "Senin", jam_mulai: "08:00", jam_selesai: "16:00", kuota: 10 };

// ── Sub-components ────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
      <div className="h-11 w-11 rounded-xl bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-24 rounded bg-slate-200" />
        <div className="h-3 w-36 rounded bg-slate-100" />
      </div>
      <div className="h-6 w-14 rounded-full bg-slate-200" />
      <div className="flex gap-2">
        <div className="h-8 w-8 rounded-lg bg-slate-200" />
        <div className="h-8 w-8 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 ring-1 ring-cyan-200">
        <CalendarDays className="h-7 w-7 text-cyan-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Belum ada jadwal praktik</p>
        <p className="mt-1 text-xs text-slate-400">Tambahkan jadwal pertama Anda untuk mulai menerima booking.</p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-200 transition hover:bg-cyan-700"
      >
        <Plus size={15} /> Tambah Jadwal
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function ScheduleModal({ mode, form, onChange, onSubmit, onClose, loading, error }) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-slate-300/40 ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? "Edit Jadwal" : "Tambah Jadwal"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? "Ubah detail jadwal praktik Anda." : "Isi detail jadwal praktik baru."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Hari */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Hari</label>
            <div className="relative">
              <select
                name="hari"
                value={form.hari}
                onChange={onChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
              >
                {HARI_LIST.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Jam */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Jam Mulai</label>
              <input
                type="time"
                name="jam_mulai"
                value={form.jam_mulai}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Jam Selesai</label>
              <input
                type="time"
                name="jam_selesai"
                value={form.jam_selesai}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
              />
            </div>
          </div>

          {/* Kuota */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Kuota Pasien</label>
            <input
              type="number"
              name="kuota"
              min={1}
              max={100}
              value={form.kuota}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
            />
            <p className="mt-1 text-xs text-slate-400">Maksimal pasien yang dapat booking pada jadwal ini.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-cyan-200 transition hover:bg-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <Check size={15} />
            )}
            {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Jadwal"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ schedule, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-slate-300/40 ring-1 ring-slate-200 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-200 mx-auto mb-4">
          <Trash2 className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-center text-base font-bold text-slate-900 mb-1">Hapus Jadwal?</h3>
        <p className="text-center text-sm text-slate-500 mb-6">
          Jadwal{" "}
          <span className="font-semibold text-slate-700">
            {schedule?.hari}, {schedule?.jam_mulai}–{schedule?.jam_selesai}
          </span>{" "}
          akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div className={`fixed bottom-6 right-6 z-60 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl ring-1 transition-all
      ${isError
        ? "bg-red-500 text-white ring-red-400"
        : "bg-slate-900 text-white ring-slate-700"
      }`}
    >
      {isError ? <AlertTriangle size={15} /> : <Check size={15} className="text-cyan-400" />}
      {message}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ScheduleManager() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);

  const [modalMode, setModalMode]     = useState(null); // "add" | "edit" | null
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm]         = useState(EMPTY_FORM);
  const [formErr, setFormErr]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const [toast, setToast] = useState({ message: "", type: "success" });

  // ── Fetch ──
  const fetchSchedules = async () => {
    try {
      const { data } = await api.get("/schedules/my");
      const sorted = [...(data.schedules || [])].sort((a, b) => {
        const d = (DAY_ORDER[a.hari] || 9) - (DAY_ORDER[b.hari] || 9);
        return d !== 0 ? d : (a.jam_mulai || "").localeCompare(b.jam_mulai || "");
      });
      setSchedules(sorted);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchedules(); }, []);

  // ── Toast helper ──
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  // ── Handlers ──
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormErr("");
    setModalMode("add");
  };

  const openEdit = (s) => {
    setEditTarget(s);
    setForm({ hari: s.hari, jam_mulai: s.jam_mulai, jam_selesai: s.jam_selesai, kuota: s.kuota });
    setFormErr("");
    setModalMode("edit");
  };

  const closeModal = () => { setModalMode(null); setEditTarget(null); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "kuota" ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    if (!form.hari || !form.jam_mulai || !form.jam_selesai) {
      setFormErr("Hari, jam mulai, dan jam selesai wajib diisi.");
      return;
    }
    if (form.jam_selesai <= form.jam_mulai) {
      setFormErr("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }
    setFormErr("");
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await api.post("/schedules", form);
        showToast("Jadwal berhasil ditambahkan.");
      } else {
        await api.put(`/schedules/${editTarget.id}`, form);
        showToast("Jadwal berhasil diperbarui.");
      }
      closeModal();
      fetchSchedules();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/schedules/${deleteTarget.id}`);
      showToast("Jadwal berhasil dihapus.");
      setDeleteTarget(null);
      fetchSchedules();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menghapus jadwal.", "error");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ──
  return (
    <>
      <div className="space-y-6">

        {/* ── Header ── */}
        <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-cyan-900 px-7 py-8 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 right-24 h-36 w-36 rounded-full bg-cyan-400/10 blur-xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-200 ring-1 ring-white/15">
                Jadwal Praktik
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Kelola Jadwal Saya
              </h2>
              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-slate-300">
                Atur hari, jam, dan kuota pasien untuk setiap jadwal praktik Anda.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        {!loading && schedules.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Jadwal",   value: schedules.length,                                    color: "text-cyan-600",    bg: "bg-cyan-50",    ring: "ring-cyan-200"    },
              { label: "Total Kuota",    value: schedules.reduce((a, s) => a + (s.kuota || 0), 0),  color: "text-violet-600",  bg: "bg-violet-50",  ring: "ring-violet-200"  },
              { label: "Hari Aktif",     value: new Set(schedules.map((s) => s.hari)).size,          color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Schedule List ── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daftar Jadwal</h3>
              <p className="text-xs text-slate-400">
                {loading ? "Memuat..." : `${schedules.length} jadwal terdaftar`}
              </p>
            </div>
            {!loading && schedules.length > 0 && (
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3.5 py-2 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200 transition hover:bg-cyan-100"
              >
                <Plus size={13} /> Tambah
              </button>
            )}
          </div>

          <div className="p-4 space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : schedules.length === 0 ? (
              <EmptyState onAdd={openAdd} />
            ) : (
              schedules.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4 transition hover:border-cyan-200 hover:bg-cyan-50/30"
                >
                  {/* Day badge */}
                  <div className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-sm ${DAY_COLOR[s.hari] ?? "bg-slate-600"}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wide leading-none">
                      {DAY_ABBR[s.hari] ?? s.hari?.slice(0, 3)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">{s.hari}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} className="text-slate-400" />
                        {s.jam_mulai} – {s.jam_selesai}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Hash size={11} className="text-slate-400" />
                        {s.kuota} kuota
                      </span>
                    </div>
                  </div>

                  {/* Active badge */}
                  <span className={`hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 sm:inline-flex
                    ${s.is_active
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-100 text-slate-500 ring-slate-200"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${s.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {s.is_active ? "Aktif" : "Nonaktif"}
                  </span>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => openEdit(s)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600"
                      title="Edit jadwal"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      title="Hapus jadwal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modalMode && (
        <ScheduleModal
          mode={modalMode}
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
          loading={submitting}
          error={formErr}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          schedule={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* ── Toast ── */}
      <Toast message={toast.message} type={toast.type} />
    </>
  );
}