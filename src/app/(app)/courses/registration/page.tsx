"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAvailableCourses } from "@/lib/mock-data";
import type { Course } from "@/lib/types";
import { AlertCircle, CalendarClock, PlusCircle, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const MAX_CREDITS = 22;

export default function CourseRegistrationPage() {
  const [term, setTerm] = useState("monsoon-2024");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      const courses = await getAvailableCourses(term);
      setAvailableCourses(courses);
      setIsLoading(false);
    }
    fetchCourses();
  }, [term]);

  const currentCredits = useMemo(() => {
    return registeredCourses.reduce((total, course) => total + course.credits, 0);
  }, [registeredCourses]);

  const handleRegisterCourse = (course: Course) => {
    if (registeredCourses.some(c => c.id === course.id)) {
      toast({ title: "Course already registered", variant: "destructive" });
      return;
    }

    if (currentCredits + course.credits > MAX_CREDITS) {
      toast({ title: "Credit limit exceeded", description: `You can register for a maximum of ${MAX_CREDITS} credits.`, variant: "destructive" });
      return;
    }

    const hasConflict = registeredCourses.some(rc => 
      rc.schedule.day === course.schedule.day &&
      (
        (course.schedule.startTime >= rc.schedule.startTime && course.schedule.startTime < rc.schedule.endTime) ||
        (rc.schedule.startTime >= course.schedule.startTime && rc.schedule.startTime < course.schedule.endTime)
      )
    );

    if (hasConflict) {
      toast({ title: "Schedule Conflict", description: `This course conflicts with another registered course.`, variant: "destructive" });
      return;
    }

    setRegisteredCourses([...registeredCourses, course]);
    toast({ title: "Course Registered", description: `${course.name} has been added to your schedule.` });
  };

  const handleDeregisterCourse = (courseId: string) => {
    setRegisteredCourses(registeredCourses.filter(c => c.id !== courseId));
     toast({ title: "Course De-registered", variant: 'default' });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Courses</CardTitle>
                <CardDescription>Select courses to register for the upcoming semester.</CardDescription>
              </div>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monsoon-2024">Monsoon 2024</SelectItem>
                  <SelectItem value="winter-2025">Winter 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  availableCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name} ({course.code})</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell className="text-center">{course.credits}</TableCell>
                      <TableCell>{course.schedule.day}, {course.schedule.startTime}-{course.schedule.endTime}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRegisterCourse(course)}>
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
            <CardDescription>Courses you have registered for.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Credit Load</span>
                    <span className="font-bold">{currentCredits} / {MAX_CREDITS}</span>
                </div>
                <progress className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" max={MAX_CREDITS} value={currentCredits}></progress>
            </div>

            <Separator className="my-4"/>

            {registeredCourses.length > 0 ? (
              <div className="space-y-2">
                {registeredCourses.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="font-semibold">{course.name}</p>
                      <p className="text-sm text-muted-foreground">{course.code} &middot; {course.credits} credits</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeregisterCourse(course.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <CalendarClock className="mx-auto h-10 w-10 mb-2"/>
                <p>No courses registered yet.</p>
              </div>
            )}
            
            <Button className="w-full mt-6" disabled={registeredCourses.length === 0}>
                Finalize Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
