'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  Search, 
  RotateCcw, 
  Check, 
  Plus, 
  Edit2,
  Trash2, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Save
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';

interface PermissionActions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface ModuleItem {
  key: string;
  name: string;
}

interface ModuleGroup {
  name: string;
  isStandalone?: boolean; // e.g. Kupas Sosok which acts as a direct row
  items: ModuleItem[];
}

const MODULE_DATA: ModuleGroup[] = [
  {
    name: 'Profil',
    items: [
      { key: 'biografi', name: 'Biografi' },
    ],
  },
  {
    name: 'Kabar Kedinasan',
    items: [
      { key: 'berita', name: 'Berita' },
      { key: 'pengumuman', name: 'Pengumuman' },
      { key: 'agenda_kegiatan', name: 'Agenda Kegiatan' },
      { key: 'laporan_perjalanan_dinas', name: 'Laporan Perjalanan Dinas' },
      { key: 'dokumen_internal', name: 'Dokumen Internal' },
    ],
  },
  {
    name: 'Antar Pegawai',
    items: [
      { key: 'coretan_opini', name: 'Coretan Opini' },
      { key: 'humor', name: 'Humor' },
      { key: 'kabar_keluarga', name: 'Kabar Keluarga' },
      { key: 'karya_akademik', name: 'Karya Akademik' },
      { key: 'jelajah_bumi', name: 'Jelajah Bumi' },
      { key: 'tips_gaya_hidup', name: 'Tips & Gaya Hidup' },
      { key: 'kalimat_bijak', name: 'Kalimat Bijak' },
      { key: 'konsultasi', name: 'Konsultasi' },
      { key: 'olahraga', name: 'Olahraga' },
      { key: 'tahukah_anda', name: 'Tahukah Anda' },
    ],
  },
  {
    name: 'Kupas Sosok',
    isStandalone: true,
    items: [
      { key: 'kupas_sosok', name: 'Kupas Sosok' },
    ],
  },
];

// Default permissions for Admin and Pegawai
const DEFAULT_PERMISSIONS: Record<string, Record<string, PermissionActions>> = {
  ADMIN: {
    biografi: { view: true, create: true, edit: true, delete: true },
    berita: { view: true, create: true, edit: true, delete: true },
    pengumuman: { view: true, create: true, edit: true, delete: true },
    agenda_kegiatan: { view: true, create: true, edit: true, delete: true },
    laporan_perjalanan_dinas: { view: true, create: true, edit: true, delete: true },
    dokumen_internal: { view: true, create: true, edit: true, delete: true },
    coretan_opini: { view: true, create: true, edit: true, delete: true },
    humor: { view: true, create: true, edit: true, delete: true },
    kabar_keluarga: { view: true, create: true, edit: true, delete: true },
    karya_akademik: { view: true, create: true, edit: true, delete: true },
    jelajah_bumi: { view: true, create: true, edit: true, delete: true },
    tips_gaya_hidup: { view: true, create: true, edit: true, delete: true },
    kalimat_bijak: { view: true, create: true, edit: true, delete: true },
    konsultasi: { view: true, create: true, edit: true, delete: true },
    olahraga: { view: true, create: true, edit: true, delete: true },
    tahukah_anda: { view: true, create: true, edit: true, delete: true },
    kupas_sosok: { view: true, create: true, edit: true, delete: true },
  },
  PEGAWAI: {
    biografi: { view: true, create: false, edit: false, delete: false },
    berita: { view: true, create: false, edit: false, delete: false },
    pengumuman: { view: true, create: false, edit: false, delete: false },
    agenda_kegiatan: { view: true, create: false, edit: false, delete: false },
    laporan_perjalanan_dinas: { view: true, create: false, edit: false, delete: false },
    dokumen_internal: { view: true, create: false, edit: false, delete: false },
    coretan_opini: { view: true, create: true, edit: true, delete: false },
    humor: { view: true, create: true, edit: true, delete: false },
    kabar_keluarga: { view: true, create: true, edit: true, delete: false },
    karya_akademik: { view: true, create: true, edit: true, delete: false },
    jelajah_bumi: { view: true, create: true, edit: true, delete: false },
    tips_gaya_hidup: { view: true, create: true, edit: true, delete: false },
    kalimat_bijak: { view: true, create: true, edit: true, delete: false },
    konsultasi: { view: true, create: true, edit: true, delete: false },
    olahraga: { view: true, create: true, edit: true, delete: false },
    tahukah_anda: { view: true, create: true, edit: true, delete: false },
    kupas_sosok: { view: true, create: false, edit: false, delete: false },
  },
};

