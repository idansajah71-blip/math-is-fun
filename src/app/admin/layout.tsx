"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAdminLoggedIn, getAdminSession } from "@/lib/adminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }

    // Check localStorage session
    if (!isAdminLoggedIn()) {
      router.push("/admin/login");
      return;
    }

    // Also verify role is admin/superadmin
    const session = getAdminSession();
    if (session && session.role !== "admin" && session.role !== "superadmin") {
      router.push("/admin/login");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, var(--bg-gradient-start), var(--bg-gradient-end))" }}>
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(180deg, var(--bg-gradient-start), var(--bg-gradient-end))" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        {/* Topbar */}
        <AdminTopbar />

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
