import { Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Class } from "@/lib/types";

interface ClassesTimelineProps {
  classes: Class[];
}

export function ClassesTimeline({ classes }: ClassesTimelineProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
        <CardDescription>Your schedule for today.</CardDescription>
      </CardHeader>
      <CardContent>
        {classes.length > 0 ? (
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-px bg-border" />
            {classes.map((item, index) => (
              <div key={item.id} className="relative flex items-start pb-8">
                <div className="absolute -left-[2.1rem] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div className="pl-4">
                  <p className="font-medium">
                    {item.startTime} - {item.endTime}
                  </p>
                  <p className="font-semibold text-foreground">
                    {item.courseName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.courseCode} &middot; {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center h-48">
            <Clock className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium">No more classes today!</p>
            <p className="text-sm text-muted-foreground">Enjoy your free time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ClassesTimelineSkeleton() {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
