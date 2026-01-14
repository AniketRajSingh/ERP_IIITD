import { GraduationCap, Star, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student } from "@/lib/types";

interface ProfileCardProps {
  student: Student;
}

const StatItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export function ProfileCard({ student }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {student.name.split(" ")[0]}!</CardTitle>
        <CardDescription>{student.program}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatItem icon={Star} label="CGPA" value={student.cgpa.toFixed(2)} />
        <StatItem
          icon={BookOpen}
          label="Credits Completed"
          value={student.creditsCompleted}
        />
        <StatItem
          icon={GraduationCap}
          label="Roll Number"
          value={student.rollNumber}
        />
      </CardContent>
    </Card>
  );
}

export function ProfileCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
