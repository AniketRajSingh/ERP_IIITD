"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

export function AttendanceCard() {
  const [attendance, setAttendance] = useState(0);

  useEffect(() => {
    // Simulate fetching data and setting a random attendance
    const randomAttendance = Math.floor(Math.random() * (100 - 75 + 1) + 75);
    setAttendance(randomAttendance);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Your overall attendance this semester.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall</span>
          <span className="text-2xl font-bold font-headline text-primary">
            {attendance}%
          </span>
        </div>
        <Progress value={attendance} aria-label={`${attendance}% attendance`} />
        {attendance < 80 && (
          <p className="text-xs text-destructive">
            Your attendance is low. Please attend classes regularly.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function AttendanceCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