export default function KelolaHakAksesPage() {
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'PEGAWAI'>('ADMIN');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState<Record<string, Record<string, PermissionActions>>>(DEFAULT_PERMISSIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Side panel state
  type PanelMode = 'tambah' | 'edit' | null;
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [panelRoleName, setPanelRoleName] = useState('');
  const [panelStatus, setPanelStatus] = useState('unit');
  const [isPanelStatusOpen, setIsPanelStatusOpen] = useState(false);
  const [isPanelSubmitting, setIsPanelSubmitting] = useState(false);

  const STATUS_OPTIONS = [
    { value: 'unit', label: 'Unit' },
    { value: 'pegawai_baru', label: 'Pengguna Baru' },
    { value: 'direktiva', label: 'Direktiva' },
    { value: 'pimpinan', label: 'Pimpinan' },
  ];

  const openPanel = (mode: 'tambah' | 'edit') => {
    if (mode === 'edit') {
      setPanelRoleName(selectedRole === 'ADMIN' ? 'Admin' : 'Pegawai');
      setPanelStatus('unit');
    } else {
      setPanelRoleName('');
      setPanelStatus('unit');
    }
    setIsPanelStatusOpen(false);
    setPanelMode(mode);
  };

  const closeSidePanel = () => {
    setPanelMode(null);
    setIsPanelStatusOpen(false);
  };

  const handlePanelSave = async () => {
    if (!panelRoleName.trim()) return;
    setIsPanelSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate async
    showToast(
      panelMode === 'tambah'
        ? `Role "${panelRoleName}" berhasil ditambahkan!`
        : `Role "${panelRoleName}" berhasil diperbarui!`
    );
    setIsPanelSubmitting(false);
    closeSidePanel();
  };

  // Load saved permissions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('perpusnas_role_permissions_matrix');
      if (saved) {
        setPermissions(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load permissions from cache:', e);
    }
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggle = (moduleKey: string, action: keyof PermissionActions) => {
    setPermissions((prev) => {
      const currentRolePerms = prev[selectedRole] || DEFAULT_PERMISSIONS[selectedRole];
      const currentModulePerms = currentRolePerms[moduleKey] || { view: false, create: false, edit: false, delete: false };
      
      const updated = {
        ...prev,
        [selectedRole]: {
          ...currentRolePerms,
          [moduleKey]: {
            ...currentModulePerms,
            [action]: !currentModulePerms[action],
          },
        },
      };

      try {
        localStorage.setItem('perpusnas_role_permissions_matrix', JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });
  };

  // Reset current role permissions to defaults
  const handleReset = () => {
    setPermissions((prev) => {
      const updated = {
        ...prev,
        [selectedRole]: JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS[selectedRole])),
      };
      try {
        localStorage.setItem('perpusnas_role_permissions_matrix', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setIsResetDialogOpen(false);
    showToast(`Hak akses untuk ${selectedRole === 'ADMIN' ? 'Admin' : 'Pegawai'} berhasil di-reset ke nilai bawaan.`, 'info');
  };

  // Save changes to API & localStorage
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: selectedRole,
          permissionsMatrix: permissions[selectedRole],
        }),
      });

      localStorage.setItem('perpusnas_role_permissions_matrix', JSON.stringify(permissions));
      showToast('Perubahan matriks hak akses berhasil disimpan ke sistem!');
    } catch (e) {
      showToast('Matriks hak akses berhasil diperbarui lokal!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter modules according to search input
  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return MODULE_DATA;

    return MODULE_DATA.map((group) => {
      const groupMatches = group.name.toLowerCase().includes(query);
      const filteredItems = group.items.filter(
        (item) => item.name.toLowerCase().includes(query) || groupMatches
      );

      return {
        ...group,
        items: filteredItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [searchTerm]);

  const currentRoleMatrix = permissions[selectedRole] || DEFAULT_PERMISSIONS[selectedRole];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#00113a] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#00113a] tracking-tight">
          Kelola Hak Akses
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Kelola izin akses tiap peran (role) terhadap masing-masing modul sistem
        </p>
      </div>

      {/* Controls Bar: Role Selector & Search / Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2">
        {/* Left: Role Dropdown matching wireframe */}
        <div className="relative inline-block text-left w-64 z-20">
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#5b6b82] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#485568] transition-colors"
          >
            <span>Role : {selectedRole === 'ADMIN' ? 'Admin' : 'Pegawai'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute left-0 mt-1 w-full bg-white border border-[#c5c6d2] rounded-xl shadow-lg overflow-hidden py-1 z-30">
              <button
                onClick={() => {
                  setSelectedRole('ADMIN');
                  setIsRoleDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedRole === 'ADMIN'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Admin</span>
                {selectedRole === 'ADMIN' && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
              </button>
              <button
                onClick={() => {
                  setSelectedRole('PEGAWAI');
                  setIsRoleDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedRole === 'PEGAWAI'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Pegawai</span>
                {selectedRole === 'PEGAWAI' && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
              </button>
            </div>
          )}
        </div>

        {/* Right: Search Input & Muat Ulang Button */}
        <div className="flex items-center gap-2">
          {/* Search Box with Search Icon button */}
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari modul...."
                className="w-48 sm:w-56 px-3.5 py-2 text-xs bg-white border border-[#c5c6d2] rounded-l-xl focus:outline-hidden focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] text-slate-800 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-white border-y border-r border-[#c5c6d2] rounded-r-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
              title="Cari"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Muat Ulang Button */}
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              showToast('Data hak akses dimuat ulang!', 'info');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#007BFF] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0069d9] active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>

          {/* Tambah Button */}
          <button
            type="button"
            onClick={() => openPanel('tambah')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00113a] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#1a2d5a] active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Permissions Matrix Table Card */}
      <div className="bg-white rounded-2xl border border-[#c5c6d2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#c5c6d2] bg-[#faf8ff]">
                <th className="py-3.5 px-6 text-xs font-bold text-[#00113a] w-[36%] border-r border-[#c5c6d2]">
                  Modul
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#00113a] text-center w-[16%] border-r border-[#c5c6d2]">
                  View
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#00113a] text-center w-[16%] border-r border-[#c5c6d2]">
                  Create
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#00113a] text-center w-[16%] border-r border-[#c5c6d2]">
                  Edit
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#00113a] text-center w-[16%]">
                  Delete
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#c5c6d2] text-xs">
              {filteredGroups.map((group) => {
                // If the group is Kupas Sosok (standalone single row in wireframe)
                if (group.isStandalone) {
                  const item = group.items[0];
                  if (!item) return null;
                  const itemPerms = currentRoleMatrix[item.key] || { view: false, create: false, edit: false, delete: false };

                  return (
                    <tr key={group.name} className="bg-[#eef0fc] hover:bg-[#e4e7fa] transition-colors">
                      <td className="py-3.5 px-6 font-bold text-[#4338ca] border-r border-[#c5c6d2]">
                        {group.name}
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#c5c6d2]">
                        <ToggleSwitch
                          checked={itemPerms.view}
                          onChange={() => handleToggle(item.key, 'view')}
                          label={`View ${item.name}`}
                        />
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#c5c6d2]">
                        <ToggleSwitch
                          checked={itemPerms.create}
                          onChange={() => handleToggle(item.key, 'create')}
                          label={`Create ${item.name}`}
                        />
                      </td>
                      <td className="py-3 px-4 text-center border-r border-[#c5c6d2]">
                        <ToggleSwitch
                          checked={itemPerms.edit}
                          onChange={() => handleToggle(item.key, 'edit')}
                          label={`Edit ${item.name}`}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ToggleSwitch
                          checked={itemPerms.delete}
                          onChange={() => handleToggle(item.key, 'delete')}
                          label={`Delete ${item.name}`}
                        />
                      </td>
                    </tr>
                  );
                }

                // Standard group with header row and sub-items
                return (
                  <React.Fragment key={group.name}>
                    {/* Category Header Row */}
                    <tr className="bg-[#eef0fc]">
                      <td className="py-2.5 px-6 font-bold text-[#4338ca] border-r border-[#c5c6d2]">
                        {group.name}
                      </td>
                      <td className="py-2.5 px-4 border-r border-[#c5c6d2]" />
                      <td className="py-2.5 px-4 border-r border-[#c5c6d2]" />
                      <td className="py-2.5 px-4 border-r border-[#c5c6d2]" />
                      <td className="py-2.5 px-4" />
                    </tr>

                    {/* Sub-item Rows */}
                    {group.items.map((item) => {
                      const itemPerms = currentRoleMatrix[item.key] || { view: false, create: false, edit: false, delete: false };

                      return (
                        <tr key={item.key} className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-6 text-slate-800 font-medium border-r border-[#c5c6d2]">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-center border-r border-[#c5c6d2]">
                            <ToggleSwitch
                              checked={itemPerms.view}
                              onChange={() => handleToggle(item.key, 'view')}
                              label={`View ${item.name}`}
                            />
                          </td>
                          <td className="py-3 px-4 text-center border-r border-[#c5c6d2]">
                            <ToggleSwitch
                              checked={itemPerms.create}
                              onChange={() => handleToggle(item.key, 'create')}
                              label={`Create ${item.name}`}
                            />
                          </td>
                          <td className="py-3 px-4 text-center border-r border-[#c5c6d2]">
                            <ToggleSwitch
                              checked={itemPerms.edit}
                              onChange={() => handleToggle(item.key, 'edit')}
                              label={`Edit ${item.name}`}
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <ToggleSwitch
                              checked={itemPerms.delete}
                              onChange={() => handleToggle(item.key, 'delete')}
                              label={`Delete ${item.name}`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}

              {filteredGroups.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    Tidak ditemukan modul dengan kata kunci &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions: Edit & Hapus Buttons aligned right as in wireframe */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => openPanel('edit')}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#f5a623] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#e09510] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Edit2 className="w-3.5 h-3.5" />
          )}
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => setIsResetDialogOpen(true)}
          className="px-6 py-2.5 bg-[#ff4d4f] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#e03e40] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>

      {/* Confirmation Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleReset}
        title="Reset Hak Akses"
        message={`Apakah Anda yakin ingin mengatur ulang semua izin akses untuk peran ${
          selectedRole === 'ADMIN' ? 'Admin' : 'Pegawai'
        } ke pengaturan standar awal?`}
        confirmText="Ya, Reset"
        cancelText="Batal"
        variant="danger"
      />

      {/* Tambah / Edit Role Modal Popup */}
      <Modal
        isOpen={panelMode !== null}
        onClose={closeSidePanel}
        title={panelMode === 'tambah' ? 'Tambah Role' : 'Edit Role'}
        description={
          panelMode === 'tambah'
            ? 'Tambahkan peran baru ke dalam sistem.'
            : 'Perbarui nama peran yang dipilih.'
        }
        maxWidth="sm"
      >
        <div className="space-y-5">
          {/* Nama Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama Role
            </label>
            <input
              type="text"
              value={panelRoleName}
              onChange={(e) => setPanelRoleName(e.target.value)}
              placeholder={panelMode === 'tambah' ? 'Contoh: Supervisor' : ''}
              autoFocus
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#c5c6d2] rounded-xl focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={closeSidePanel}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handlePanelSave}
              disabled={isPanelSubmitting || !panelRoleName.trim()}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#00113a] text-white hover:bg-[#1a2d5a] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPanelSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Simpan
            </button>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="pt-8 border-t border-[#c5c6d2] mt-8 text-center text-[11px] text-slate-500">
        © Hak Cipta 2026, Perpustakaan Nasional Republik Indonesia.
      </footer>
    </div>
  );
}

// Sleek Pill Toggle Switch matching Google Stitch and wireframe
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-hidden ${
        checked
          ? 'bg-[#00113a] border-[#00113a]'
          : 'bg-slate-200 border-slate-300 hover:bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

