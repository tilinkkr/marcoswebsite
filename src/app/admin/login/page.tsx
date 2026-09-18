import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdmin } from "@/lib/auth/admin";

import { AdminLogin } from "./AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");
  return <AdminLogin />;
}
