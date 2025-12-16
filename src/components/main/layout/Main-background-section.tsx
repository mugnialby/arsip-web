"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MainBackgroundSection({ fadeInUp, y }: { fadeInUp: {}, y: { y } }) {
    3
    return (
        <section className="relative h-[90vh] w-full overflow-hidden">
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-travel.jpg"
                    alt="Travel Destination"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
            </motion.div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-6">
                <motion.h1
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    variants={fadeInUp}
                    className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                >
                    Perpustakaan Kejaksaan Negeri Kota Bogor
                </motion.h1>

                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    variants={fadeInUp}
                    className="text-lg md:text-xl mb-8 max-w-2xl"
                >
                    Kenali hukum jauhi hukuman.
                </motion.p>
                
                <Link href="/main/pencarian/buku">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        variants={fadeInUp}
                        className="bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-green-900 transition flex items-center justify-center space-x-2"
                    >
                        <Search size={14} />
                        <span>Cari Buku</span>
                    </motion.button>
                </Link>
            </div>
        </section>
    );
}