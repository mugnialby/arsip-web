"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MainSingleCardSection({ fadeInUp, y }: { fadeInUp: {}, y: { y } }) {
    return (
        <section className="bg-gray-50 py-20 px-6 md:px-16">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    variants={fadeInUp}
                >
                    <Image
                        src="/images/travel-trip.jpg"
                        alt="Trip details"
                        width={600}
                        height={400}
                        className="rounded-xl object-cover w-full h-full shadow"
                    />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    variants={fadeInUp}
                >
                    <h3 className="text-3xl font-bold mb-6 text-gray-800">
                        Fasilitas
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                        <li>• Peminjaman</li>
                        <li>• Ruangan</li>
                        <li>• AC</li>
                        <li>• Pencarian Daring</li>
                    </ul>
                    
                    {/* <Link href="/main/pencarian/buku">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-green-900 transition"
                        >
                            Pinjam Sekarang
                        </motion.button>
                    </Link> */}
                </motion.div>
            </div>
        </section>
    )
};