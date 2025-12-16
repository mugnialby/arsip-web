"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    
    const API_URL = "http://192.168.50.52:8080/api/auth/authenticate";

    useEffect(() => {
        document.getElementById("userid")?.focus();
    }, []);

    const handleLogin = async () => {
        if (!userId || !password) {
            setErrorMsg("Please fill all fields.");
            triggerShake();
            return;
        }
        
        setLoading(true);

        const loginRequest = {
            userId: userId.trim().toUpperCase(),
            password: password.trim().toUpperCase()
        };

        try {
            // const response = await axios.post(API_URL, loginRequest, {
            //     headers: { "Content-Type": "application/json" },
            // });

            // if (!response || response.status != 200) throw new Error("Login gagal");

            // // Save token (for authenticated routes)
            // // localStorage.setItem("adminToken", data.token);
            // localStorage.setItem("user", response.data.fullName);

            setLoading(false);
            setErrorMsg("");
            
            // Redirect to dashboard
            router.push("/admin/dashboard");
        } catch (err: any) {
            setLoading(false);
            setErrorMsg(err.message || "Login gagal");
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

                <div className="space-y-4">

                    {/* USER ID */}
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
                        />
                    </motion.div>

                    {/* PASSWORD */}
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

                    {/* ERROR MESSAGE */}
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
                        onClick={handleLogin}
                        disabled={loading}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 mt-2 rounded-xl bg-green-500 border border-white/30 text-white font-semibold backdrop-blur-sm hover:bg-green-700 transition"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </motion.button>

                </div>
            </motion.div>
        </div>
    );
}
