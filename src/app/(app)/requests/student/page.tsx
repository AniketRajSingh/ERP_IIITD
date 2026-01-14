"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BedDouble, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { getEmployees } from "@/lib/mock-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import DegreeRequests from "./DegreeRequests";
import AdminForms from "./AdminForms";

const guestHouseFormSchema = z.object({
  guestName: z.string().min(1, "Guest name is required."),
  guestMobile: z.string().min(1, "Guest mobile is required."),
  guestEmail: z.string().email("Invalid email address."),
  guestAddress: z.string().min(1, "Guest address is required."),
  visitPurpose: z.string().min(10, "Purpose must be at least 10 characters."),
  assignee: z.string({ required_error: "Please select an employee to forward to." }),
});

type GuestHouseFormValues = z.infer<typeof guestHouseFormSchema>;

function GuestHouseBookingForm() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GuestHouseFormValues>({
    resolver: zodResolver(guestHouseFormSchema),
    defaultValues: {
      guestName: "",
      guestMobile: "",
      guestEmail: "",
      guestAddress: "",
      visitPurpose: "",
    },
  });

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  function onSubmit(data: GuestHouseFormValues) {
    setIsSubmitting(true);
    console.log(data);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Booking Request Submitted",
        description: "Your guest house booking request has been forwarded.",
      });
      form.reset();
    }, 1500);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Guest House Booking</CardTitle>
            <CardDescription>
              Fill out the details to book a room in the guest house.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Guest Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guestMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="+91-9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guestEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guestAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123, Main Street, New Delhi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="visitPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Visit</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Attending a conference, family visit..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forward To (Work Flow)</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit and Forward"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function StudentRequestsPage() {
  return (
    <Tabs defaultValue="guest-house" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="guest-house">
          <BedDouble className="mr-2 h-4 w-4" />
          Guest House Booking
        </TabsTrigger>
        <TabsTrigger value="degree">
          <FileText className="mr-2 h-4 w-4" />
          Degree/Transcript
        </TabsTrigger>
        <TabsTrigger value="general">
          <FileText className="mr-2 h-4 w-4" />
          General Forms
        </TabsTrigger>
      </TabsList>
      <TabsContent value="guest-house" className="mt-4">
        <GuestHouseBookingForm />
      </TabsContent>
      <TabsContent value="degree" className="mt-4">
        <DegreeRequests />
      </TabsContent>
      <TabsContent value="general" className="mt-4">
        <AdminForms />
      </TabsContent>
    </Tabs>
  );
}
