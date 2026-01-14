"use client";

import type { ReactNode } from "react";
import { StudentProvider } from "@/context/student-context";
import { AppShell } from "@/components/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <StudentProvider>
        <AppShell>{children}</AppShell>
    </StudentProvider>
  );
}
