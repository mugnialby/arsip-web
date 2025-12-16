import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">📚 MyLibrary</h1>
            <div className="flex gap-4">
                <Link href="/">Home</Link>
                <Link href="/books">Books</Link>
                <Link href="/members">Members</Link>
                <Link href="/dashboard">Dashboard</Link>
            </div>
        </nav>
    );
}