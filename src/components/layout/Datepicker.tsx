"use client";

import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";

export default function ArchiveDatePicker({ dateSelected, onChangeDate }) {
    const [archiveDate, setArchiveDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const formatDisplay = (date: Date | null) => {
        if (!date) return "Pilih tanggal";

        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();

        return `${dd}-${mm}-${yyyy}`;
    };

    useEffect(() => {
        if (dateSelected) {
            setArchiveDate(new Date(dateSelected));
        }
    }, [dateSelected]);

    const handleDateChange = (date: Date | null) => {
        setArchiveDate(date);
        setIsOpen(false);

        if (onChangeDate && date) {
            // Return ISO format to backend
            const iso = date;
            onChangeDate(iso);
        }
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {/* iOS style input */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 flex items-center justify-between shadow-sm active:scale-[0.98] transition"
            >
                <span className="text-black text-base">
                    {formatDisplay(archiveDate)}
                </span>

                <Calendar className="text-gray-500" size={20} />
            </button>

            {/* Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute z-50 mt-2 left-0 w-full"
                    >
                        <DatePicker
                            selected={archiveDate}
                            onChange={handleDateChange}
                            inline
                            dateFormat="dd-MM-yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
