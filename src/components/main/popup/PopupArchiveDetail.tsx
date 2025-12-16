"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupArchiveDetail {
    archiveHdr: {
        archiveId: number;
        archiveName: string;
        archiveDate: string;
        archiveCharacteristicName: string;
        archiveTypeName: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function PopupArchiveDetail({
    archiveHdr,
    isOpen,
    onClose,
}: PopupArchiveDetail) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const ARCHIVE_URL = "http://192.168.50.52:8080/api/archives/";

    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);
        setError(null);

        fetch(`${ARCHIVE_URL}${archiveHdr.archiveId}/pdf`, {
            method: "GET",
            headers: { Accept: "application/pdf" }
        })
            .then(res => res.arrayBuffer())
            .then(buffer => {
                const blob = new Blob([buffer], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setLoading(false);
            })
            .catch(() => {
                setError("Gagal memuat PDF");
                setLoading(false);
            });

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [archiveHdr.archiveId, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white w-full h-full rounded-none shadow-xl overflow-y-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Top Bar */}
                        <div className="sticky top-0 bg-white z-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
                            <h2 className="text-xl font-semibold">Detil Arsip</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">

                            {/* Header Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="font-medium text-gray-600">Nama Arsip:</div>
                                    <div className="text-gray-800">{archiveHdr.archiveName}</div>

                                    <div className="font-medium text-gray-600">Tanggal Arsip:</div>
                                    <div className="text-gray-800">{archiveHdr.archiveDate}</div>

                                    <div className="font-medium text-gray-600">Sifat:</div>
                                    <div className="text-gray-800">{archiveHdr.archiveCharacteristicName}</div>

                                    <div className="font-medium text-gray-600">Jenis:</div>
                                    <div className="text-gray-800">{archiveHdr.archiveTypeName}</div>
                                </div>
                            </div>

                            {/* PDF Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h3 className="text-lg font-medium mb-3">Dokumen</h3>

                                {loading && (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full"></div>
                                    </div>
                                )}

                                {error && (
                                    <div className="text-center text-red-600 py-6">{error}</div>
                                )}

                                {!loading && pdfUrl && (
                                    <embed
                                        src={pdfUrl}
                                        type="application/pdf"
                                        className="w-full h-[80vh] rounded-lg border"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
