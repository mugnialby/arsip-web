"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardSidebarComponent({ showSidebar, setShowSidebar }) {
    const [showMaster, setShowMaster] = useState(false);
    const [showArsip, setShowArsip] = useState(false); // NEW
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) =>
        pathname === path ? "bg-gray-200 font-semibold" : "hover:bg-gray-100";

    return (
        <>
            {/* Sidebar (desktop) */}
            <aside className="hidden md:flex w-64 bg-white shadow flex-col">
                <nav className="flex-1 p-4 space-y-2">

                    {/* ================= ARSIP DROPDOWN ================= */}
                    <button
                        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 font-medium hover:bg-gray-100"
                        onClick={() => setShowArsip(!showArsip)}
                    >
                        <span>Arsip</span>
                        <ChevronDown
                            size={18}
                            className={`transition-transform ${showArsip ? "rotate-180" : ""}`}
                        />
                    </button>

                    <AnimatePresence initial={false}>
                        {showArsip && (
                            <motion.div
                                key="arsip-menu"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="pl-8 pr-4 py-2 bg-gray-50 text-gray-900">

                                    <button
                                        onClick={() => router.push("/admin/dashboard/arsip/data")}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${isActive(
                                            "/admin/dashboard/arsip/data"
                                        )}`}
                                    >
                                        Data Arsip
                                    </button>

                                    <button
                                        onClick={() => router.push("/admin/dashboard/arsip/kategori")}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${isActive(
                                            "/admin/dashboard/arsip/kategori"
                                        )}`}
                                    >
                                        Kategori Arsip
                                    </button>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ================= MASTER DROPDOWN ================= */}
                    <button
                        className="w-full flex items-center justify-between px-4 py-2 text-gray-700 font-medium hover:bg-gray-100"
                        onClick={() => setShowMaster(!showMaster)}
                    >
                        <span>Master</span>
                        <ChevronDown
                            size={18}
                            className={`transition-transform ${showMaster ? "rotate-180" : ""}`}
                        />
                    </button>

                    <AnimatePresence initial={false}>
                        {showMaster && (
                            <motion.div
                                key="master-menu"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="pl-8 pr-4 py-2 bg-gray-50 text-gray-900">

                                    <button
                                        onClick={() => router.push("/admin/dashboard/master/pengguna")}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${isActive(
                                            "/admin/dashboard/master/pengguna"
                                        )}`}
                                    >
                                        Pengguna
                                    </button>

                                    <button
                                        onClick={() => router.push("/admin/dashboard/master/role")}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${isActive(
                                            "/admin/dashboard/master/role"
                                        )}`}
                                    >
                                        Role
                                    </button>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </aside>
        </>
    );
}
