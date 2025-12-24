import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    // Dummy validation (replace with real DB check)
    // if (email === "a" && password === "a") {
    //     return NextResponse.json({ token: "fake-jwt-token-12345" });
    // }

    return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
    );
}
