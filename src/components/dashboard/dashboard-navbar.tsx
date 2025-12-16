"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";

export default function DashboardNavbarComponent({ showSidebar, setShowSidebar }) {
    const router = useRouter();
    const [user, setUser] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);
    
    // Check already login session
    const removeSessionData = () => {
        localStorage.clear()
        router.push("/main/login")
    };

    return (
        <>
            {/* Top Navbar */}
            <header className="flex items-center justify-between bg-green-100 shadow px-6 py-4">
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <Menu size={22} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">
                        Dashboard Arsip Kejari Kota Bogor
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <span className="uppercase font-semibold text-gray-700">
                        Hi, {user || "ADMIN"}
                    </span>
                    <button
                        onClick={() => removeSessionData()}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>
        </>
    );
}
