import { Suspense } from 'react';
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

async function Profile() {
  const student = await getStudentProfile();
  return <ProfileCard student={student} />;
}

async function Attendance() {
  // This component fetches its own data client-side
  return <AttendanceCard />;
}

async function AcademicHealth() {
  const grades = await getGrades();
  return <AcademicHealthChart grades={grades} />;
}

async function UpcomingClasses() {
  const classes = await getUpcomingClasses();
  return <ClassesTimeline classes={classes} />;
}

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Suspense fallback={<AcademicHealthChartSkeleton />}>
          <AcademicHealth />
        </Suspense>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<ProfileCardSkeleton />}>
          <Profile />
        </Suspense>
        <Suspense fallback={<AttendanceCardSkeleton />}>
          <Attendance />
        </Suspense>
      </div>

      <div className="lg:col-span-3">
        <Suspense fallback={<ClassesTimelineSkeleton />}>
          <UpcomingClasses />
        </Suspense>
      </div>
    </div>
  );
}
