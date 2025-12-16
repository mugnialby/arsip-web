"use client";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className="flex">
                {children}
            </main>
        </>
    );
}