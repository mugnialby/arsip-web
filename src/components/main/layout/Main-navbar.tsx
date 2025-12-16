"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MainNavbar({ isScrolled }: { isScrolled: boolean }) {
    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                    ? "backdrop-blur-md bg-white/70 shadow-md"
                    : "bg-green-100"
                }`}
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-2"
                >
                    <Link href="/main" className="flex space-x-1">
                        <Image
                            src="/images/logo.png"
                            alt="Kejari Logo"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                        <span className="font-bold text-lg text-gray-800 hover:text-green-700 mt-1">
                            Kejaksaan Negeri Kota Bogor
                        </span>

                    </Link>
                </motion.div>

                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hidden md:flex items-center gap-8 text-gray-800 font-medium"
                >
                    <li className="hover:text-green-700 cursor-pointer">
                        <Link href="/main">Beranda</Link>
                    </li>

                    <li className="relative group hover:text-green-700 cursor-pointer">
                        <button className="flex items-center gap-1 hover:text-green-700 transition">
                            Pencarian ▾
                        </button>

                        {/* Dropdown Menu */}
                        <ul className="absolute left-0 mt-2 w-40 bg-white/70 border rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <li>
                                <Link
                                    href="/main/pencarian/buku"
                                    className="block px-4 py-2 hover:bg-green-100 hover:text-green-900 transition"
                                >
                                    Buku
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* <li className="hover:text-green-700 cursor-pointer">
                        <Link href="/main/tentang">Tentang</Link>
                    </li> */}

                    <li className="hover:text-green-700 text-end">
                        <Link href="/main/login">Masuk</Link>
                    </li>
                </motion.ul>
            </div>
        </motion.nav>
    );
}
