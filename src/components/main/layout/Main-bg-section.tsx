"use client"

export default function MainBgSection() {
    return (
        <section
            className="relative min-h-screen flex flex-col justify-center items-center text-black"
            style={{
                backgroundImage: `url('/bg.jpg')`, // ✅ change background here
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            
        </section>
    );
}