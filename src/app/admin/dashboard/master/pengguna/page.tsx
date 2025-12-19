"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

export default function MasterPengguna() {
    const [sessionData, setSessionData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

    const [roles, setRoles] = useState<any[]>([]);
    const [roleOptions, setRoleOptions] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState<any>(null);

    const USERS_API_URL = "http://192.168.50.52:8080/api/master/users/";
    const DEPARTMENTS_API_URL = "http://192.168.50.52:8080/api/master/departments/";
    const ROLES_API_URL = "http://192.168.50.52:8080/api/master/roles/";

    const getAllUsers = async () => {
        try {
            const response = await axios.get(USERS_API_URL);
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const getAllDepartment = async () => {
        try {
            const response = await axios.get(DEPARTMENTS_API_URL);
            setDepartments(response.data.data);
        } catch (error) {
            console.error("Error fetching Department:", error);
        }
    };

    const getAllRoleByDepartmentID = async (departmentId: any) => {
        if (!departmentId) return;

        try {
            const response = await axios.get(
                `${ROLES_API_URL}findByQuery/department/${departmentId}`
            );

            const roles = response.data;

            if (!Array.isArray(roles) || roles.length === 0) {
                setRoleOptions([]);
                setRoles([]);
                return;
            }

            const options = roles.map((r) => ({
                value: r.id,
                label: r.roleName,
            }));

            setRoles(roles);
            setRoleOptions(options);

            if (editData) {
                const matched = options.find(
                    (opt) => opt.value === editData.role.id
                );

                if (matched) {
                    setSelectedRole(matched);
                }
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    const showToast = (icon: "success" | "error", title: string) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon,
            title,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
                popup: "rounded-lg shadow-md",
            },
        });
    };

    const handleAdd = () => {
        setShowPopup(true);
        setIsEditing(false);
        setEditData(null);
        setSelectedDepartment(null);
        setRoleOptions([]);
        setSelectedRole(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const requestData = {
            id: editData?.id ? editData.id : 0,
            userId: formData.get("userId"),
            passwordHash: formData.get("passwordHash"),
            fullName: formData.get("fullName"),
            departmentId: selectedDepartment?.value
                ? Number(selectedDepartment.value)
                : null,
            roleId: selectedRole?.value
                ? Number(selectedRole.value)
                : null,
            submittedBy: sessionData.userId
        };

        try {
            if (isEditing && editData) {
                await axios.put(USERS_API_URL, requestData, {
                    headers: { "Content-Type": "application/json" },
                });
                showToast("success", "Data berhasil diperbarui");
            } else {
                await axios.post(USERS_API_URL, requestData, {
                    headers: { "Content-Type": "application/json" },
                });
                showToast("success", "Data berhasil ditambahkan");
            }

            await getAllUsers();
            setShowPopup(false);
            setIsEditing(false);
            setEditData(null);
            form.reset();
        } catch (error) {
            console.error("Error saving user:", error);
            showToast("error", "Gagal menyimpan data");
        }
    };

    const handleEdit = (data: any) => {
        setEditData(data);

        const dept = {
            value: data.department.id,
            label: data.department.departmentName,
        };

        setSelectedDepartment(dept);
        setIsEditing(true);
        setShowPopup(true);
    };

    const handleDelete = async (data: any) => {
        Swal.fire({
            title: `Hapus data?`,
            text: "Tindakan ini tidak dapat dibatalkan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            const requestData = {
                id: data.id,
                submittedBy: sessionData.userId
            };

            if (result.isConfirmed) {
                try {
                    await axios.patch(USERS_API_URL, requestData);
                    showToast("success", "Data telah dihapus");
                    await getAllUsers();
                } catch (error) {
                    console.error("Error deleting user:", error);
                    showToast("error", "Gagal menghapus data");
                }
            }
        });
    };

    useEffect(() => {
        const storedSessionData = localStorage.getItem("sessionData");
        if (storedSessionData) {
            setSessionData(JSON.parse(storedSessionData));
        }

        getAllUsers();
        getAllDepartment();

        if (selectedDepartment?.value) {
            getAllRoleByDepartmentID(selectedDepartment.value);
        }
    }, [selectedDepartment]);

    const departmentOptions = departments.map((c) => ({
        value: c.id,
        label: c.departmentName,
    }));

    const filteredUsers = users.filter((user) =>
        [user.userName]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + recordsPerPage
    );

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="flex flex-col h-full space-y-3">
            <div className="bg-white shadow rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Cari Data"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    />
                </div>
                <button
                    onClick={() => handleAdd()}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
                >
                    <Plus size={18} /> Tambah Data
                </button>
            </div>

            <div className="flex-1 bg-white shadow rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm min-w-[600px]">
                    <thead className="bg-green-100 text-gray-900">
                        <tr>
                            <th className="px-3 py-2 text-left w-0">No.</th>
                            <th className="px-3 py-2 text-left">Nama Pengguna</th>
                            <th className="px-3 py-2 text-left">Nama Lengkap</th>
                            <th className="px-3 py-2 text-left">Bidang</th>
                            <th className="px-3 py-2 text-left">Role</th>
                            <th className="px-3 py-2 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        <AnimatePresence>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user.id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="px-3 py-2">{idx + 1}</td>
                                        <td className="px-3 py-2">{user.userId}</td>
                                        <td className="px-3 py-2">{user.fullName}</td>
                                        <td className="px-3 py-2">{user.department.departmentName}</td>
                                        <td className="px-3 py-2">{user.role.roleName}</td>
                                        <td className="px-3 py-2 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs md:text-sm"
                                            >
                                                <Pencil size={14} /> Ubah
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs md:text-sm"
                                            >
                                                <Trash size={14} /> Hapus
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-6 text-gray-500 italic bg-gray-50"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>

                <div className="flex flex-wrap justify-between items-center mt-4 text-sm gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700">Tampilkan:</span>
                        <select
                            value={recordsPerPage}
                            onChange={(e) => {
                                setRecordsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border rounded-lg px-2 py-1 text-gray-700"
                        >
                            {[10, 20, 50, 100].map((val) => (
                                <option key={val} value={val}>
                                    {val}
                                </option>
                            ))}
                        </select>
                        <span className="text-gray-700">per halaman</span>
                    </div>

                    <div className="flex gap-1">
                        <span className="text-gray-600 px-3 py-1">
                            Menampilkan {startIndex + 1} -{" "}
                            {Math.min(startIndex + recordsPerPage, filteredUsers.length)} dari{" "}
                            {filteredUsers.length} data
                        </span>

                        <button
                            disabled={currentPage === 1}
                            onClick={() => changePage(currentPage - 1)}
                            className={`px-3 py-1 rounded-lg border ${currentPage === 1
                                ? "bg-white text-gray-400"
                                : "bg-blue-500 hover:bg-blue-700 text-white"
                                }`}
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => changePage(i + 1)}
                                className={`px-3 py-1 rounded-lg border ${currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-400"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => changePage(currentPage + 1)}
                            className={`px-3 py-1 rounded-lg border ${currentPage === totalPages
                                ? "bg-white text-gray-400"
                                : "bg-blue-500 hover:bg-blue-700 text-white"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6"
                        >
                            <h2 className="text-lg font-bold mb-4 text-black">
                                {isEditing ? "Ubah Data" : "Tambah Data"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-black">
                                        Nama Pengguna
                                    </label>
                                    <input
                                        name="userId"
                                        defaultValue={editData?.userId || ""}
                                        required
                                        className="w-full border px-3 py-2 rounded-lg text-black"
                                    />
                                </div>
                                {!editData && (
                                    <div>
                                        <label className="block text-sm font-medium text-black">
                                            Kata Sandi
                                        </label>
                                        <input
                                            name="passwordHash"
                                            defaultValue={editData?.passwordHash || ""}
                                            type="password"
                                            required
                                            className="w-full border px-3 py-2 rounded-lg text-black"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-black">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        name="fullName"
                                        defaultValue={editData?.fullName || ""}
                                        required
                                        className="w-full border px-3 py-2 rounded-lg text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Bidang</label>
                                    <Select
                                        options={departmentOptions}
                                        value={selectedDepartment}
                                        onChange={setSelectedDepartment}
                                        placeholder="---Pilih---"
                                        className="text-black"
                                        isSearchable
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black">Role</label>
                                    <Select
                                        options={roleOptions}
                                        value={selectedRole}
                                        onChange={setSelectedRole}
                                        placeholder="---Pilih---"
                                        className="text-black"
                                        isSearchable
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPopup(false);
                                            setIsEditing(false);
                                            setEditData(null);
                                        }}
                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-800 text-white"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
