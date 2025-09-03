"use client"

import React, { useEffect, useState } from "react"
import { FileText, Pen, User, IdCard, Calendar, Save } from "lucide-react"
import Navbar from "@/components/Navbar"
import Ticker from "@/components/Ticker"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SignatureCanvas from "@/components/SignatureCanvas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  customerName: z.string().min(2, { message: "Please enter your full name" }),
  idNumber: z.string().min(3, { message: "Please enter a valid ID or passport number" }),
  agreementDate: z.date({ required_error: "Please select a date" }),
})

type FormValues = z.infer<typeof formSchema>

const CustomerAgreement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : true
  )
  const [customerSignature, setCustomerSignature] = useState<string | null>(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      idNumber: "",
      agreementDate: new Date(),
    },
  })

  const onSubmit = (values: FormValues) => {
    if (!customerSignature) {
      toast.error("Please sign the agreement before submitting")
      return
    }

    // Here you would connect to your backend API
    console.log("Form submission data:", {
      ...values,
      customerSignature,
      agreementDate: format(values.agreementDate, "yyyy-MM-dd"),
    })

    toast.success("Agreement submitted successfully")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      <Navbar onToggle={setIsSidebarCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "pt-20" : isSidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        <Ticker />

        {/* CENTERED CONTAINER */}
        <div className="container mx-auto max-w-4xl py-10 sm:py-14 px-4">
          <Card className="mb-8 border border-border shadow-lg bg-card">
            <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10 dark:from-secondary/20 dark:to-primary/20">
              <CardTitle className="text-3xl flex items-center gap-2 text-center md:text-left">
                <FileText className="h-8 w-8 text-primary" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary font-bold">
                  Customer Agreement
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-10"
                >
                  {/* DATE */}
                  <div className="bg-secondary/10 rounded-lg p-4 sm:p-6">
                    <FormField
                      control={form.control}
                      name="agreementDate"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <FormLabel className="text-base font-medium">
                              Date:
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-[180px] justify-between"
                                    type="button"
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy")
                                    ) : (
                                      <span>Select date</span>
                                    )}
                                    <Calendar className="h-4 w-4 opacity-60" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="p-3"
                                />
                              </PopoverContent>
                            </Popover>
                            <span className="text-base text-muted-foreground">
                              /&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;2025
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* PARTIES */}
                  <div className="space-y-6">
                    <p className="text-lg">
                      This agreement is made between:
                    </p>

                    {/* First Party */}
                    <div className="pl-4 border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg space-y-5">
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                              <FormLabel className="sm:col-span-4 text-base font-medium whitespace-nowrap">
                                <strong>First Party:</strong> Name:
                              </FormLabel>
                              <FormControl className="sm:col-span-8">
                                <div className="relative">
                                  <User className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    className="pl-8 h-10"
                                    placeholder="Enter full name"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* ID / Passport */}
                      <FormField
                        control={form.control}
                        name="idNumber"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                              <FormLabel className="sm:col-span-4 text-base font-medium whitespace-nowrap">
                                ID or Passport Number:
                              </FormLabel>
                              <FormControl className="sm:col-span-8">
                                <div className="relative">
                                  <IdCard className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    className="pl-8 h-10"
                                    placeholder="Enter ID/Passport number"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <p className="text-sm">
                        Hereinafter referred to as{" "}
                        <span className="text-primary font-medium">
                          Owner of Funds
                        </span>
                        .
                      </p>
                    </div>

                    {/* Second Party */}
                    <div className="pl-4 border-l-4 border-secondary bg-secondary/5 p-4 rounded-r-lg">
                      <p className="text-base mb-2">
                        <strong>Second Party:</strong> Name:{" "}
                        <span className="font-semibold text-secondary">
                          Forex King
                        </span>
                      </p>
                      <p className="text-sm">
                        Hereinafter referred to as{" "}
                        <span className="text-secondary font-medium">
                          Operator of Funds
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  {/* CLAUSES */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {/* Introduction */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Introduction
                      </h3>
                      <p className="text-foreground/90">
                        The first party owns an investment portfolio with the number
                        {" "}(...) worth (100 currency units), and desires to operate it in
                        Forex under a profit-sharing system where{" "}
                        <span className="font-semibold text-secondary">60%</span> of the
                        profits go to the second party and{" "}
                        <span className="font-semibold text-primary">40%</span> to the first
                        party. The parties agree to the following terms:
                      </p>
                    </section>

                    {/* Clause 1 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Clause 1: Portfolio Management
                      </h3>
                      <p className="text-foreground/90">
                        The second party will manage the portfolio in the Forex market based
                        on their technical decisions, without any guarantees of principal or
                        profits.
                      </p>
                    </section>

                    {/* Clause 2 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Clause 2: Profit Distribution
                      </h3>
                      <p className="text-foreground/90">
                        Profits shall be distributed every ten business days according to the
                        percentage specified above.
                      </p>
                    </section>

                    {/* Clause 3 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Clause 3: Withdrawal and Capital Increase
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          The first party is not entitled to withdraw funds except after ten
                          days have passed or upon request to fully liquidate the portfolio.
                        </p>
                        <p className="text-foreground/90">
                          If the first party wishes to increase the capital, a new agreement
                          or supplement to this agreement will be signed.
                        </p>
                      </div>
                    </section>

                    {/* Clause 4 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Clause 4: Termination of the Agreement
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          The first party may terminate the agreement after the first month by
                          notifying the second party at least (7) days before the end of the
                          month.
                        </p>
                        <p className="text-foreground/90">
                          All open positions will be closed during the notice period, and
                          funds will be liquidated based on trading results.
                        </p>
                      </div>
                    </section>

                    {/* Clause 5 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Clause 5: Loss Limits and Portfolio Suspension
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          If the portfolio value drops by (50%) of the original investment,
                          trading will be immediately suspended, and the first party will be
                          contacted to decide whether to liquidate or resume operations.
                        </p>
                        <p className="text-foreground/90">
                          The first party acknowledges that the second party is not liable for
                          any losses resulting from market fluctuations or investment
                          decisions related to Forex.
                        </p>
                      </div>
                    </section>

                    {/* Clause 6 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Clause 6: Dispute Resolution
                      </h3>
                      <p className="text-foreground/90">
                        In case of any dispute between the parties, they will attempt to
                        resolve it amicably. If this is not possible, the dispute will be
                        resolved by the competent court in (insert city or country).
                      </p>
                    </section>

                    {/* Clause 7 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        Clause 7: General Provisions
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          This agreement constitutes the full and final understanding between
                          the parties.
                        </p>
                        <p className="text-foreground/90">
                          The agreement is executed in two original copies, one for each
                          party.
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* SIGNATURES */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 bg-secondary/10 p-6 rounded-lg">
                    {/* First Party */}
                    <div className="p-6 border border-border rounded-lg bg-background shadow-sm">
                      <h4 className="font-semibold text-lg text-primary mb-6 flex items-center gap-2">
                        <Pen className="h-4 w-4" />
                        First Party
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Name:
                          </p>
                          <p className="text-base font-medium">
                            {form.watch("customerName") || "................................"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Signature:
                          </p>
                          <SignatureCanvas label="Please sign here" onSave={setCustomerSignature} />
                          {customerSignature && (
                            <div className="mt-4 border border-border p-3 rounded-md bg-card">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Your saved signature:
                              </p>
                              <div className="flex justify-center">
                                <img
                                  src={customerSignature}
                                  alt="Customer Signature"
                                  className="max-h-16"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Second Party */}
                    <div className="p-6 border border-border rounded-lg bg-background shadow-sm">
                      <h4 className="font-semibold text-lg text-secondary mb-6 flex items-center gap-2">
                        <Pen className="h-4 w-4" />
                        Second Party
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Name:
                          </p>
                          <p className="text-base font-medium text-secondary">Forex King</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Signature:
                          </p>
                          <div className="p-4 flex items-center justify-center bg-card rounded-md border border-border">
                            <img
                              src="/lovable-uploads/0dd907d0-bfbf-462e-8d4a-1d30c9590d51.png"
                              alt="Second Party Signature"
                              className="h-16"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Submit Agreement
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </main>
    </div>
  )
}

export default CustomerAgreement
