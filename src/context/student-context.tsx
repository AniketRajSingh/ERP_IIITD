"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getStudentProfile } from "@/lib/mock-data";
import { Student } from "@/lib/types";
import { isLoggedIn } from "@/lib/api";

interface StudentContextType {
  student: Student | null;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudent() {
      if (!isLoggedIn()) {
        setIsLoading(false);
        return;
      }
      try {
        const studentData = await getStudentProfile();
        setStudent(studentData);
      } catch (error) {
        console.error("Failed to fetch student profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStudent();
  }, []);

  return (
    <StudentContext.Provider value={{ student, isLoading }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
