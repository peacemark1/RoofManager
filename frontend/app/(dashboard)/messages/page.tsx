"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, History, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function MessagingPage() {
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(false)

    const { data: balance } = useQuery({
        queryKey: ["sms-balance"],
        queryFn: async () => {
            const response = await api.get("/sms/balance")
            return response.data
        }
    })

    const sendSms = useMutation({
        mutationFn: async (data: { to: string; message: string }) => {
            const response = await api.post("/sms/send", data)
            return response.data
        },
        onSuccess: () => {
            setSuccess(true)
            setMessage("")
            setPhone("")
            setTimeout(() => setSuccess(false), 3000)
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Messaging</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                    <DollarSign className="h-4 w-4" />
                    Balance: {balance?.balance || "0.00"}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Send SMS Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Send className="mr-2 h-5 w-5 text-blue-600" />
                            Send Custom SMS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); sendSms.mutate({ to: phone, message }) }} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">To (Phone Number)</label>
                                <Input
                                    placeholder="+233..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                    placeholder="Type your message here..."
                                    className="min-h-[120px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={sendSms.isPending}>
                                {sendSms.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                            {success && (
                                <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center text-sm">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Message sent successfully!
                                </div>
                            )}
                            {sendSms.isError && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center text-sm">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Failed to send message. Please check balance or number.
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Templates/Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl font-bold">Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start" onClick={() => setMessage("Hi, this is a reminder about your roofing appointment tomorrow at 8am.")}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Appointment Reminder
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => setMessage("Your quote is ready! View it here: [link]")}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Quote Ready
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => setMessage("Payment received, thank you for your business!")}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Payment Confirmation
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Log (Placeholder for now) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <History className="mr-2 h-5 w-5 text-gray-600" />
                        Recent Log
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-500 italic text-center py-8">
                        Log history will appear here once messages are sent.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function DollarSign(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
