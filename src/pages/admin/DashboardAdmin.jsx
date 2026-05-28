import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const emptyDoctorForm = {
  name: "",
  email: "",
  password: "",
  specialist: "",
};

// ── Icons ────────────────────────────────────────────────────────────────────
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-2-3.46" />
  </svg>
);
const IconStethoscope = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconKey = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const IconClose = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);
const IconAlert = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconEmpty = () => (
  <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconUser = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconMail = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconLock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconBadge = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const avatarColors = [
  "bg-teal-100 text-teal-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];
const getAvatarColor = (name = "") => avatarColors[name.charCodeAt(0) % avatarColors.length];

// ── Main Component ────────────────────────────────────────────────────────────
export default function DashboardAdmin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pasien");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [resetDoctor, setResetDoctor] = useState(null);

  const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);
  const [resetPassword, setResetPassword] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const [patientsRes, doctorsRes, schedulesRes] = await Promise.all([
        api.get("/admin/users?role=pasien", authHeaders),
        api.get("/admin/users?role=dokter", authHeaders),
        api.get("/admin/schedules", authHeaders),
      ]);
      setPatients(patientsRes.data.users || []);
      setDoctors(doctorsRes.data.users || []);
      setSchedules(schedulesRes.data.schedules || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openAddDoctor = () => {
    setEditingDoctor(null);
    setDoctorForm(emptyDoctorForm);
    setShowDoctorModal(true);
  };
  const openEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({ name: doctor.name || "", email: doctor.email || "", password: "", specialist: doctor.specialist || "" });
    setShowDoctorModal(true);
  };
  const closeDoctorModal = () => { setShowDoctorModal(false); setEditingDoctor(null); setDoctorForm(emptyDoctorForm); };

  const submitDoctor = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      if (editingDoctor) {
        await api.put(`/admin/doctors/${editingDoctor.id}`, { name: doctorForm.name, email: doctorForm.email, specialist: doctorForm.specialist }, authHeaders);
        setSuccess("Data dokter berhasil diperbarui.");
      } else {
        await api.post("/admin/doctors", doctorForm, authHeaders);
        setSuccess("Dokter berhasil ditambahkan.");
      }
      closeDoctorModal();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan dokter.");
    }
  };

  const toggleDoctorStatus = async (doctor) => {
    setError(""); setSuccess("");
    try {
      await api.put(`/admin/doctors/${doctor.id}`, { is_active: doctor.is_active ? 0 : 1 }, authHeaders);
      setSuccess(doctor.is_active ? "Dokter berhasil dinonaktifkan." : "Dokter berhasil diaktifkan.");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah status dokter.");
    }
  };

  const openResetModal = (doctor) => { setResetDoctor(doctor); setResetPassword(""); setShowResetModal(true); };
  const closeResetModal = () => { setResetDoctor(null); setResetPassword(""); setShowResetModal(false); };

  const submitResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await api.put(`/admin/doctors/${resetDoctor.id}/reset-password`, { password: resetPassword }, authHeaders);
      setSuccess("Password dokter berhasil direset.");
      closeResetModal();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal reset password.");
    }
  };

  const usersToShow = activeTab === "pasien" ? patients : doctors;

  const tabs = [
    { key: "pasien", label: "Pasien", icon: <IconUsers /> },
    { key: "dokter", label: "Dokter", icon: <IconStethoscope /> },
    { key: "jadwal", label: "Jadwal", icon: <IconCalendar /> },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-600 to-teal-700 p-6 shadow-lg shadow-teal-200">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-2 top-16 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-bold text-white">Panel Administrator</h1>
            <p className="mt-0.5 text-sm text-teal-100">Kelola pasien, dokter, dan jadwal praktik.</p>
          </div>
          <button
            onClick={openAddDoctor}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 shadow-sm transition hover:bg-teal-50 sm:self-auto"
          >
            <IconPlus />
            Tambah Dokter
          </button>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Pasien", value: patients.length, icon: <IconUsers />, color: "text-teal-200" },
            { label: "Dokter", value: doctors.length, icon: <IconStethoscope />, color: "text-teal-200" },
            { label: "Jadwal", value: schedules.length, icon: <IconCalendar />, color: "text-teal-200" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className={`${color} mb-1`}>{icon}</div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-teal-100">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="shrink-0 text-red-400"><IconAlert /></span>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span className="shrink-0 text-emerald-400"><IconCheck /></span>
          {success}
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="flex gap-1.5 rounded-2xl bg-slate-100 p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-teal-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className={activeTab === tab.key ? "text-teal-600" : "text-slate-400"}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {activeTab !== "jadwal" ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Daftar {activeTab === "pasien" ? "Pasien" : "Dokter"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {usersToShow.length} {activeTab === "pasien" ? "pasien" : "dokter"} terdaftar
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">No</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Nama</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</th>
                  {activeTab === "dokter" && <>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Spesialis</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Aksi</th>
                  </>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: activeTab === "dokter" ? 6 : 3 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : usersToShow.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "dokter" ? 6 : 3}>
                      <div className="flex flex-col items-center gap-2 py-14 text-slate-400">
                        <IconEmpty />
                        <p className="text-sm font-medium">Data tidak ditemukan</p>
                        <p className="text-xs">Belum ada {activeTab === "pasien" ? "pasien" : "dokter"} yang terdaftar.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  usersToShow.map((item, index) => (
                    <tr key={item.id} className="group transition-colors hover:bg-teal-50/30">
                      <td className="px-6 py-3.5 text-sm text-slate-400 font-medium">{index + 1}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(item.name)}`}>
                            {getInitials(item.name)}
                          </span>
                          <span className="text-sm font-medium text-slate-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-slate-500">{item.email}</td>
                      {activeTab === "dokter" && <>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-slate-600">
                            {item.specialist || <span className="text-slate-300">—</span>}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.is_active
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {item.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex flex-wrap gap-1.5">
                            <ActionBtn variant="blue" icon={<IconEdit />} onClick={() => openEditDoctor(item)}>Edit</ActionBtn>
                            <ActionBtn variant={item.is_active ? "orange" : "green"} onClick={() => toggleDoctorStatus(item)}>
                              {item.is_active ? "Nonaktifkan" : "Aktifkan"}
                            </ActionBtn>
                            <ActionBtn variant="purple" icon={<IconKey />} onClick={() => openResetModal(item)}>Reset Password</ActionBtn>
                          </div>
                        </td>
                      </>}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Schedule Tab ── */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Jadwal Dokter</h2>
            <p className="text-xs text-slate-400 mt-0.5">{schedules.length} jadwal tersedia</p>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {schedules.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center gap-2 py-14 text-slate-400">
                <IconEmpty />
                <p className="text-sm font-medium">Belum ada jadwal</p>
                <p className="text-xs">Jadwal dokter akan muncul di sini.</p>
              </div>
            ) : (
              schedules.map((s) => {
                const isActive = s.is_active && s.doctor_active;
                return (
                  <div
                    key={s.id}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md hover:border-teal-200"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                          {s.doctor_name}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            isActive
                              ? "bg-teal-50 text-teal-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <span className="mt-2 inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {s.hari}
                      </span>
                      <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                        <IconClock />
                        <span>
                          {s.jam_mulai} – {s.jam_selesai}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <p className="text-xs text-slate-400">Kuota pasien</p>
                        <span className="text-sm font-semibold text-slate-700">
                          {s.kuota}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── Add / Edit Doctor Modal ── */}
      {showDoctorModal && (
        <Modal
          title={editingDoctor ? "Edit Data Dokter" : "Tambah Dokter Baru"}
          subtitle={editingDoctor ? `Perbarui informasi dr. ${editingDoctor.name}` : "Isi data berikut untuk mendaftarkan dokter baru"}
          icon={<IconStethoscope />}
          onClose={closeDoctorModal}
        >
          <form onSubmit={submitDoctor} className="space-y-4">
            <Field label="Nama Lengkap" icon={<IconUser />}>
              <input
                className="modal-input"
                placeholder="Masukkan nama dokter"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Alamat Email" icon={<IconMail />}>
              <input
                type="email"
                className="modal-input"
                placeholder="dokter@rumahsakit.com"
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                required
              />
            </Field>
            {!editingDoctor && (
              <Field label="Password" icon={<IconLock />}>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="Minimal 8 karakter"
                  value={doctorForm.password}
                  onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                  required
                />
              </Field>
            )}
            <Field label="Spesialis" icon={<IconBadge />}>
              <input
                className="modal-input"
                placeholder="cth. Dokter Umum, Spesialis Anak"
                value={doctorForm.specialist}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialist: e.target.value })}
              />
            </Field>
            <ModalFooter
              onCancel={closeDoctorModal}
              submitLabel={editingDoctor ? "Simpan Perubahan" : "Tambah Dokter"}
            />
          </form>
        </Modal>
      )}

      {/* ── Reset Password Modal ── */}
      {showResetModal && (
        <Modal
          title="Reset Password"
          subtitle="Buat password baru untuk dokter ini"
          icon={<IconKey />}
          iconColor="bg-amber-100 text-amber-600"
          onClose={closeResetModal}
        >
          <form onSubmit={submitResetPassword} className="space-y-4">
            {/* Doctor info card */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(resetDoctor?.name)}`}>
                {getInitials(resetDoctor?.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{resetDoctor?.name}</p>
                <p className="text-xs text-slate-400 truncate">{resetDoctor?.email}</p>
              </div>
            </div>

            <Field label="Password Baru" icon={<IconLock />}>
              <input
                type="password"
                className="modal-input"
                placeholder="Masukkan password baru"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                required
              />
            </Field>
            <ModalFooter
              onCancel={closeResetModal}
              submitLabel="Reset Password"
              submitVariant="amber"
            />
          </form>
        </Modal>
      )}

      {/* ── Global modal input styles ── */}
      <style>{`
        .modal-input {
          display: block;
          width: 100%;
          padding: 0.625rem 0.875rem 0.625rem 2.5rem;
          font-size: 0.875rem;
          color: #1e293b;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.15s ease;
        }
        .modal-input::placeholder { color: #cbd5e1; }
        .modal-input:focus {
          border-color: #2dd4bf;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.15);
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
const variantMap = {
  blue:    "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300",
  orange:  "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300",
  green:   "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
  purple:  "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300",
  default: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
};

function ActionBtn({ children, onClick, variant = "default", icon }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${variantMap[variant]}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

function ModalFooter({ onCancel, submitLabel, submitVariant = "teal" }) {
  const submitStyles = {
    teal: "bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 shadow-teal-200 text-white",
    amber: "bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-amber-200 text-white",
  };
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
      >
        Batal
      </button>
      <button
        type="submit"
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all active:scale-95 ${submitStyles[submitVariant]}`}
      >
        {submitLabel}
      </button>
    </div>
  );
}

function Modal({ title, subtitle, icon, iconColor = "bg-teal-100 text-teal-600", onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
      style={{ animation: "backdropIn 0.2s ease both" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5"
        style={{ animation: "modalSlideUp 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:scale-95"
          >
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}