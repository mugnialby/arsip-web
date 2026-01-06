"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import axios from "axios";
import { apiUrl } from "../lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    
    useEffect(() => {
        document.getElementById("userid")?.focus();
    }, []);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
    
        if (!userId || !password) {
            setErrorMsg("Mohon isi data terlebih dahulu.");
            triggerShake();
            return;
        }
    
        setLoading(true);
    
        const loginRequest = {
            userId: userId.trim().toUpperCase(),
            password: password.trim()
        };
    
        try {
            const response = await axios.post(apiUrl("auth/authenticate"), loginRequest, {
                headers: { "Content-Type": "application/json" },
            });
    
            if (response.status !== 200) throw new Error("Login gagal");
    
            localStorage.setItem("sessionData", JSON.stringify(response.data.data));
    
            setErrorMsg("");

            router.push("/admin/dashboard");
        } catch (err: any) {
            setErrorMsg(err.message || "Login gagal");
        } finally {
            setLoading(false);
        }
    };
    
    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
    };

    return (
        <div
            className="flex items-center justify-center w-full h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg-login.jpg')" }}
        >

            <motion.div
                className="w-[90%] md:w-[420px] bg-white border rounded-2xl p-8 shadow-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >

                <h1 className="text-gray-700 text-3xl font-semibold mb-6 text-center tracking-tight">
                    Arsip Kejari Kota Bogor
                </h1>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <motion.div
                        animate={shake ? { x: [-10, 10, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        <User className="absolute left-3 top-3 text-gray-700" size={18} />
                        <input
                            id="userid"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-white/5 text-gray-700 placeholder-gray-700 border border-gray-700 rounded-xl px-10 py-3 focus:outline-none"
                            placeholder="User ID"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.querySelector<HTMLInputElement>('input[type="password"]')?.focus();
                                }
                            }}                            
                        />
                    </motion.div>

                    <motion.div
                        animate={shake ? { x: [-10, 10, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        <Lock className="absolute left-3 top-3 text-gray-700" size={18} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 text-gray-700 placeholder-gray-700 border border-gray-700 rounded-xl px-10 py-3 focus:outline-none"
                            placeholder="Password"
                            
                        />
                    </motion.div>

                    {errorMsg && (
                        <motion.p
                            className="text-red-400 text-sm text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {errorMsg}
                        </motion.p>
                    )}

                    {/* LOGIN BUTTON */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 mt-2 rounded-xl bg-green-500 border border-white/30 text-white font-semibold backdrop-blur-sm hover:bg-green-700 transition"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
