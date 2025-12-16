// components/dashboard/BookModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface BookModalProps {
    isOpen: boolean;
    mode: "add" | "edit" | "detail";
    onClose: () => void;
    onSave: (book: any) => void;
    bookData?: any; // optional, filled for edit/detail
}

export default function BookModal({
    isOpen,
    mode,
    onClose,
    onSave,
    bookData,
}: BookModalProps) {

    {/* Add Book Popup */ }
    <AnimatePresence>
        {isOpen && (
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
                    <h2 className="text-lg font-bold mb-4">Tambah Buku</h2>
                    <form onSubmit={onSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Nama Buku</label>
                            <input
                                name="nama"
                                required
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Nama Penulis</label>
                            <input
                                name="penulis"
                                required
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Tahun Terbit</label>
                            <input
                                type="number"
                                name="tahun"
                                required
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Lokasi</label>
                            <input
                                name="lokasi"
                                required
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Foto Buku</label>
                            <input
                                type="file"
                                name="foto"
                                multiple
                                accept="image/*"
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddPopup(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
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
}
