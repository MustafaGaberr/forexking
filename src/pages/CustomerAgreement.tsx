"use client"

import React, { useEffect, useState } from "react"
import { FileText, Pen, User, IdCard, Calendar, Save } from "lucide-react"
import Navbar from "@/components/Navbar"
import Ticker from "@/components/Ticker"
import Footer from "@/components/Footer"
import { useTranslation } from "react-i18next"
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

const createFormSchema = (t: (key: string) => string) => z.object({
  customerName: z.string().min(2, { message: t('agreement.nameRequired') }),
  idNumber: z.string().min(3, { message: t('agreement.idRequired') }),
  agreementDate: z.date({ required_error: t('agreement.dateRequired') }),
})

type FormValues = {
  customerName: string
  idNumber: string
  agreementDate: Date
}

const CustomerAgreement = () => {
  const { t, i18n } = useTranslation()
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      customerName: "",
      idNumber: "",
      agreementDate: new Date(),
    },
  })

  const onSubmit = (values: FormValues) => {
    if (!customerSignature) {
      toast.error(t('agreement.signatureRequired'))
      return
    }

    // Here you would connect to your backend API
    console.log("Form submission data:", {
      customerName: values.customerName,
      idNumber: values.idNumber,
      customerSignature,
      agreementDate: format(values.agreementDate, "yyyy-MM-dd"),
    })

    toast.success(t('agreement.success'))
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar onToggle={setIsSidebarCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile 
            ? "pt-20" 
            : isSidebarCollapsed 
              ? i18n.language === 'ar' 
                ? "mr-20" 
                : "ml-20"
              : i18n.language === 'ar'
                ? "mr-72"
                : "ml-72"
        }`}
      >
        <Ticker />

        {/* CENTERED CONTAINER */}
        <div className="container mx-auto max-w-4xl py-10 sm:py-14 px-4">
          <Card className="mb-8 border border-border shadow-lg bg-card">
            <CardHeader className="border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10 dark:from-secondary/20 dark:to-primary/20">
              <CardTitle className="text-3xl flex items-center gap-2 text-center md:text-left">
                <FileText className="h-8 w-8 text-primary" />
                <span className="bg-clip-text text-transparent bg-primary font-bold">
                  {t('agreement.title')}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent
              className="pt-6 bg-[linear-gradient(hsl(var(--background)/0.75),hsl(var(--background)/0.85)),url('/Assets/pattern.svg')] dark:bg-[linear-gradient(hsl(var(--background)/0.95),hsl(var(--background)/0.95)),url('/Assets/pattern.svg')] bg-repeat bg-[length:500px] bg-center"
            >
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
                              {t('agreement.agreementDate')}:
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
                                      <span>{t('agreement.dateRequired')}</span>
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
                            {/* <span className="text-base text-muted-foreground">
                              /&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;20
                            </span> */}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* PARTIES */}
                  <div className="space-y-6">
                    <p className="text-lg">
                      {t('agreement.subtitle')}
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
                                <strong>{t('agreement.customerName')}:</strong>
                              </FormLabel>
                              <FormControl className="sm:col-span-8">
                                <div className="relative">
                                  <User className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    className="pl-8 h-10"
                                    placeholder={t('agreement.customerName')}
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
                                {t('agreement.idNumber')}:
                              </FormLabel>
                              <FormControl className="sm:col-span-8">
                                <div className="relative">
                                  <IdCard className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    className="pl-8 h-10"
                                    placeholder={t('agreement.idNumber')}
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
                        {t('agreement.customerName')}
                      </p>
                    </div>

                    {/* Second Party */}
                    <div className="pl-4 border-l-4 border-secondary bg-secondary/5 p-4 rounded-r-lg">
                      <p className="text-base mb-2">
                        <strong>{t('common.forexKing')}</strong>
                      </p>
                      <p className="text-sm">
                        {t('common.swissquoteBank')}
                      </p>
                    </div>
                  </div>

                  {/* CLAUSES */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {/* Introduction */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        المقدمة
                      </h3>
                      <p className="text-foreground/90">
                        يمتلك الطرف الأول محفظة استثمارية برقم (...) بقيمة (100 وحدة عملة)، ويرغب في تشغيلها في سوق الفوركس وفق نظام تقاسم الأرباح بحيث يذهب{" "}
                        <span className="font-semibold text-primary">60%</span> من الأرباح للطرف الثاني و{" "}
                        <span className="font-semibold text-primary">40%</span> للطرف الأول. ويتفق الطرفان على البنود التالية:
                      </p>
                    </section>

                    {/* Clause 1 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        البند 1: إدارة المحفظة
                      </h3>
                      <p className="text-foreground/90">
                        يتولى الطرف الثاني إدارة المحفظة في سوق الفوركس بناءً على قراراته الفنية، دون أي ضمان لرأس المال أو الأرباح.
                      </p>
                    </section>

                    {/* Clause 2 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        البند 2: توزيع الأرباح
                      </h3>
                      <p className="text-foreground/90">
                        يتم توزيع الأرباح كل عشرة أيام عمل وفق النسبة المحددة أعلاه.
                      </p>
                    </section>

                    {/* Clause 3 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        البند 3: السحب وزيادة رأس المال
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          لا يحق للطرف الأول سحب الأموال إلا بعد مرور عشرة أيام أو عند طلبه لتصفية المحفظة بالكامل.
                        </p>
                        <p className="text-foreground/90">
                          في حال رغب الطرف الأول في زيادة رأس المال، سيتم توقيع اتفاق جديد أو ملحق لهذا الاتفاق.
                        </p>
                      </div>
                    </section>

                    {/* Clause 4 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        البند 4: إنهاء الاتفاق
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          يمكن للطرف الأول إنهاء الاتفاق بعد الشهر الأول من خلال إخطار الطرف الثاني قبل انتهاء الشهر بمدة لا تقل عن (7) أيام.
                        </p>
                        <p className="text-foreground/90">
                          وسيتم إغلاق جميع المراكز المفتوحة خلال فترة الإشعار، وتصفيتها بناءً على نتائج التداول.
                        </p>
                      </div>
                    </section>

                    {/* Clause 5 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        البند 5: حدود الخسارة وتعليق المحفظة
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          إذا انخفضت قيمة المحفظة بنسبة (50%) من الاستثمار الأصلي، يتم تعليق التداول فورًا، وسيتم التواصل مع الطرف الأول لاتخاذ قرار بشأن التصفية أو استئناف العمليات.
                        </p>
                        <p className="text-foreground/90">
                          ويقر الطرف الأول بأن الطرف الثاني غير مسؤول عن أي خسائر ناتجة عن تقلبات السوق أو قرارات الاستثمار المتعلقة بالفوركس.
                        </p>
                      </div>
                    </section>

                    {/* Clause 6 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        البند 6: تسوية المنازعات
                      </h3>
                      <p className="text-foreground/90">
                        في حالة حدوث أي نزاع بين الطرفين، سيحاولان حله وديًا. وإذا لم يكن ذلك ممكنًا، يُحل النزاع عن طريق المحكمة المختصة في (أدخل المدينة أو الدولة).
                      </p>
                    </section>

                    {/* Clause 7 */}
                    <section>
                      <h3 className="text-xl font-semibold text-primary not-prose">
                        البند 7: أحكام عامة
                      </h3>
                      <div className="space-y-3">
                        <p className="text-foreground/90">
                          يشكل هذا الاتفاق الفهم الكامل والنهائي بين الطرفين.
                        </p>
                        <p className="text-foreground/90">
                          ويتم تنفيذ الاتفاق بنسختين أصليتين، نسخة لكل طرف.
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* SIGNATURES */}
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 bg-secondary/10 p-6 rounded-lg">
                    {/* First Party */}
                    <div className="p-6 border border-border rounded-lg bg-background shadow-sm">
                      <h4 className="font-semibold text-lg text-primary mb-6 flex items-center gap-2">
                        <Pen className="h-4 w-4" />
                        {t('agreement.customerName')}
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
                          <SignatureCanvas label={t('agreement.signaturePlaceholder')} onSave={setCustomerSignature} />
                          {customerSignature && (
                            <div className="mt-4 border border-border p-3 rounded-md bg-card">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                {t('agreement.signature')}:
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
                      <h4 className="font-semibold text-lg text-primary mb-6 flex items-center gap-2">
                        <Pen className="h-4 w-4" />
                        {t('common.forexKing')}
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Name:
                          </p>
                          <p className="text-base font-medium text-primary">{t('common.forexKing')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Signature:
                          </p>
                            <div className="p-4 flex items-center justify-center bg-card rounded-md border border-border">
                              <img
                                src="/Assets/"
                                alt="Second Party Signature"
                                className="h-22"
                              />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STAMP OVERLAY */}
                    <div className="absolute top-60 left-1/2 transform -translate-x-1/2 z-10">
                      <img
                        src="/Assets/STAMP FOR FOREX-KING.png"
                        alt="Official Stamp"
                        className="h-36 w-36 object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {t('agreement.submit')}
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
