"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MainCardSection({ fadeInUp, y }: { fadeInUp: {}, y: { y } }) {
    return (
        <section className="bg-white py-20 px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    variants={fadeInUp}
                    className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12"
                >
                    Kegiatan
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                        className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-md transition"
                    >
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-green-700 rounded flex items-center justify-center text-white font-bold">
                                    ↑
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">Baca Buku</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Baca Buku
                            </p>
                        </div>
                        <Image
                            src="/images/travel-simple.jpg"
                            alt="Keep it simple"
                            width={800}
                            height={400}
                            className="object-cover w-full h-56"
                        />
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        variants={fadeInUp}
                        className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-md transition"
                    >
                        <Image
                            src="/images/travel-happy.jpg"
                            alt="Be happy"
                            width={800}
                            height={400}
                            className="object-cover w-full h-56"
                        />
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-green-700 rounded flex items-center justify-center text-white font-bold">
                                    ☀
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">Baca Buku</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Baca buku
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}