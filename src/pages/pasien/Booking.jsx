import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function BookingPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({ catatan: "" });
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/schedules")
      .then((res) => {
        const found = res.data.schedules.find((s) => s.id === Number(id));
        setSchedule(found || null);
      })
      .catch(() => setSchedule(null));
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.catatan.trim()) return setError("Keluhan / catatan wajib diisi.");

    setLoading(true);
    try {
      await api.post("/bookings", { schedule_id: Number(id), ...form });
      nav("/patient/bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-120 flex flex-col gap-5">

        {/* Card */}
        <div className="bg-white rounded-[18px] border border-slate-200 overflow-hidden shadow-[0_2px_12px_rgba(10,22,40,0.06)]">

          {/* Header */}
          <div className="bg-[#0a1628] px-8 py-7 relative overflow-hidden">
            {/* Glow blobs */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-5 left-16 w-28 h-28 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="font-display text-[22px] font-extrabold text-white mt-0 mb-1">
                Buat Booking
              </h2>
              <p className="text-[12px] text-white/40 m-0">
                Isi detail kunjungan kamu di bawah ini
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit}>
            <div className="px-8 py-7 flex flex-col gap-5">

              {/* Error */}
              {error && (
                <div className="rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600 flex items-center gap-2">
                  {error}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-slate-200 -mx-8" />

              {/* Catatan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                  Keluhan / Catatan
                </label>
                <textarea
                  name="catatan"
                  rows={5}
                  placeholder="Deskripsikan keluhan kamu..."
                  value={form.catatan}
                  onChange={change}
                  className="font-sans w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] text-[#0a1628] outline-none resize-none leading-relaxed focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="font-sans flex items-center justify-center gap-2 rounded-[10px] px-5 py-3.5 bg-teal-600 text-white text-[14px] font-bold border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Kirim Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}