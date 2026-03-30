import { authenticateUser } from "@/lib/odoo-inventory";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 });
    }

    const user = await authenticateUser(login, password);

    // Store session in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("inv_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours (turno completo)
      path: "/",
    });

    return NextResponse.json({
      uid: user.uid,
      name: user.name,
      username: user.username,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error de autenticación";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("inv_session");
  return NextResponse.json({ ok: true });
}
