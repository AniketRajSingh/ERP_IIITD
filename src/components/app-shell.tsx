"use client";

import Link from "next/link";
import {
  BookPlus,
  GraduationCap,
  LayoutDashboard,
  Milestone,
  Send,
  University,
  FileText,
  Briefcase,
  Wallet,
  BookUser,
  Users,
  PanelLeft,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStudent } from "@/context/student-context";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";

function NavContent() {
    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/requests/new", icon: Send, label: "Hostel Request" },
        { href: "/courses/registration", icon: BookPlus, label: "Register For Courses" },
        { href: "/academics/fees", icon: Wallet, label: "My Fee Details" },
        { href: "/academics/projects", icon: Briefcase, label: "Project Registration" },
        { href: "/academics/grades", icon: GraduationCap, label: "Grades" },
        { href: "/academics/courses", icon: BookUser, label: "My Course List" },
        { href: "/academics/dual-degree", icon: Milestone, label: "Dual Degree" },
        { href: "/academics/ta", icon: Users, label: "TA Details" },
        { href: "/requests/student", icon: FileText, label: "Student Requests" },
    ];

    return (
        <nav className="flex flex-col gap-2 p-2">
            {navItems.map((item) => (
                 <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                >
                    <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Link>
                </Button>
            ))}
        </nav>
    )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { student, isLoading } = useStudent();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isLoading || !student) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <University className="h-10 w-10 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-background h-screen sticky top-0">
            <div className="flex items-center gap-2 p-4 border-b h-14">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <University className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-semibold font-headline">IIITD ERP</h1>
            </div>
            <ScrollArea className="flex-1">
                 <NavContent />
            </ScrollArea>
             <div className="p-4 border-t flex items-center gap-2">
                 <Avatar>
                    <AvatarImage
                    src={student.avatarUrl}
                    alt={student.name}
                    data-ai-hint="student portrait"
                    />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium">{student.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                    {student.email}
                    </p>
                </div>
                <ThemeSwitcher />
            </div>
        </aside>
        
        <div className="flex flex-col flex-1">
            <header className="flex h-14 items-center justify-between border-b bg-background/70 px-4 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    {/* Mobile Nav Trigger */}
                    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <PanelLeft className="h-6 w-6"/>
                                <span className="sr-only">Toggle Navigation</span>
                            </Button>
                        </SheetTrigger>
                         <SheetContent side="left" className="p-0 w-64 flex flex-col">
                            <div className="flex items-center gap-2 p-4 border-b h-14">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <University className="h-6 w-6" />
                                </div>
                                <h1 className="text-xl font-semibold font-headline">IIITD ERP</h1>
                            </div>
                            <ScrollArea className="flex-1">
                                <NavContent />
                            </ScrollArea>
                            <div className="p-4 border-t flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                    src={student.avatarUrl}
                                    alt={student.name}
                                    />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate font-medium">{student.name}</p>
                                    <p className="truncate text-sm text-muted-foreground">
                                    {student.email}
                                    </p>
                                </div>
                                <ThemeSwitcher />
                            </div>
                        </SheetContent>
                    </Sheet>
                    
                    <Link href="/dashboard" className="hidden items-center gap-2 sm:flex md:hidden">
                        <University className="h-6 w-6 text-primary" />
                        <span className="text-lg font-semibold font-headline">IIITD ERP</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-green-500/50 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    Student Status: Active
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
    </div>
  );
}
