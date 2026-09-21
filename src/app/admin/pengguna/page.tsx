'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Pagination state (Matching wireframe & log-aktivitas: Tampilkan [ 10 v ] data)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = useState(false);
  const perPageDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  // Create Modal State (Matching Wireframe)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNip, setNewNip] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAlamat, setNewAlamat] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newUnitKerja, setNewUnitKerja] = useState('');
  const [newSatuanKerja, setNewSatuanKerja] = useState('');
  const [isCreateSatuanKerjaDropdownOpen, setIsCreateSatuanKerjaDropdownOpen] = useState(false);
  const createSatuanKerjaDropdownRef = useRef<HTMLDivElement>(null);
  const [newGolRuang, setNewGolRuang] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newRoleId, setNewRoleId] = useState('');
  const [isCreateRoleDropdownOpen, setIsCreateRoleDropdownOpen] = useState(false);
  const createRoleDropdownRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRoleId, setEditRoleId] = useState('');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editPosition, setEditPosition] = useState('');
  const [editUnitKerja, setEditUnitKerja] = useState('');
  const [editSatuanKerja, setEditSatuanKerja] = useState('');
  const [editResetPassword, setEditResetPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchUsers = () => {
    setIsLoading(true);
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data);
          setRoles(data.roles);
          if (data.roles.length > 0 && !newRoleId) {
            const defaultRole = data.roles.find((r: any) => r.name === 'ADMINISTRATOR') || data.roles[0];
            setNewRoleId(defaultRole.id);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showToast('Gagal memuat data pengguna', 'error');
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search matching (against activeSearch or searchQuery)
      const query = activeSearch.trim().toLowerCase();
      const matchesSearch = query === '' ||
        (u.name && u.name.toLowerCase().includes(query)) ||
        (u.nip && u.nip.includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query));

      // Status matching
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && u.status === 'ACTIVE') ||
        (statusFilter === 'INACTIVE' && u.status === 'INACTIVE');

      return matchesSearch && matchesStatus;
    });
  }, [users, activeSearch, statusFilter]);

  // Reset to page 1 whenever filters/search/itemsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, statusFilter, itemsPerPage]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Page navigation helper
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  // Generate pagination range matching wireframe: <  1  2  3  4  5  ...  >
  const paginationRange = useMemo(() => {
    if (totalPages <= 5) {
      const range = [];
      for (let i = 1; i <= Math.max(1, totalPages); i++) {
        range.push(i);
      }
      return range;
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [totalPages, currentPage]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchQuery);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveSearch('');
    setStatusFilter('ALL');
    fetchUsers();
    showToast('Data pengguna dimuat ulang!', 'info');
  };

  // Toggle user status inline
  const handleToggleStatus = async (user: any) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status ${user.name} diubah menjadi ${nextStatus === 'ACTIVE' ? 'Aktif' : 'Non-Aktif'}`);
      } else {
        // Rollback
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: user.status } : u))
        );
        showToast(data.message || 'Gagal mengubah status', 'error');
      }
    } catch (e) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: user.status } : u))
      );
      showToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const SATUAN_KERJA_OPTIONS = ['Sistem Informasi', 'Pusat Data dan Informasi'];

  const selectedRoleName = useMemo(() => {
    const r = roles.find((role) => role.id === newRoleId);
    if (!r) return 'Peran';
    return r.name === 'ADMINISTRATOR' ? 'Admin' : 'Pegawai';
  }, [roles, newRoleId]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (createRoleDropdownRef.current && !createRoleDropdownRef.current.contains(event.target as Node)) {
        setIsCreateRoleDropdownOpen(false);
      }
      if (createSatuanKerjaDropdownRef.current && !createSatuanKerjaDropdownRef.current.contains(event.target as Node)) {
        setIsCreateSatuanKerjaDropdownOpen(false);
      }
      if (perPageDropdownRef.current && !perPageDropdownRef.current.contains(event.target as Node)) {
        setIsPerPageDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Create user
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nip: newNip,
          name: newName,
          email: newEmail,
          password: newPassword,
          roleId: newRoleId,
          position: newPosition,
          unitKerja: newUnitKerja,
          satuanKerja: newSatuanKerja,
          golRuang: newGolRuang,
          phone: newPhone,
          address: newAlamat,
          birthDate: newBirthDate,
          bio: newAlamat ? `${newAlamat}${newNotes ? ` | ${newNotes}` : ''}` : newNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        // Reset form
        setNewNip('');
        setNewName('');
        setNewEmail('');
        setNewAlamat('');
        setNewPhone('');
        setNewBirthDate('');
        setNewPassword('');
        setNewPosition('');
        setNewUnitKerja('');
        setNewSatuanKerja('');
        setNewGolRuang('');
        setNewNotes('');
        fetchUsers();
        showToast('Pengguna baru berhasil ditambahkan!');
      } else {
        showToast(data.message || 'Gagal menambahkan pengguna', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Open edit modal
  const handleEditOpen = (user: any) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRoleId(user.roleId);
    setEditStatus(user.status);
    setEditPosition(user.profile?.position || '');
    setEditUnitKerja(user.profile?.unitKerja || '');
    const foundSatuan = SATUAN_KERJA_OPTIONS.find(opt => user.profile?.unitKerja?.includes(opt));
    setEditSatuanKerja(foundSatuan || '');
    setEditResetPassword('');
  };

  // Update user
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsUpdating(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: editName,
          email: editEmail,
          roleId: editRoleId,
          status: editStatus,
          position: editPosition,
          unitKerja: editUnitKerja,
          satuanKerja: editSatuanKerja,
          resetPassword: editResetPassword || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingUser(null);
        fetchUsers();
        showToast('Data pengguna berhasil diperbarui!');
      } else {
        showToast(data.message || 'Gagal memperbarui pengguna', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete user
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/users?id=${userToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setUserToDelete(null);
        fetchUsers();
        showToast('Akun pengguna berhasil dihapus!');
      } else {
        showToast(data.message || 'Gagal menghapus pengguna', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-bottom-5 text-white ${
          toastType === 'error' 
            ? 'bg-[#ba1a1a] border-red-800' 
            : 'bg-[#00113a] border-slate-700'
        }`}>
          {toastType === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
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
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-[#00113a] tracking-tight">
          Kelola Pengguna
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Kelola akun, peran, dan status pengguna dalam sistem.
        </p>
      </div>

      {/* Controls Bar matching wireframe: [ Search ] [ Status v ] [ Cari ] [ Muat Ulang ] [ Tambah Pengguna ] */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
            placeholder="Cari NIP, nama, email..."
            className="w-full px-3.5 py-2 text-xs bg-white border border-[#c5c6d2] rounded-xl focus:outline-hidden focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] text-slate-800 placeholder-slate-400 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveSearch('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown Selector */}
        <div className="relative inline-block text-left z-20 shrink-0" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center justify-between gap-2 px-3.5 py-2 bg-[#5b6b82] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#485568] transition-colors min-w-[110px]"
          >
            <span>
              {statusFilter === 'ALL'
                ? 'Status'
                : statusFilter === 'ACTIVE'
                ? 'Status: Aktif'
                : 'Status: Non-Aktif'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute left-0 mt-1 w-36 bg-white border border-[#c5c6d2] rounded-xl shadow-lg overflow-hidden py-1 z-30">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ALL');
                  setIsStatusDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Semua Status</span>
                {statusFilter === 'ALL' && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ACTIVE');
                  setIsStatusDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                  statusFilter === 'ACTIVE'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Aktif</span>
                {statusFilter === 'ACTIVE' && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('INACTIVE');
                  setIsStatusDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                  statusFilter === 'INACTIVE'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Non-Aktif</span>
                {statusFilter === 'INACTIVE' && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Button Cari */}
          <button
            type="button"
            onClick={() => handleSearchSubmit()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#99ccff] border border-[#6ea8e6] text-[#00113a] text-xs font-bold rounded-xl shadow-xs hover:bg-[#85beff] active:scale-95 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cari</span>
          </button>

          {/* Button Muat Ulang */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#99ccff] border border-[#6ea8e6] text-[#00113a] text-xs font-bold rounded-xl shadow-xs hover:bg-[#85beff] active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>

          {/* Button Tambah Pengguna (Single Plus Icon) */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#99ccff] border border-[#6ea8e6] text-[#00113a] text-xs font-bold rounded-xl shadow-xs hover:bg-[#85beff] active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-[#c5c6d2] shadow-xs">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={8} />
          </div>
        ) : (
          <div className="overflow-x-auto w-full rounded-t-2xl">
            <table className="w-full min-w-[740px] text-left border-collapse table-auto">
              {/* Header matching wireframe: .No. | Nomor Induk Pegawai | Nama | Email | Peran | Status | Aksi */}
              <thead>
                <tr className="border-b border-[#c5c6d2] bg-[#f1f3f7]">
                  <th className="py-3 px-3 text-xs font-bold text-[#00113a] text-center w-12 border-r border-[#c5c6d2] whitespace-nowrap">
                    .No.
                  </th>
                  <th className="py-3 px-4 text-xs font-bold text-[#00113a] text-center border-r border-[#c5c6d2] whitespace-nowrap">
                    Nomor Induk Pegawai
                  </th>
                  <th className="py-3 px-4 text-xs font-bold text-[#00113a] text-center border-r border-[#c5c6d2] whitespace-nowrap">
                    Nama
                  </th>
                  <th className="py-3 px-4 text-xs font-bold text-[#00113a] text-center border-r border-[#c5c6d2] whitespace-nowrap">
                    Email
                  </th>
                  <th className="py-3 px-3 text-xs font-bold text-[#00113a] text-center w-24 border-r border-[#c5c6d2] whitespace-nowrap">
                    Peran
                  </th>
                  <th className="py-3 px-3 text-xs font-bold text-[#00113a] text-center w-24 border-r border-[#c5c6d2] whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-3 text-xs font-bold text-[#00113a] text-center w-28 whitespace-nowrap">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-[#c5c6d2] text-xs">
                {paginatedUsers.map((u, index) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + index;
                  const isAdmin = u.role?.name === 'ADMINISTRATOR';
                  const isActive = u.status === 'ACTIVE';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      {/* .No. */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700 border-r border-[#c5c6d2] whitespace-nowrap">
                        {globalIndex + 1}
                      </td>

                      {/* Nomor Induk Pegawai */}
                      <td className="py-2.5 px-4 text-center font-mono font-medium text-slate-800 border-r border-[#c5c6d2] whitespace-nowrap">
                        {u.nip}
                      </td>

                      {/* Nama */}
                      <td className="py-2.5 px-4 font-bold text-slate-900 border-r border-[#c5c6d2] whitespace-nowrap">
                        {u.name}
                      </td>

                      {/* Email */}
                      <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px] border-r border-[#c5c6d2] whitespace-nowrap">
                        {u.email}
                      </td>

                      {/* Peran: Pill badge matching wireframe */}
                      <td className="py-2.5 px-3 text-center border-r border-[#c5c6d2] whitespace-nowrap">
                        <span className="inline-block px-3 py-1 rounded-sm bg-[#99ccff] text-[#003366] text-[11px] font-bold lowercase tracking-wider shadow-xs">
                          {isAdmin ? 'admin' : 'pegawai'}
                        </span>
                      </td>

                      {/* Status: Green/Red Pill badge matching wireframe */}
                      <td className="py-2.5 px-3 text-center border-r border-[#c5c6d2] whitespace-nowrap">
                        {isActive ? (
                          <span className="inline-block px-3 py-1 rounded-sm bg-[#48d065] text-white text-[11px] font-bold shadow-xs">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-sm bg-[#ff5b5b] text-white text-[11px] font-bold shadow-xs">
                            Non-Aktif
                          </span>
                        )}
                      </td>

                      {/* Aksi: Edit, Delete, Inline Toggle Switch */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 shrink-0">
                          {/* Edit Pencil Button */}
                          <button
                            type="button"
                            onClick={() => handleEditOpen(u)}
                            title="Edit Pengguna"
                            className="p-1 rounded-sm border border-[#ffb3b3] bg-[#fff5f5] text-[#e03e40] hover:bg-[#ffe6e6] transition-colors shrink-0"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Trash Button */}
                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            title="Hapus Pengguna"
                            className="p-1 rounded-sm border border-[#ffb3b3] bg-[#fff5f5] text-[#e03e40] hover:bg-[#ffe6e6] transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Inline Toggle Switch */}
                          <ToggleSwitch
                            checked={isActive}
                            onChange={() => handleToggleStatus(u)}
                            label={`Ubah status ${u.name}`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                      Tidak ditemukan data pengguna yang sesuai dengan kriteria filter atau pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls matching wireframe & log-aktivitas: [ Tampilkan 10 v data ] and [ < 1 2 3 4 5 ... > ] */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="px-6 py-3.5 bg-white border-t border-[#c5c6d2] rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
            {/* Left: Tampilkan [ 10 v ] data */}
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <span>Tampilkan</span>
              <div className="relative inline-block text-left" ref={perPageDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsPerPageDropdownOpen(!isPerPageDropdownOpen)}
                  className="flex items-center justify-between gap-1.5 px-2.5 py-1 bg-white border border-[#c5c6d2] rounded text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>{itemsPerPage}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isPerPageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPerPageDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-16 bg-white border border-[#c5c6d2] rounded shadow-lg overflow-hidden py-1 z-30">
                    {[10, 15, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setItemsPerPage(num);
                          setCurrentPage(1);
                          setIsPerPageDropdownOpen(false);
                        }}
                        className={`w-full text-center px-2 py-1 text-xs hover:bg-slate-100 transition-colors cursor-pointer ${
                          itemsPerPage === num ? 'font-bold text-[#00113a] bg-slate-50' : 'text-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span>data</span>
            </div>

            {/* Right: <  1  2  3  4  5  ...  > */}
            <div className="flex items-center gap-1.5 text-slate-700">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs font-bold text-slate-700 hover:text-[#00113a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Halaman Sebelumnya"
              >
                &lt;
              </button>

              {paginationRange.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${index}`} className="px-1 text-xs text-slate-400">
                      ...
                    </span>
                  );
                }
                const pageNum = Number(page);
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`min-w-[24px] h-6 px-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#00113a] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs font-bold text-slate-700 hover:text-[#00113a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Halaman Selanjutnya"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-[#c5c6d2] mt-8 text-center text-[11px] text-slate-500">
        © Hak Cipta 2026, Perpustakaan Nasional Republik Indonesia.
      </footer>

      {/* Create User Modal - Full Wireframe Implementation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCreateModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white border border-[#c5c6d2] shadow-2xl rounded-lg z-10 my-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto overflow-x-hidden">
            {/* Header: Title & Red Square Close Button [X] */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-200">
              <h2 className="text-xl font-black text-[#00113a] tracking-tight">
                Tambah Pengguna
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-6 h-6 bg-[#d32f2f] hover:bg-[#b71c1c] text-white flex items-center justify-center rounded-xs font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              {/* SECTION 1: DATA PRIBADI (MATCHING WIREFRAME) */}
              <div className="border border-[#c5c6d2] rounded-md p-5 sm:p-6 bg-white space-y-4 shadow-2xs">
                <h3 className="text-base sm:text-lg font-bold text-[#00113a]">
                  Data Pribadi
                </h3>

                {/* 1. Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Masukkan nama lengkap beserta gelar..."
                    required
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* 2. Nomor Induk Pegawai */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomor Induk Pegawai
                  </label>
                  <input
                    type="text"
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    placeholder="Contoh: 198501152010011001"
                    required
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* 3. Email Kedinasan */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email Kedinasan
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nama@perpusnas.go.id"
                    required
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* 4. Alamat Domisili */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Alamat Domisili
                  </label>
                  <textarea
                    rows={3}
                    value={newAlamat}
                    onChange={(e) => setNewAlamat(e.target.value)}
                    placeholder="Masukkan alamat domisili lengkap..."
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* 5. Nomor Seluler */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomor Seluler
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* 6. Tanggal Lahir */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors cursor-pointer"
                  />
                </div>

                {/* 7. Kata Sandi */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* Simpan Button inside Data Pribadi (matching wireframe) */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2 bg-[#8d99ae] hover:bg-[#6c757d] text-white text-xs font-bold rounded-md transition-colors shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isCreating ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>

              {/* SECTION 2: UNIT KERJA (MATCHING WIREFRAME) */}
              <div className="border border-[#c5c6d2] rounded-md p-5 sm:p-6 bg-white space-y-4 shadow-2xs">
                <h3 className="text-base sm:text-lg font-bold text-[#00113a]">
                  Unit Kerja
                </h3>

                {/* 1. Unit Kerja / Direktorat */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Unit Kerja / Direktorat
                  </label>
                  <input
                    type="text"
                    value={newUnitKerja}
                    onChange={(e) => setNewUnitKerja(e.target.value)}
                    placeholder="Contoh: Pusat Preservasi Manuskrip & Bahan Perpustakaan"
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* 2. Jabatan */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="Contoh: Pustakawan Ahli Muda"
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* 3. Golongan / Ruang */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Golongan / Ruang
                  </label>
                  <input
                    type="text"
                    value={newGolRuang}
                    onChange={(e) => setNewGolRuang(e.target.value)}
                    placeholder="Contoh: III/a - Penata Muda"
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors"
                  />
                </div>

                {/* 4. Uraian Tugas / Catatan Kedinasan */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Uraian Tugas / Catatan Kedinasan
                  </label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Deskripsi tugas atau penempatan kedinasan..."
                    className="w-full rounded-md border border-[#c5c6d2] bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Simpan Button inside Unit Kerja (matching wireframe) */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2 bg-[#8d99ae] hover:bg-[#6c757d] text-white text-xs font-bold rounded-md transition-colors shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isCreating ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>

              {/* SECTION 3: SATUAN KERJA, PERAN & ACTIONS */}
              <div className={`pt-2 transition-all duration-200 ${isCreateRoleDropdownOpen || isCreateSatuanKerjaDropdownOpen ? 'pb-28' : 'pb-1'}`}>
                {/* 1. Satuan Kerja Dropdown */}
                <div className="relative w-56 sm:w-64 mb-3.5" ref={createSatuanKerjaDropdownRef}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Satuan Kerja
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateSatuanKerjaDropdownOpen(!isCreateSatuanKerjaDropdownOpen);
                      setIsCreateRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#5b6b82] text-white text-xs font-bold rounded-xl hover:bg-[#485568] transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="truncate pr-2">{newSatuanKerja || 'Satuan Kerja'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isCreateSatuanKerjaDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCreateSatuanKerjaDropdownOpen && (
                    <div className="absolute left-0 w-56 sm:w-64 mt-1 bg-white border border-[#c5c6d2] rounded-xl shadow-lg overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {SATUAN_KERJA_OPTIONS.map((item) => {
                        const isSelected = newSatuanKerja === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setNewSatuanKerja(item);
                              setIsCreateSatuanKerjaDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-slate-100 text-[#00113a] font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Peran Dropdown (Di bawah Satuan Kerja) */}
                <div className="relative w-56 sm:w-64 mb-5" ref={createRoleDropdownRef}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Peran
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateRoleDropdownOpen(!isCreateRoleDropdownOpen);
                      setIsCreateSatuanKerjaDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#5b6b82] text-white text-xs font-bold rounded-xl hover:bg-[#485568] transition-colors cursor-pointer shadow-xs"
                  >
                    <span>{selectedRoleName}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isCreateRoleDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCreateRoleDropdownOpen && (
                    <div className="absolute left-0 w-56 sm:w-64 mt-1 bg-white border border-[#c5c6d2] rounded-xl shadow-lg overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {roles.map((r) => {
                        const isSelected = newRoleId === r.id;
                        const label = r.name === 'ADMINISTRATOR' ? 'Admin' : 'Pegawai';
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setNewRoleId(r.id);
                              setIsCreateRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-slate-100 text-[#00113a] font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Final Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2 text-xs font-bold rounded-xl border border-[#c5c6d2] text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2 text-xs font-bold rounded-xl bg-[#00113a] hover:bg-[#2a4386] text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    {isCreating ? 'Menyimpan...' : 'Simpan Pengguna'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title={`Ubah Pengguna: ${editingUser?.name || ''}`}
        maxWidth="lg"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Role Akses
              </label>
              <div className="relative">
                <select
                  value={editRoleId}
                  onChange={(e) => setEditRoleId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 pr-8 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-none cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name === 'ADMINISTRATOR' ? 'Admin' : 'Pegawai'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Akun
              </label>
              <div className="relative">
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 pr-8 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-none cursor-pointer"
                >
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Non-Aktif</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Satuan Kerja
              </label>
              <div className="relative">
                <select
                  value={editSatuanKerja}
                  onChange={(e) => setEditSatuanKerja(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 pr-8 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-none cursor-pointer"
                >
                  <option value="">-- Pilih Satuan Kerja --</option>
                  {SATUAN_KERJA_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan
              </label>
              <input
                type="text"
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Unit Kerja / Direktorat
            </label>
            <input
              type="text"
              value={editUnitKerja}
              onChange={(e) => setEditUnitKerja(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-hidden"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reset Kata Sandi (Opsional)
            </label>
            <input
              type="password"
              placeholder="Masukkan kata sandi baru jika ingin mereset"
              value={editResetPassword}
              onChange={(e) => setEditResetPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#007BFF] focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#007BFF] text-white hover:bg-[#0069d9] transition-all disabled:opacity-50"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Akun Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun ${userToDelete?.name} (NIP: ${userToDelete?.nip})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Pengguna"
        isLoading={isDeleting}
      />
    </div>
  );
}

// Inline Toggle Switch matching wireframe and Google Stitch
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

