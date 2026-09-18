import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/auth/admin";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ authorized: false }, { status: 403 });
  return NextResponse.json({ authorized: true, admin });
}
