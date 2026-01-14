"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const taDetails = {
  courseName: "Introduction to Programming",
  courseCode: "CSE101",
  instructor: "Dr. Smith",
  responsibilities: [
    "Conduct weekly lab sessions.",
    "Grade assignments and quizzes.",
    "Hold office hours twice a week.",
  ],
};

export default function TaDetailsPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Log Submitted",
      description: "Your hours and feedback have been recorded.",
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>TA Details</CardTitle>
          <CardDescription>
            Your assigned course and responsibilities for the current semester.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Course</p>
            <p className="font-semibold">
              {taDetails.courseName} ({taDetails.courseCode})
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Instructor</p>
            <p className="font-semibold">{taDetails.instructor}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Responsibilities</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {taDetails.responsibilities.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Log Hours & Feedback</CardTitle>
            <CardDescription>
              Submit your work log for the week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours Worked</Label>
              <Input
                id="hours"
                type="number"
                placeholder="e.g., 8.5"
                required
                min="0"
                step="0.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback / Summary of Work</Label>
              <Textarea
                id="feedback"
                placeholder="e.g., Conducted lab session on arrays, graded assignment 3..."
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Log</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
