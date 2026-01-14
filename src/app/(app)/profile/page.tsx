"use client";

import { useState, useEffect } from "react";
import { getStudentProfile, submitProfileChangeRequest, getProfileChangeRequests } from "@/lib/mock-data";
import { Student } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, GraduationCap, Building, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
    const [student, setStudent] = useState<Student | null>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newName, setNewName] = useState("");
    const [newProgram, setNewProgram] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        async function loadData() {
            try {
                const [profile, reqs] = await Promise.all([
                    getStudentProfile(),
                    getProfileChangeRequests()
                ]);
                setStudent(profile);
                setRequests(reqs);
                setNewName(profile.name);
                setNewProgram(profile.program);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const changes = {};
            if (newName !== student?.name) (changes as any).first_name = newName.split(" ")[0], (changes as any).last_name = newName.split(" ").slice(1).join(" ");
            if (newProgram !== student?.program) (changes as any).branch = newProgram;

            if (Object.keys(changes).length === 0) {
                toast({ title: "No changes detected" });
                return;
            }

            await submitProfileChangeRequest(changes);
            toast({ title: "Request Submitted", description: "Your profile change request is pending admin approval." });
            const updatedReqs = await getProfileChangeRequests();
            setRequests(updatedReqs);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">{student?.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-wider">
                                Role: {student?.role}
                            </Badge>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Email</Label>
                        <div className="flex items-center gap-2 font-medium">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {student?.email}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Roll Number</Label>
                        <div className="flex items-center gap-2 font-medium">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            {student?.rollNumber}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Program / Branch</Label>
                        <div className="flex items-center gap-2 font-medium">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {student?.program}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className={`h-4 w-4 ${student?.isActive ? 'text-green-500' : 'text-red-500'}`} />
                            <Badge variant={student?.isActive ? "default" : "destructive"}>
                                {student?.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Request Profile Update</CardTitle>
                    <CardDescription>Submit changes to your profile for admin approval.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitRequest}>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="program">Program / Branch</Label>
                            <Input id="program" value={newProgram} onChange={(e) => setNewProgram(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Change Request
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent requests.</p>
                        ) : (
                            requests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Update Profile</p>
                                        <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={req.status === 'pending' ? 'outline' : req.status === 'approved' ? 'default' : 'destructive'}>
                                            {req.status}
                                        </Badge>
                                        {req.admin_remarks && (
                                            <p className="text-xs italic text-muted-foreground max-w-[200px] truncate">
                                                "{req.admin_remarks}"
                                            </p>
                                        )}
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
