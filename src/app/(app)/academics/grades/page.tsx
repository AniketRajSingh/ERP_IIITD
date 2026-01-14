"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getGrades, getStudentProfile } from "@/lib/mock-data";
import { Grade, Student } from "@/lib/types";
import {
  MessageSquareQuote,
  Printer,
  TrendingUp,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function getGradeBadgeVariant(grade: string) {
  if (["A", "A-"].includes(grade)) return "default";
  if (["B", "B-"].includes(grade)) return "secondary";
  if (["C", "C-"].includes(grade)) return "outline";
  return "destructive";
}

function calculateGPA(grades: Grade[]) {
  if (grades.length === 0) return 0;
  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  if (totalCredits === 0) return 0;
  const weightedTotalPoints = grades.reduce(
    (sum, g) => sum + g.gradePoints * g.credits,
    0
  );
  return weightedTotalPoints / totalCredits;
}

function GradeRow({ grade }: { grade: Grade }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <TableCell>
          <div className="font-medium">{grade.courseName}</div>
          <div className="text-sm text-muted-foreground">{grade.courseCode}</div>
        </TableCell>
        <TableCell>
          <Badge
            variant={grade.courseType === "Core" ? "outline" : "secondary"}
          >
            {grade.courseType}
          </Badge>
        </TableCell>
        <TableCell>{grade.credits}</TableCell>
        <TableCell>
          <Badge variant={getGradeBadgeVariant(grade.grade)}>
            {grade.grade}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-medium">
          {grade.gradePoints.toFixed(2)}
        </TableCell>
        <TableCell className="p-1 text-right">
          <div className="p-3">
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={6}>
            <div className="p-4 bg-muted/50 rounded-md m-1 mx-4 mb-2">
              <h4 className="font-semibold mb-2">Instructor Feedback</h4>
              <div className="flex items-start gap-3 text-sm">
                <MessageSquareQuote className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                <p className="text-muted-foreground italic">
                  {grade.instructorFeedback}
                </p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function GpaChart({ allGrades, student }: { allGrades: Grade[], student: Student | null }) {
    const trendData = useMemo(() => {
        const semesters = [...new Set(allGrades.map(g => g.semester))].sort((a, b) => {
            const [aSeason, aYear] = a.split(' ');
            const [bSeason, bYear] = b.split(' ');
            if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
            return aSeason === 'Monsoon' ? -1 : 1;
        });

        let cumulativeCredits = 0;
        let cumulativePoints = 0;

        return semesters.map(semester => {
            const semesterGrades = allGrades.filter(g => g.semester === semester);
            const sgpa = calculateGPA(semesterGrades);
            
            const semesterCredits = semesterGrades.reduce((sum, g) => sum + g.credits, 0);
            const semesterPoints = semesterGrades.reduce((sum, g) => sum + g.gradePoints * g.credits, 0);

            cumulativeCredits += semesterCredits;
            cumulativePoints += semesterPoints;
            const cgpa = cumulativePoints / cumulativeCredits;

            return { semester, sgpa: parseFloat(sgpa.toFixed(2)), cgpa: parseFloat(cgpa.toFixed(2)) };
        });
    }, [allGrades]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sgpa" stroke="#8884d8" name="SGPA" />
                <Line type="monotone" dataKey="cgpa" stroke="#82ca9d" name="CGPA" />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default function GradesPage() {
  const [allGrades, setAllGrades] = useState<Grade[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedSemester, setSelectedSemester] = useState("all");

  useEffect(() => {
    getGrades().then(setAllGrades);
    getStudentProfile().then(setStudent);
  }, []);

  const semesters = useMemo(() => {
    const uniqueSemesters = [...new Set(allGrades.map((g) => g.semester))];
    const sortedSemesters = uniqueSemesters.sort((a, b) => {
      const [aSeason, aYear] = a.split(" ");
      const [bSeason, bYear] = b.split(" ");
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return aSeason === "Monsoon" ? -1 : 1;
    });
    return ["all", ...sortedSemesters];
  }, [allGrades]);

  const filteredGrades = useMemo(() => {
    if (selectedSemester === "all") return allGrades;
    return allGrades.filter((g) => g.semester === selectedSemester);
  }, [allGrades, selectedSemester]);

  const { coreCourses, electiveCourses } = useMemo(() => {
    const core = filteredGrades.filter(g => g.courseType === 'Core');
    const electives = filteredGrades.filter(g => g.courseType !== 'Core');
    return { coreCourses: core, electiveCourses: electives };
  }, [filteredGrades]);

  const sgpa = useMemo(() => calculateGPA(filteredGrades), [filteredGrades]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GPA Summary</CardTitle>
          <CardDescription>Your academic performance overview.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="text-2xl font-bold font-headline">
                {student?.cgpa.toFixed(2) ?? "..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedSemester === "all" ? "Overall GPA" : "SGPA"}
              </p>
              <p className="text-2xl font-bold font-headline">
                {sgpa.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>GPA Trend</CardTitle>
            <CardDescription>SGPA vs CGPA over time.</CardDescription>
        </CardHeader>
        <CardContent>
            <GpaChart allGrades={allGrades} student={student} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Grade Analytics</CardTitle>
            <CardDescription>
              View your complete grade history and instructor feedback.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem === "all" ? "All Semesters" : sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Core Courses</h3>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Course</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Credits</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead className="text-right">Grade Point</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {coreCourses.map((grade, index) => (
                            <GradeRow key={index} grade={grade} />
                        ))}
                        </TableBody>
                    </Table>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Elective Courses</h3>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Course</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Credits</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead className="text-right">Grade Point</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {electiveCourses.map((grade, index) => (
                            <GradeRow key={index} grade={grade} />
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
