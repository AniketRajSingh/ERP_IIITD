"use client";

import { Suspense, useEffect, useState } from 'react';
import {
  getGrades,
  getStudentProfile,
  getUpcomingClasses,
} from "@/lib/mock-data";
import {
  ProfileCard,
  ProfileCardSkeleton,
} from "@/components/dashboard/profile-card";
import {
  AttendanceCard,
  AttendanceCardSkeleton,
} from "@/components/dashboard/attendance-card";
import {
  AcademicHealthChart,
  AcademicHealthChartSkeleton,
} from "@/components/dashboard/academic-health-chart";
import {
  ClassesTimeline,
  ClassesTimelineSkeleton,
} from "@/components/dashboard/classes-timeline";
import { Student, Grade, Class } from "@/lib/types";
import { isLoggedIn } from "@/lib/api";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
        router.push('/login');
        return;
    }
    async function fetchData() {
        try {
            const [studentData, gradesData, classesData] = await Promise.all([
                getStudentProfile(),
                getGrades(),
                getUpcomingClasses()
            ]);
            setStudent(studentData);
            setGrades(gradesData);
            setClasses(classesData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2"><AcademicHealthChartSkeleton /></div>
            <div className="space-y-6">
                <ProfileCardSkeleton />
                <AttendanceCardSkeleton />
            </div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <AcademicHealthChart grades={grades} />
      </div>

      <div className="space-y-6">
        <ProfileCard student={student!} />
        <AttendanceCard />
      </div>

      <div className="lg:col-span-3">
        <ClassesTimeline classes={classes} />
      </div>
    </div>
  );
}