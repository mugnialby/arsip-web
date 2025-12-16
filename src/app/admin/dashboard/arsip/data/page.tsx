"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, BookOpen, Pencil, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import ArchiveDatePicker from "@/components/layout/Datepicker";
import { UploadDropzone } from "@/components/layout/UploadDropzone";
import PopupArchiveDetail from "@/components/main/popup/PopupArchiveDetail";

export default function ArsipData() {
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const [editData, setEditData] = useState<any>(null);

    const [archives, setArchives] = useState<any[]>([]);
    const [selectedArchive, setSelectedArchive] = useState<any>(null);
    const [archiveCharacteristics, setArchiveCharacteristics] = useState<any[]>([]);
    const [archiveTypes, setArchiveTypes] = useState<any[]>([]);
    const [listArchiveAttachment, setListArchiveAttachment] = useState<any[]>([]);

    const [selectedArchiveType, setSelectedArchiveType] = useState<any>(null);
    const [selectedArchiveCharacteristic, setSelectedArchiveCharacteristic] = useState<any>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    const [archiveDate, setArchiveDate] = useState<Date | null>(null);

    const ARCHIVE_URL = "http://192.168.50.52:8080/api/archives/";
    const ARCHIVE_CHARACTERISTIC_URL = "http://192.168.50.52:8080/api/master/archiveCharacteristics/";
    const ARCHIVE_TYPE_URL = "http://192.168.50.52:8080/api/master/archiveTypes/";

    /* CONSTRUCTOR FUNCTIONS */
    useEffect(() => {
        getAllArchives();
        getAllArchiveCharacteristics();
        getAllArchiveTypes();
    }, []);

    const getAllArchives = async () => {
        try {
            const response = await axios.get(ARCHIVE_URL);
            setArchives(response.data.data);
        } catch (error) {
            console.error("Error fetching archives:", error);
        }
    };

    const getAllArchiveCharacteristics = async () => {
        try {
            const response = await axios.get(ARCHIVE_CHARACTERISTIC_URL);
            setArchiveCharacteristics(response.data.data);
        } catch (error) {
            console.error("Error fetching archive characteristics:", error);
        }
    };

    const getAllArchiveTypes = async () => {
        try {
            const response = await axios.get(ARCHIVE_TYPE_URL);
            setArchiveTypes(response.data.data);
        } catch (error) {
            console.error("Error fetching archive types:", error);
        }
    };

    const getArchiveById = async (archiveId: number) => {
        try {
            const response = await axios.get(`${ARCHIVE_URL}${archiveId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching archive:", error);
            return null;
        }
    };

    const showToast = (icon: "success" | "error", title: string) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon,
            title,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: { popup: "rounded-lg shadow-md" },
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf"
        ];

        for (const file of Array.from(files)) {
            if (!validTypes.includes(file.type)) {
                showToast("error", "Hanya JPG, PNG atau PDF yang diperbolehkan");
                continue;
            }

            let base64String = "";

            // If image → compress
            if (file.type.startsWith("image/")) {
                base64String = await compressImage(file);
            } else {
                // If PDF → no compression
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onloadend = () => {
                        base64String = reader.result as string;
                        resolve(null);
                    };
                    reader.readAsDataURL(file);
                });
            }

            // Push file to listArchiveAttachment
            setListArchiveAttachment((prev) => [
                ...prev,
                {
                    id: 0,
                    fileBase64: base64String,
                    isNew: true,
                    isDelete: false,
                    fileName: file.name,
                    fileType: file.type,
                }
            ]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const submitData = {
            archiveName: formData.get("archiveName"),
            archiveDate: archiveDate ? formatDateForApi(archiveDate) : null,
            archiveCharacteristicId: selectedArchiveCharacteristic?.value
                ? Number(selectedArchiveCharacteristic.value)
                : null,
            archiveTypeId: selectedArchiveType?.value
                ? Number(selectedArchiveType.value)
                : null,
            listArchiveAttachments: listArchiveAttachment,
        };

        try {
            if (isEditing && editData) {
                await axios.put(`${ARCHIVE_URL}${editData.id}`, submitData, {
                    headers: { "Content-Type": "application/json" },
                });
                showToast("success", "Data berhasil diperbarui");
            } else {
                await axios.post(ARCHIVE_URL, submitData, {
                    headers: { "Content-Type": "application/json" },
                });
                showToast("success", "Data berhasil ditambahkan");
            }

            await getAllArchives();
            setShowPopup(false);
            setIsEditing(false);
            setEditData(null);
            setSelectedArchiveType(null);
            setSelectedArchiveCharacteristic(null);
            setListArchiveAttachment([]);
            form.reset();
        } catch (error) {
            console.error("Error saving archive:", error);
            showToast("error", "Gagal menyimpan data");
        }
    };

    const handleEdit = async (archiveId: number) => {
        const archive = await getArchiveById(archiveId);
        if (!archive) return;

        setIsEditing(true);
        setEditData(archive);
        setArchiveDate(new Date(archive.archiveDate));

        setSelectedArchiveCharacteristic({
            value: archive.archiveCharacteristicId,
            label: archive.archiveCharacteristic?.archiveCharacteristicName,
        });

        setSelectedArchiveType({
            value: archive.archiveTypeId,
            label: archive.archiveType?.archiveTypeName,
        });

        setListArchiveAttachment(
            archive.archiveAttachments.map((a) => ({
                id: a.id,
                fileName: a.fileName,
                fileBase64: a.fileBase64,
                isNew: false,
                isDelete: false,
            }))
        );

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
            if (result.isConfirmed) {
                try {
                    await axios.patch(`${ARCHIVE_URL}${data.id}`, { status: "N" });
                    showToast("success", "Data telah dihapus");
                    await getAllArchives();
                } catch (error) {
                    console.error("Error deleting archive:", error);
                    showToast("error", "Tidak dapat menghapus data");
                }
            }
        });
    };

    const filteredData = archives.filter((archive) =>
        [archive.archiveName]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const currentDataList = filteredData.slice(startIndex, startIndex + recordsPerPage);

    const archiveCharacteristicOptions = archiveCharacteristics.map((r) => ({
        value: r.id,
        label: r.archiveCharacteristicName,
    }));

    const archiveTypeOptions = archiveTypes.map((c) => ({
        value: c.id,
        label: c.archiveTypeName,
    }));

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleView = (data) => {
        setSelectedArchive({
            archiveId: data.id,
            archiveName: data.archiveName,
            archiveDate: dateFormat(data.archiveDate),
            archiveCharacteristicName: data.archiveCharacteristic.archiveCharacteristicName,
            archiveTypeName: data.archiveType.archiveTypeName,
        });
        setModalOpen(true);
    };

    const formatImageSrc = (base64: string) => {
        if (!base64) return "";

        if (base64.startsWith("data:image") || base64.startsWith("data:application")) {
            return base64;
        }

        return `data:image/jpeg;base64,${base64}`;
    };

    const handleCancel = () => {
        setShowPopup(false);
        setIsEditing(false);
        setEditData(null);
        setListArchiveAttachment([]);
        setSelectedArchiveCharacteristic(null);
        setSelectedArchiveType(null);
    };

    const handleAdd = () => {
        setShowPopup(true);
        setIsEditing(false);
        setEditData(null);
        setArchiveDate(null);
        setSelectedArchiveType(null);
        setListArchiveAttachment([]);
        setSelectedArchiveCharacteristic(null);
    }

    const compressImage = (file: File, quality = 0.7): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d")!;

                    // Resize: max width 1200px to keep file small
                    const maxWidth = 1200;
                    const scaleSize = maxWidth / img.width;

                    canvas.width = img.width > maxWidth ? maxWidth : img.width;
                    canvas.height = img.width > maxWidth ? img.height * scaleSize : img.height;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // jpeg output, set quality 0.7
                    const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
                    resolve(compressedDataUrl);
                };
            };
        });
    };

    const dateFormat = (date: string) => {
        if (!date) return "";

        // Ensure only the date portion remains (YYYY-MM-DD)
        const isoDate = date.substring(0, 10);

        const [year, month, day] = isoDate.split("-");
        if (!year || !month || !day) return "";

        return `${day}-${month}-${year}`;
    };

    const formatDateForApi = (date: Date | null) => {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    return (
        <div className="flex flex-col h-full space-y-3">
            {/* 🔍 Search and Add */}
            <div className="bg-white shadow rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Cari Data"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow px-3 py-2 border rounded-lg outline-none text-gray-900"
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
                            <th className="px-3 py-2 text-left">No.</th>
                            <th className="px-3 py-2 text-left">Tanggal</th>
                            <th className="px-3 py-2 text-left">Judul</th>
                            <th className="px-3 py-2 text-left">Sifat</th>
                            <th className="px-3 py-2 text-left">Jenis</th>
                            <th className="px-3 py-2 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        <AnimatePresence>
                            {currentDataList.length > 0 ? (
                                currentDataList.map((data, idx) => (
                                    <motion.tr
                                        key={data.id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="px-3 py-2">{idx + 1}</td>
                                        <td className="px-3 py-2">{dateFormat(data.archiveDate)}</td>
                                        <td className="px-3 py-2">{data.archiveName}</td>
                                        <td className="px-3 py-2">{data.archiveCharacteristic.archiveCharacteristicName}</td>
                                        <td className="px-3 py-2">{data.archiveType.archiveTypeName}</td>
                                        <td className="px-3 py-2 flex gap-2">
                                            <button
                                                onClick={() => handleView(data)}
                                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs md:text-sm"
                                            >
                                                <BookOpen size={14} /> Detil
                                            </button>
                                            <button
                                                onClick={() => handleEdit(data.id)}
                                                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs md:text-sm"
                                            >
                                                <Pencil size={14} /> Ubah
                                            </button>
                                            <button
                                                onClick={() => handleDelete(data)}
                                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs md:text-sm"
                                            >
                                                <Trash size={14} /> Hapus
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500 italic bg-gray-50">
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

                    <div className="flex gap-1 items-center">
                        <span className="text-gray-600 px-3 py-1">
                            Menampilkan {startIndex + 1} - {Math.min(startIndex + recordsPerPage, filteredData.length)} dari {filteredData.length} data
                        </span>

                        <button
                            disabled={currentPage === 1}
                            onClick={() => changePage(currentPage - 1)}
                            className={`px-3 py-1 rounded-lg border ${currentPage === 1 ? "bg-white text-gray-400" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => changePage(i + 1)}
                                className={`px-3 py-1 rounded-lg border ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-400"}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => changePage(currentPage + 1)}
                            className={`px-3 py-1 rounded-lg border ${currentPage === totalPages ? "bg-white text-gray-400" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {selectedArchive && (
                <PopupArchiveDetail
                    archiveHdr={selectedArchive}
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
            )}

            {/* ➕ Add/Edit Modal */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white rounded-xl shadow-xl w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto p-8"
                        >
                            <h2 className="text-xl font-bold mb-6 text-black">
                                {isEditing ? "Ubah Data" : "Tambah Data"}
                            </h2>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {/* ================= LEFT SIDE (DATA ENTRY) ================= */}
                                <div className="md:col-span-2 grid grid-cols-2 gap-4 w-full">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-black">Judul</label>
                                        <input
                                            name="archiveName"
                                            defaultValue={editData?.archiveName || ""}
                                            required
                                            className="w-full border px-3 py-2 rounded-lg text-black"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-2 gap-4 w-full">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-black">Tanggal Arsip</label>
                                        <ArchiveDatePicker
                                            dateSelected={editData?.archiveDate}   // ISO string "2025-12-11"
                                            onChangeDate={(iso: Date) => setArchiveDate(iso)}  // ISO "YYYY-MM-DD"
                                        />

                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-2 gap-4 w-full">
                                    <div>
                                        <label className="block text-sm font-medium text-black">Sifat</label>
                                        <Select
                                            options={archiveCharacteristicOptions}
                                            value={selectedArchiveCharacteristic}
                                            onChange={setSelectedArchiveCharacteristic}
                                            placeholder="--- PILIH ---"
                                            className="text-black"
                                            isSearchable
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black">Jenis</label>
                                        <Select
                                            options={archiveTypeOptions}
                                            value={selectedArchiveType}
                                            onChange={setSelectedArchiveType}
                                            placeholder="--- PILIH ---"
                                            className="text-black"
                                            isSearchable
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-2 gap-4 w-full">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-black">Dokumentasi Arsip</label>
                                        <UploadDropzone handleFileUpload={handleFileUpload} />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                        {listArchiveAttachment
                                            .filter((f) => !f.isDelete)
                                            .map((file, idx) => {
                                                const ext = file.fileName?.split(".").pop()?.toLowerCase();

                                                const isPDF = ext === "pdf";
                                                const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="relative group rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
                                                    >
                                                        {/* PREVIEW BLOCK */}
                                                        {isPDF ? (
                                                            /* ---------- PDF PREVIEW ---------- */
                                                            <div className="flex flex-col items-center justify-center h-32 bg-gray-50">
                                                                <span className="text-red-600 font-semibold text-sm">PDF</span>

                                                                <span className="text-xs text-gray-600 mt-1 px-2 text-center">
                                                                    {file.fileName}
                                                                </span>

                                                                <a
                                                                    href={file.fileBase64}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 text-xs underline mt-2"
                                                                >
                                                                    View
                                                                </a>
                                                            </div>
                                                        ) : isImage ? (
                                                            /* ---------- IMAGE PREVIEW ---------- */
                                                            <img
                                                                src={file.fileBase64}
                                                                className="w-full h-32 object-cover transition group-hover:brightness-90"
                                                            />
                                                        ) : (
                                                            /* ---------- UNKNOWN FILE PREVIEW ---------- */
                                                            <div className="flex flex-col items-center justify-center h-32 bg-gray-100">
                                                                <span className="text-gray-700 text-sm font-semibold">FILE</span>
                                                                <span className="text-xs text-gray-600 mt-1">{file.fileName}</span>
                                                                <a
                                                                    href={file.fileBase64}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 text-xs underline mt-2"
                                                                >
                                                                    Download
                                                                </a>
                                                            </div>
                                                        )}

                                                        {/* DELETE BUTTON */}
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                                                            onClick={() => {
                                                                setListArchiveAttachment((prev) => {
                                                                    const updated = [...prev];
                                                                    const t = updated[idx];

                                                                    return t.isNew
                                                                        ? updated.filter((_, i) => i !== idx)
                                                                        : (updated[idx] = { ...t, isDelete: true }) && updated;
                                                                });
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>


                                <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
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
