"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { Grade } from "@/lib/types";
import { useMemo } from "react";

interface AcademicHealthChartProps {
  grades: Grade[];
}

export function AcademicHealthChart({ grades }: AcademicHealthChartProps) {
  const chartData = useMemo(() => {
    const semesterGPAs: { [key: string]: { total: number; count: number } } = {};
    grades.forEach((grade) => {
      if (!semesterGPAs[grade.semester]) {
        semesterGPAs[grade.semester] = { total: 0, count: 0 };
      }
      semesterGPAs[grade.semester].total += grade.gradePoints;
      semesterGPAs[grade.semester].count++;
    });

    const sortedSemesters = Object.keys(semesterGPAs).sort((a, b) => {
      const [aSeason, aYear] = a.split(" ");
      const [bSeason, bYear] = b.split(" ");
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return aSeason === "Monsoon" ? -1 : 1;
    });

    return sortedSemesters.map((semester) => ({
      semester,
      gpa: (semesterGPAs[semester].total / semesterGPAs[semester].count).toFixed(2),
    }));
  }, [grades]);

  const chartConfig = {
    gpa: {
      label: "GPA",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Health</CardTitle>
        <CardDescription>Your GPA trend over the past semesters</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="semester"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.replace(" ", "\n")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillGpa" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gpa)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gpa)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="gpa"
              type="natural"
              fill="url(#fillGpa)"
              fillOpacity={0.4}
              stroke="var(--color-gpa)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AcademicHealthChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
