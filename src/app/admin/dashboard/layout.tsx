"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardNavbarComponent from "@/components/dashboard/dashboard-navbar";
import DashboardSidebarComponent from "@/components/dashboard/dashboard-sidebar";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showSidebar, setShowSidebar] = useState(false);
    const pathname = usePathname();

    // 🔍 Convert pathname into "Parent - Child" breadcrumb
    const getBreadcrumbTitle = () => {
        if (pathname === "/admin") return "Dashboard";

        const parts = pathname.split("/").filter(Boolean);

        // Example: ["admin", "master-buku"] → parent="master", child="buku"
        let parent = "";
        let child = "";

        if (parts.length >= 3) {
            parent = parts[parts.length - 2];
            child = parts[parts.length - 1];
        } else if (parts.length === 2) {
            // Handle pattern like /admin/master-buku
            const menu = parts[1];
            const [maybeParent, maybeChild] = menu.split("-");
            parent = maybeParent || "";
            child = maybeChild || "";
        }

        // Capitalize first letter and replace "-" with space
        const format = (text: string) =>
            text
                ? text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, " ")
                : "";

        if (parent && child) return `${format(parent)} - ${format(child)}`;
        return format(child || parent);
    };

    const breadcrumbTitle = getBreadcrumbTitle();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowSidebar(false);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardSidebarComponent
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />
            <div className="flex-1 flex flex-col">
                <DashboardNavbarComponent
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-3 bg-gray-50">
                    {/* 🧭 Breadcrumbs Card */}
                    <div className="bg-white shadow rounded-xl p-2 mb-3 border border-gray-100">
                        <h1 className="text-lg font-semibold text-gray-800 ml-2">
                            {breadcrumbTitle}
                        </h1>
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
}
