"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getEmployees } from "@/lib/mock-data"; // Using employees as mock faculty

const projectFormSchema = z.object({
  projectType: z.string({ required_error: "Please select a project type." }),
  projectTitle: z.string().min(10, "Title must be at least 10 characters."),
  projectAbstract: z.string().min(50, "Abstract must be at least 50 characters."),
  supervisor: z.string({ required_error: "Please select a faculty supervisor." }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectsPage() {
  const { toast } = useToast();
  const [faculty, setFaculty] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Re-using employees as mock faculty for supervisors
    getEmployees().then(setFaculty);
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });

  const onSubmit = (data: ProjectFormValues) => {
    console.log(data);
    toast({
      title: "Project Registered!",
      description: "Your project proposal has been submitted for review.",
    });
    form.reset({ projectTitle: '', projectAbstract: ''});
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Project Registration</CardTitle>
            <CardDescription>
              Register for your B.Tech Project, Independent Project, or other academic projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="btp">B.Tech. Project (BTP)</SelectItem>
                      <SelectItem value="ip">Independent Project (IP)</SelectItem>
                      <SelectItem value="is">Independent Study (IS)</SelectItem>
                      <SelectItem value="urp">Undergraduate Research Project</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AI-Powered Student Assistance Chatbot" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="projectAbstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Abstract</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief summary of your project's objectives, methods, and expected outcomes..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>A short summary of your project (min. 50 characters).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty Supervisor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a faculty member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {faculty.map((member) => (
                        // Filtering out non-faculty for this select
                        !member.name.includes("Office") && !member.name.includes("Manager") &&
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="dean.acad">Dean of Academics</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit Registration</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
