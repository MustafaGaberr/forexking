// "use client"

// import { useState, useEffect } from "react"
// import { Plus, Filter, Download } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { useToast } from "@/hooks/use-toast"
// import DealsTable from "@/components/DealsTable"
// import AddDealDialog from "@/components/AddDealDialog"
// import ReportsView from "@/components/ReportsView"
// import Navbar from "@/components/Navbar"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { dealsAPI, reportsAPI, type Deal, APIError } from "@/services/api"

// const DealPerformance = () => {
//   const [deals, setDeals] = useState<Deal[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [isExporting, setIsExporting] = useState(false)
//   const { toast } = useToast()

//   useEffect(() => {
//     loadDeals()
//   }, [])

//   const loadDeals = async () => {
//     try {
//       setLoading(true)
//       const fetchedDeals = await dealsAPI.getDeals()
//       setDeals(fetchedDeals)
//     } catch (error) {
//       if (error instanceof APIError) {
//         toast({
//           title: "Failed to load deals",
//           description: error.message,
//           variant: "destructive",
//         })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredDeals = deals.filter(
//     (deal) =>
//       deal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       deal.dealType.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const totalProfit = deals.reduce((sum, deal) => sum + deal.profit, 0)
//   const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0)

//   const addDeal = async (newDealData: Omit<Deal, "id" | "status">) => {
//     try {
//       const newDeal = await dealsAPI.createDeal(newDealData)
//       setDeals([...deals, newDeal])
//       toast({
//         title: "Deal Added",
//         description: "New deal has been successfully added.",
//       })
//     } catch (error) {
//       if (error instanceof APIError) {
//         toast({
//           title: "Failed to add deal",
//           description: error.message,
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const handleExport = async () => {
//     try {
//       setIsExporting(true)
//       const blob = await reportsAPI.exportDealsReport(
//         { searchTerm }, // Pass current filters
//         "csv",
//       )

//       // Create download link
//       const url = window.URL.createObjectURL(blob)
//       const link = document.createElement("a")
//       link.href = url
//       link.download = `deals-report-${new Date().toISOString().split("T")[0]}.csv`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url)

//       toast({
//         title: "Export Successful",
//         description: "Deals report has been downloaded.",
//       })
//     } catch (error) {
//       if (error instanceof APIError) {
//         toast({
//           title: "Export Failed",
//           description: error.message,
//           variant: "destructive",
//         })
//       }
//     } finally {
//       setIsExporting(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground flex w-full">
//       <Navbar onToggle={setSidebarCollapsed} />

//       <main
//         className={`flex-1 transition-all duration-300 ease-in-out ${
//           typeof window !== 'undefined' && window.innerWidth <= 768
//             ? "pt-20 px-2"
//             : sidebarCollapsed
//             ? "ml-20 px-4"
//             : "ml-72 px-4"
//         }`}
//       >
//         <div className="container mx-auto py-4 sm:py-8 px-4">
//           <div className="flex flex-col gap-6">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h1 className="text-3xl font-bold tracking-tight text-foreground">
//                   Deal Performance
//                 </h1>
//                 <p className="text-muted-foreground">
//                   Track and manage successful client deals
//                 </p>
//               </div>
//               <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2 w-full md:w-auto">
//                 <Plus className="h-4 w-4" />
//                 Add New Deal
//               </Button>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{loading ? "..." : deals.length}</div>
//                   <p className="text-xs text-muted-foreground">Successful transactions</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     {loading ? "..." : `$${totalAmount.toLocaleString()}`}
//                   </div>
//                   <p className="text-xs text-muted-foreground">Trading volume</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-accent">
//                     {loading ? "..." : `$${totalProfit.toLocaleString()}`}
//                   </div>
//                   <p className="text-xs text-muted-foreground">Generated profit</p>
//                 </CardContent>
//               </Card>
//             </div>

            
//             {/* Add Deal Dialog */}
//             <AddDealDialog
//               open={isAddDialogOpen}
//               onOpenChange={setIsAddDialogOpen}
//               onAddDeal={addDeal}
//               onFileUpload={(file) => {
//                 // File upload is now handled within FileUploadDialog
//                 // Refresh page to show updated reports
//                 window.location.reload()
//               }}
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default DealPerformance

"use client"

import { useEffect, useState, useCallback } from "react"
import Navbar from "@/components/Navbar"
import PDFViewer from "@/components/PDFViewer"
import { pdfService, type PDFDocument } from "@/services/pdfService"
import googleDriveAPI, { type PDFDocument as GoogleDrivePDFDocument } from "@/services/googleDriveAPI"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

const DealPerformance = () => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | GoogleDrivePDFDocument | null>(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [useGoogleDrive, setUseGoogleDrive] = useState(true)
  const { toast } = useToast()
  const { t, i18n } = useTranslation()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  const fetchPDFAsBlob = useCallback(async (pdfUrl: string) => {
    try {
      setLoading(true)
      console.log('Fetching PDF as blob from:', pdfUrl)
      
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
        mode: 'cors',
        credentials: 'omit'
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
      }
      
      const blob = await response.blob()
      console.log('Blob created, size:', blob.size)
      
      const blobUrl = URL.createObjectURL(blob)
      console.log('Blob URL created:', blobUrl)
      
      // Clean up previous blob URL
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
      
      setPdfBlobUrl(blobUrl)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching PDF as blob:', error)
      toast({
        title: t('dealPerformance.failedToLoad'),
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
      setLoading(false)
    }
  }, [pdfBlobUrl, t, toast])

  const loadLatestPDF = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Loading latest PDF...')
      
      let latestPDF = null
      if (useGoogleDrive) {
        latestPDF = await googleDriveAPI.getLatestPDF()
      } else {
        latestPDF = await pdfService.getLatestPDF()
      }
      
      console.log('Latest PDF loaded:', latestPDF)
      setPdfDocument(latestPDF)
      
      // For Google Drive, use the fileUrl directly
      if (latestPDF?.fileUrl) {
        console.log('Using PDF URL directly:', latestPDF.fileUrl)
        setPdfBlobUrl(null) // Don't use blob for Google Drive
        setLoading(false)
      } else if (latestPDF?.gridfsId) {
        // For MongoDB GridFS, fetch as blob
        const pdfUrl = `http://localhost:3001/api/pdf/file/${latestPDF.gridfsId}`
        console.log('Fetching PDF from URL:', pdfUrl)
        await fetchPDFAsBlob(pdfUrl)
      } else {
        console.log('No PDF found or no valid URL')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error in loadLatestPDF:', error)
      toast({
        title: t('dealPerformance.failedToLoad'),
        description: t('dealPerformance.loadError'),
        variant: "destructive",
      })
      setLoading(false)
    }
  }, [t, toast, fetchPDFAsBlob, useGoogleDrive])

  useEffect(() => {
    loadLatestPDF()
  }, [loadLatestPDF])

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar onToggle={setSidebarCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          typeof window !== 'undefined' && window.innerWidth <= 768
            ? "pt-20 px-2"
            : sidebarCollapsed
            ? i18n.language === 'ar' 
              ? "mr-20 px-4"
              : "ml-20 px-4"
            : i18n.language === 'ar'
              ? "mr-72 px-4"
              : "ml-72 px-4"
        }`}
      >
        <div className="container mx-auto py-4 sm:py-8 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dealPerformance.title')}</h1>
                <p className="text-muted-foreground">
                  {pdfDocument ? pdfDocument.title : t('dealPerformance.subtitle')}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{t('dealPerformance.loading')}</p>
                </div>
              </div>
            ) : pdfDocument ? (
              <PDFViewer
                pdfUrl={pdfBlobUrl || pdfDocument?.fileUrl || ''}
                title={pdfDocument?.title || t('dealPerformance.performanceReport')}
                className="w-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">No Documents Available Right Now</p>
                  {/* <p className="text-sm text-muted-foreground">
                    Please upload a PDF document from the Admin Dashboard
                  </p> */}
                </div>
              </div>
            )}

            {pdfDocument && (
              <div className="text-sm text-muted-foreground text-center">
                <p>{t('dealPerformance.documentUploaded')} {new Date(pdfDocument.uploadDate).toLocaleDateString()}</p>
                <p>{t('dealPerformance.fileSize')} {(pdfDocument.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DealPerformance




