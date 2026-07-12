import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CancelSubscriptionButton,
  CreditCardIcon,
  DownloadInvoiceButton,
  ManageSubscriptionButton,
  UpdateCardButton,
} from "@/components/dashboard/billing-actions";

const invoices = [
  { id: "INV-2026-007", date: "Jul 1, 2026", amount: 999.0 },
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: 999.0 },
  { id: "INV-2026-005", date: "May 1, 2026", amount: 999.0 },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription, payment method and invoices.
        </p>
      </div>

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Current Plan</CardDescription>
            <CardTitle className="text-2xl">Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>Active</Badge>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Monthly Spend</CardDescription>
            <CardTitle className="text-2xl">$99</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Renews on Aug 1, 2026
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Invoices</CardDescription>
            <CardTitle className="text-2xl">{invoices.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Available for download
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription */}

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current subscription details.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Plan</p>
              <p className="text-sm text-muted-foreground">Pro</p>
            </div>
            <Badge>Active</Badge>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Billing cycle</p>
              <p className="text-sm text-muted-foreground">Monthly</p>
            </div>
            <span className="font-medium">$99/month</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Next invoice</p>
              <p className="text-sm text-muted-foreground">Aug 1, 2026</p>
            </div>
            <ManageSubscriptionButton />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Your default payment method.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <CreditCardIcon className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 08/2028</p>
              </div>
            </div>
            <UpdateCardButton />
          </div>
        </CardContent>
      </Card>

      {/* Billing history */}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium">Billing History</h2>
          <p className="text-sm text-muted-foreground">
            Download invoices and review previous payments.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Invoice
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Amount
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="px-6 py-4">
                      <p className="font-mono text-sm">{invoice.id}</p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {invoice.date}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="success">Paid</Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <DownloadInvoiceButton invoiceId={invoice.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Danger Zone */}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Permanently cancel your subscription. You&apos;ll continue to have
            access until the end of your current billing period.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="font-medium">Cancel subscription</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This action can be reversed before your renewal date.
              </p>
            </div>
            <CancelSubscriptionButton />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}