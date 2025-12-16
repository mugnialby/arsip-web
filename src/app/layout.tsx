import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-datepicker/dist/react-datepicker.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Arsip Kejaksaan Negeri Kota Bogor",
    description: "Kearsipan Kejari Kota Bogor",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
