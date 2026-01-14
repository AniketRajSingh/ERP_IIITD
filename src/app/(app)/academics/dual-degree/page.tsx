import { Lock, Unlock, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudentProfile } from "@/lib/mock-data";
import Link from "next/link";

const ELIGIBILITY_CGPA = 8.5;

export default async function DualDegreePage() {
  const student = await getStudentProfile();
  const isEligible = student.cgpa >= ELIGIBILITY_CGPA;

  if (!isEligible) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/50 p-12 text-center h-[calc(100vh-10rem)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-headline font-semibold">
          Not Eligible for Dual Degree Program
        </h2>
        <p className="mt-2 text-muted-foreground">
          The dual degree program requires a minimum CGPA of {ELIGIBILITY_CGPA}.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-lg border bg-card p-4 text-card-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p>
            Your current CGPA is{" "}
            <strong className="text-destructive">{student.cgpa.toFixed(2)}</strong>.
          </p>
        </div>
        <Button asChild className="mt-8">
          <Link href="/academics/grades">View Grade History</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Unlock className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Dual Degree Program Eligibility</CardTitle>
            <CardDescription>
              Congratulations! You are eligible to apply for the dual degree
              program.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Based on your current academic standing and a CGPA of{" "}
          <strong className="text-primary">{student.cgpa.toFixed(2)}</strong>,
          you meet the requirements to apply for the dual degree program at
          IIITD.
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h3 className="font-headline">Next Steps</h3>
          <ul>
            <li>
              Review the available dual degree programs and their curricula.
            </li>
            <li>
              Consult with your academic advisor to discuss your options and
              ensure it aligns with your career goals.
            </li>
            <li>
              Submit the dual degree application form through the academic
              office portal before the deadline.
            </li>
          </ul>
        </div>
        <Button>Start Application</Button>
      </CardContent>
    </Card>
  );
}
