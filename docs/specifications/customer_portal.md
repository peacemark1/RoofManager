# Customer Portal Implementation Guide

Public-facing portal for customers to view quotes, track jobs, and make payments without logging in.

---

## Architecture

### Security Model
- **No Passwords**: Customers access via secure token links
- **Token-Based Access**: Each customer gets a unique UUID token
- **Auto-Expiring Links**: Links expire after 30 days
- **Read-Only**: Customers can only view and accept/pay, not edit

### Routes
```
/customer/[token] → Customer dashboard
/customer/[token]/quote/[quoteId] → Quote detail
/customer/[token]/invoice/[invoiceId] → Invoice detail + payment
/customer/[token]/job/[jobId] → Job progress tracking
```

---

## Backend Implementation

### Generate Customer Access Token

Add to `backend/controllers/customer.controller.js`:

```javascript
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate secure access link for customer
async function generateAccessLink(req, res) {
  try {
    const { email } = req.body;
    const companyId = req.companyId;

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { email, companyId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email,
          companyId,
          accessToken: crypto.randomUUID(),
          tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });
    } else if (!customer.accessToken || new Date() > customer.tokenExpiresAt) {
      // Regenerate expired token
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          accessToken: crypto.randomUUID(),
          tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    const accessUrl = `${process.env.FRONTEND_URL}/customer/${customer.accessToken}`;

    res.json({
      success: true,
      data: {
        accessUrl,
        expiresAt: customer.tokenExpiresAt
      }
    });
  } catch (error) {
    console.error('Access link error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate access link' }
    });
  }
}

// Get customer data by token
async function getCustomerData(req, res) {
  try {
    const { token } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      },
      include: {
        quotes: {
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          orderBy: { createdAt: 'desc' }
        },
        jobs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    res.json({
      success: true,
      data: {
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        quotes: customer.quotes,
        invoices: customer.invoices,
        jobs: customer.jobs
      }
    });
  } catch (error) {
    console.error('Customer data error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch data' }
    });
  }
}

// Accept quote (with optional e-signature)
async function acceptQuote(req, res) {
  try {
    const { token, quoteId } = req.params;
    const { signature } = req.body;

    const customer = await prisma.customer.findFirst({
      where: {
        accessToken: token,
        tokenExpiresAt: { gte: new Date() }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invalid or expired link' }
      });
    }

    const quote = await prisma.quote.update({
      where: { id: quoteId, customerId: customer.id },
      data: {
        status: 'accepted',
        acceptedAt: new Date(),
        customerSignature: signature
      }
    });

    // Optionally create a job from the accepted quote
    const job = await prisma.job.create({
      data: {
        companyId: customer.companyId,
        customerId: customer.id,
        customerName: customer.name,
        address: quote.address,
        estimatedCost: quote.totalAmount,
        status: 'scheduled'
      }
    });

    res.json({
      success: true,
      data: { quote, job }
    });
  } catch (error) {
    console.error('Accept quote error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to accept quote' }
    });
  }
}

module.exports = {
  generateAccessLink,
  getCustomerData,
  acceptQuote
};
```

---

## Frontend Implementation

### Customer Dashboard Page

`frontend/app/customer/[token]/page.tsx`:

```tsx
"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, DollarSign, Briefcase } from "lucide-react"
import Link from "next/link"

export default function CustomerPortalPage() {
  const params = useParams()
  const token = params.token as string

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-portal", token],
    queryFn: async () => {
      const response = await api.get(`/customer/${token}`)
      return response.data.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Invalid or Expired Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This link is no longer valid. Please contact us for a new access link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { customer, quotes, invoices, jobs } = data

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome, {customer.name}!</h1>
          <p className="text-gray-600 mt-2">
            View your quotes, invoices, and track job progress
          </p>
        </div>

        {/* Quotes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Your Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <p className="text-gray-500">No quotes yet</p>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote: any) => (
                  <Link
                    key={quote.id}
                    href={`/customer/${token}/quote/${quote.id}`}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <p className="font-medium">Quote #{quote.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          GHS {quote.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          quote.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : quote.status === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {quote.status.charAt(0).toUpperCase() +
                          quote.status.slice(1)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Your Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-gray-500">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice: any) => (
                  <Link
                    key={invoice.id}
                    href={`/customer/${token}/invoice/${invoice.id}`}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <p className="font-medium">
                          Invoice #{invoice.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          GHS {invoice.totalAmount.toLocaleString()}
                        </p>
                        <Badge
                          className={
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Your Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs scheduled yet</p>
            ) : (
              <div className="space-y-3">
                {jobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{job.customerName}</p>
                      <p className="text-sm text-gray-500">
                        Scheduled: {new Date(job.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        job.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : job.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {job.status.replace("_", " ").charAt(0).toUpperCase() +
                        job.status.replace("_", " ").slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## Email Template for Sending Links

When you send a quote, include this in the email:

```html
<p>Dear [Customer Name],</p>

<p>Your roofing quote is ready! Click the link below to view and approve:</p>

<a href="https://roofmanager.com/customer/[TOKEN]/quote/[QUOTE_ID]">
  View Your Quote
</a>

<p>This link is valid for 30 days.</p>

<p>Questions? Reply to this email or call us at [PHONE].</p>

<p>Thank you,<br>[Company Name]</p>
```

---

## Security Best Practices

1. ✅ Use UUID tokens (impossible to guess)
2. ✅ Set token expiration (30 days recommended)
3. ✅ Rate limit customer routes (prevent brute force)
4. ✅ Log all customer actions
5. ✅ Never expose internal IDs in URLs
6. ✅ Validate token on every request

---

This customer portal eliminates the need for customers to create accounts while maintaining security!
