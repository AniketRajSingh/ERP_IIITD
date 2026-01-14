"use client";

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, FileSignature, Calendar as CalendarIcon, UploadCloud, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getStudentProfile, getEmployees } from '@/lib/mock-data';
import { Student } from '@/lib/types';

const allForms = [
    { id: 'leave', name: 'Leave Application', description: 'Apply for academic or medical leave.' },
    { id: 'id-card', name: 'ID Card Requisition', description: 'Request a new or duplicate ID card.' },
    { id: 'bonafide-form', name: 'Bonafide Certificate Request', description: 'Standard request for a bonafide certificate.' },
];

const leaveFormSchema = z.object({
    startDate: z.date({ required_error: 'Start date is required.' }),
    endDate: z.date({ required_error: 'End date is required.' }),
    reason: z.string().min(20, 'Reason must be at least 20 characters.'),
    document: z.any().optional(),
    assignee: z.string({ required_error: 'Please select who to forward this to.' }),
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

function LeaveApplicationForm() {
    const { toast } = useToast();
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveFormSchema),
    });

    React.useEffect(() => {
        getEmployees().then(setEmployees);
    }, []);

    const onSubmit = (data: LeaveFormValues) => {
        setIsSubmitting(true);
        console.log(data);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({ title: 'Leave application submitted.', description: 'Your request has been forwarded for approval.' });
            form.reset();
        }, 1500);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                         <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues('startDate') || new Date())} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reason for Leave</FormLabel>
                        <FormControl><Textarea placeholder="Please provide a detailed reason for your leave..." rows={4} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                 <FormField control={form.control} name="document" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supporting Document (Optional)</FormLabel>
                         <FormControl>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" onChange={(e) => field.onChange(e.target.files)} />
                                </label>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Forward To (Approval Path)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select approver" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {employees.filter(e => e.name.includes("Hostel") || e.name.includes("Dean")).map((emp) => (
                                    <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                </Button>
            </form>
        </Form>
    );
}

function BonafideGenerator() {
    const [student, setStudent] = useState<Student | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        getStudentProfile().then(setStudent);
    }, []);
    
    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            toast({ title: 'PDF Generated', description: 'Your Bonafide Certificate has been downloaded.' });
            // In a real app, this would trigger a PDF download.
        }, 1500);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Instant Bonafide Certificate</CardTitle>
                <CardDescription>Generate a bonafide certificate for official use.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg p-8 bg-background relative">
                     <div className="absolute top-8 right-8">
                        <FileSignature className="w-12 h-12 text-primary/10" />
                    </div>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-headline font-bold">INDRAPRASTHA INSTITUTE of INFORMATION TECHNOLOGY DELHI</h2>
                        <p className="text-sm">(A State University established by Govt. of NCT of Delhi)</p>
                    </div>
                    <h3 className="text-xl font-headline font-semibold text-center mb-8 underline">BONAFIDE CERTIFICATE</h3>
                    <div className="space-y-4 text-sm leading-relaxed">
                        <p>This is to certify that <strong>{student?.name || '...'}</strong>, Roll Number <strong>{student?.rollNumber || '...'}</strong>, is a bonafide student of this institute in the <strong>{student?.program || '...'}</strong> program.</p>
                        <p>This certificate is issued upon the request of the student for the purpose of general official use.</p>
                        <p className="pt-12"><strong>Registrar</strong><br/>IIIT Delhi</p>
                         <p className="text-xs text-muted-foreground">Date: {format(new Date(), 'PPP')}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate PDF
                </Button>
            </CardFooter>
        </Card>
    );
}

const requestHistory = [
    { id: 'LA001', form: 'Leave Application', status: 'Approved' },
    { id: 'BC002', form: 'Bonafide Certificate', status: 'Submitted' },
    { id: 'IDC01', form: 'ID Card', status: 'Under Review' },
    { id: 'LA002', form: 'Leave Application', status: 'Rejected' },
];

function RequestHistoryKanban() {
    const columns = {
        Submitted: requestHistory.filter(r => r.status === 'Submitted'),
        'Under Review': requestHistory.filter(r => r.status === 'Under Review'),
        Approved: requestHistory.filter(r => r.status === 'Approved'),
        Rejected: requestHistory.filter(r => r.status === 'Rejected'),
    };
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Approved': return 'bg-green-500';
            case 'Rejected': return 'bg-red-500';
            case 'Under Review': return 'bg-yellow-500';
            default: return 'bg-blue-500';
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>View the lifecycle of your submitted forms.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(columns).map(([status, requests]) => (
                    <div key={status} className="bg-muted/50 rounded-lg p-3">
                        <h3 className="font-semibold text-sm mb-3 flex items-center">
                             <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`}></span>
                             {status}
                        </h3>
                        <div className="space-y-2">
                            {requests.map(req => (
                                <Card key={req.id} className="p-3 text-sm">
                                    <p className="font-semibold">{req.form}</p>
                                    <p className="text-xs text-muted-foreground">{req.id}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}


export default function AdminForms() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForm, setSelectedForm] = useState<string | null>(null);

    const filteredForms = useMemo(() => {
        return allForms.filter(form => form.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const renderForm = () => {
        switch (selectedForm) {
            case 'leave':
                return <Card>
                    <CardHeader><CardTitle>Leave Application</CardTitle></CardHeader>
                    <CardContent><LeaveApplicationForm /></CardContent>
                </Card>;
            case 'bonafide-instant':
                 return <BonafideGenerator />;
            default:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Directory</CardTitle>
                            <CardDescription>Find and submit general administrative forms.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search for forms..."
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <Card className="hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedForm('bonafide-instant')}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><FileSignature className="w-5 h-5 text-primary" /> Instant Bonafide Certificate</CardTitle>
                                    <CardDescription>Instantly generate and download a bonafide certificate.</CardDescription>
                                </CardHeader>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                {filteredForms.map(form => (
                                    <Card key={form.id} className="hover:bg-accent/50 transition-colors">
                                        <CardHeader>
                                            <CardTitle className="text-base">{form.name}</CardTitle>
                                            <CardDescription>{form.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <Button variant="secondary" onClick={() => setSelectedForm(form.id)}>Open Form</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                );
        }
    };
    
    return (
        <div className="space-y-8">
            {selectedForm && selectedForm !== 'bonafide-instant' && <Button variant="outline" onClick={() => setSelectedForm(null)}>← Back to All Forms</Button>}
            {renderForm()}
            <RequestHistoryKanban />
        </div>
    );
}
