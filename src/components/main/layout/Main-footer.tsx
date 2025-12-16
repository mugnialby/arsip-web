"use client";

import { motion } from "framer-motion";

export default function MainFooter({ fadeInUp }: { fadeInUp: {} }) {
    return (
        <footer className="bg-green-700 text-white py-10 px-6 md:px-16">
            <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
                <motion.div
                    className="md:col-span-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    variants={fadeInUp}
                >
                    <h4 className="font-bold text-lg mb-2">Alamat</h4>
                    <p>
                        Jalan Insinyur Haji Juanda No.6
                        <br />
                        Pabaton, Bogor Tengah
                        <br />
                        Kota Bogor, Jawa Barat 16121
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    variants={fadeInUp}
                >
                    <h4 className="font-bold text-lg mb-2">Nomor Telpon</h4>
                    <p>(0251) 8326622</p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    variants={fadeInUp}
                >
                    <h4 className="font-bold text-lg mb-2">E-mail</h4>
                    <p>kn.bogor@kejaksaan.go.id</p>
                </motion.div>
            </div>
        </footer>
    );
}