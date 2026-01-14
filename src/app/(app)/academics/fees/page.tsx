import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFeeDetails } from "@/lib/mock-data";
import { IndianRupee, AlertCircle } from "lucide-react";

export default async function FeesPage() {
  const { paymentHistory, pendingDues } = await getFeeDetails();

  const totalDues = pendingDues.reduce((sum, due) => sum + due.amount, 0);

  return (
    <div className="grid gap-6">
      {totalDues > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
             </div>
            <div>
              <CardTitle className="text-destructive">Pending Dues</CardTitle>
              <CardDescription className="text-destructive/80">
                You have outstanding payments. Please clear them to avoid late
                fees.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-card p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount Due</p>
                <p className="text-2xl font-bold font-headline text-destructive">
                  <IndianRupee className="inline-block h-6 w-6" />
                  {totalDues.toLocaleString("en-IN")}
                </p>
              </div>
              <Button variant="destructive">Pay Now</Button>
            </div>
            <div className="mt-4 space-y-2">
                {pendingDues.map((due) => (
                    <div key={due.id} className="flex justify-between items-center text-sm">
                        <p>{due.description}</p>
                        <p className="font-medium">₹{due.amount.toLocaleString("en-IN")}</p>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            A record of all your past fee payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.transactionId}>
                  <TableCell className="font-mono text-xs">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        payment.status === "Successful"
                          ? "default"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {payment.status}
                    </Badge>
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
