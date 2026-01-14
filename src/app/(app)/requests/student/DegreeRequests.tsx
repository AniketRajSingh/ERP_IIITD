"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Award, FileUp, Minus, Plus, Loader2, Download } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const documentTypes = [
  { id: 'transcript', name: 'Official Transcript', icon: FileText },
  { id: 'degree', name: 'Degree Certificate', icon: Award },
  { id: 'migration', name: 'Migration Certificate', icon: FileUp },
];

const pastRequestsData = [
    { id: 'REQ789', document: 'Official Transcript', date: '2023-10-15', status: 'Shipped' },
    { id: 'REQ788', document: 'Degree Certificate', date: '2023-08-20', status: 'Processing' },
    { id: 'REQ787', document: 'Migration Certificate', date: '2023-05-01', status: 'Shipped' },
];

const requestFormSchema = z.object({
    purpose: z.string({ required_error: 'Please select a purpose.' }),
    copies: z.number().min(1, 'At least one copy is required.'),
    deliveryMethod: z.enum(['digital', 'courier']),
    address: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

export default function DegreeRequests() {
    const { toast } = useToast();
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<{ id: string; name: string; } | null>(null);
    const [wizardStep, setWizardStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RequestFormValues>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: {
            purpose: undefined,
            copies: 1,
            deliveryMethod: 'digital',
            address: '',
        }
    });

    const watchDeliveryMethod = form.watch('deliveryMethod');

    const handleCardClick = (doc: { id: string; name: string; }) => {
        setSelectedDocument(doc);
        setIsWizardOpen(true);
        setWizardStep(1);
        form.reset();
    };
    
    const handleNextStep = () => setWizardStep(prev => prev + 1);
    const handlePrevStep = () => setWizardStep(prev => prev - 1);

    const onSubmit = (data: RequestFormValues) => {
        setIsSubmitting(true);
        console.log({ document: selectedDocument?.name, ...data });

        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsWizardOpen(false);
            toast({
                title: 'Request Submitted!',
                description: `Your request for ${data.copies}x ${selectedDocument?.name} is being processed.`,
            });
        }, 2000);
    };
    
    const totalFee = (form.watch('copies') || 1) * 150 + (watchDeliveryMethod === 'courier' ? 100 : 0);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Request a Document</CardTitle>
                    <CardDescription>Select a document to begin your request.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {documentTypes.map(doc => (
                        <button key={doc.id} onClick={() => handleCardClick(doc)} className="text-left">
                            <Card className="hover:bg-accent/50 hover:border-primary/50 transition-all">
                                <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                                    <doc.icon className="w-10 h-10 text-primary" />
                                    <span className="font-semibold text-center">{doc.name}</span>
                                </CardContent>
                            </Card>
                        </button>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Request: {selectedDocument?.name}</DialogTitle>
                        <DialogDescription>
                            Step {wizardStep} of 3 - Please fill in the details below.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {wizardStep === 1 && (
                                <div className="space-y-4 py-4">
                                    <FormField control={form.control} name="purpose" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Purpose of Request</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a purpose" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="higher-studies">Higher Studies</SelectItem>
                                                    <SelectItem value="visa-application">Visa Application</SelectItem>
                                                    <SelectItem value="internship">Internship</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="copies" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number of Copies</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(Math.max(1, field.value - 1))}><Minus className="h-4 w-4" /></Button>
                                                    <Input {...field} type="number" className="w-16 text-center" readOnly />
                                                    <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(field.value + 1)}><Plus className="h-4 w-4" /></Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}

                            {wizardStep === 2 && (
                                <div className="space-y-4 py-4">
                                    <FormField control={form.control} name="deliveryMethod" render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Delivery Method</FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl><RadioGroupItem value="digital" /></FormControl>
                                                        <FormLabel className="font-normal">Digital Copy (via Email)</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl><RadioGroupItem value="courier" /></FormControl>
                                                        <FormLabel className="font-normal">Physical Courier</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    {watchDeliveryMethod === 'courier' && (
                                        <FormField control={form.control} name="address" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shipping Address</FormLabel>
                                                <FormControl><Textarea placeholder="Enter your full shipping address" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}
                                </div>
                            )}
                            
                            {wizardStep === 3 && (
                                <div className="py-4">
                                     <Card className="bg-muted/50">
                                        <CardHeader>
                                            <CardTitle>Payment Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex justify-between"><span>{selectedDocument?.name} ({form.getValues('copies')}x)</span><span>₹{(form.getValues('copies') * 150).toFixed(2)}</span></div>
                                            {watchDeliveryMethod === 'courier' && <div className="flex justify-between"><span>Courier Charges</span><span>₹100.00</span></div>}
                                            <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>₹{totalFee.toFixed(2)}</span></div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            <DialogFooter className="gap-2 sm:justify-between">
                                <Button type="button" variant="outline" onClick={handlePrevStep} disabled={wizardStep === 1}>Back</Button>
                                {wizardStep < 3 ? (
                                    <Button type="button" onClick={handleNextStep}>Next</Button>
                                ) : (
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Pay & Submit
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Past Requests</CardTitle>
                    <CardDescription>Track the status of your previous document requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Request ID</TableHead>
                                <TableHead>Document</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pastRequestsData.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-mono">{req.id}</TableCell>
                                    <TableCell>{req.document}</TableCell>
                                    <TableCell>{req.date}</TableCell>
                                    <TableCell><Badge variant={req.status === 'Processing' ? 'secondary' : 'default'}>{req.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            {req.status === 'Shipped' ? <Download className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
