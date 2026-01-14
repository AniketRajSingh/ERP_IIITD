"use client";

import { useForm } from "react-hook-form";
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
import { getEmployees, getProjects } from "@/lib/mock-data"; 
import { apiRequest } from "@/lib/api";
import { Loader2, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
        try {
            const [facultyList, projectsList] = await Promise.all([
                getEmployees(),
                getProjects()
            ]);
            setFaculty(facultyList);
            setMyProjects(projectsList);
        } catch (error) {
            console.error("Failed to load projects data", error);
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setSubmitting(true);
    try {
        await apiRequest('/projects/', {
            method: 'POST',
            body: JSON.stringify({
                title: data.projectTitle,
                description: data.projectAbstract,
                supervisor: data.supervisor,
                status: 'Proposed'
            })
        });
        toast({
            title: "Project Registered!",
            description: "Your project proposal has been submitted for review.",
        });
        form.reset({ projectTitle: '', projectAbstract: ''});
        // Refresh list
        const updatedProjects = await getProjects();
        setMyProjects(updatedProjects);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="space-y-8">
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
                            <SelectItem key={member.id} value={member.id}>
                            {member.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Registration
                </Button>
            </CardFooter>
            </form>
        </Form>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>My Project Proposals</CardTitle>
                <CardDescription>Status of your submitted academic projects.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {myProjects.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4 text-sm italic">No projects proposed yet.</p>
                    ) : (
                        myProjects.map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div>
                                    <h4 className="font-bold">{project.title}</h4>
                                    <p className="text-sm text-muted-foreground">Supervisor: {project.supervisor}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={project.status === 'Approved' ? 'default' : 'secondary'}>
                                        {project.status === 'Approved' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                                        {project.status}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}