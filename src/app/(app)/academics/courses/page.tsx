"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAvailableCourses } from "@/lib/mock-data";
import type { Course } from "@/lib/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      // We'll use the available courses as the current semester's courses for this demo
      const currentCourses = await getAvailableCourses("monsoon-2024");
      setCourses(currentCourses);
      setIsLoading(false);
    }
    fetchCourses();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Course List</CardTitle>
        <CardDescription>
          Your courses and instructor information for the current semester.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-right">Credits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="mt-1 h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-6 w-10 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{course.instructor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.schedule.day}, {course.schedule.startTime} -{" "}
                      {course.schedule.endTime}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{course.credits}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
