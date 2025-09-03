"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import DealsTable from "@/components/DealsTable"
import AddDealDialog from "@/components/AddDealDialog"
import ReportsView from "@/components/ReportsView"
import Navbar from "@/components/Navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dealsAPI, reportsAPI, type Deal, APIError } from "@/services/api"

const DealPerformance = () => {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setLoading(true)
      const fetchedDeals = await dealsAPI.getDeals()
      setDeals(fetchedDeals)
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Failed to load deals",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredDeals = deals.filter(
    (deal) =>
      deal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.dealType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalProfit = deals.reduce((sum, deal) => sum + deal.profit, 0)
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0)

  const addDeal = async (newDealData: Omit<Deal, "id" | "status">) => {
    try {
      const newDeal = await dealsAPI.createDeal(newDealData)
      setDeals([...deals, newDeal])
      toast({
        title: "Deal Added",
        description: "New deal has been successfully added.",
      })
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Failed to add deal",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await reportsAPI.exportDealsReport(
        { searchTerm }, // Pass current filters
        "csv",
      )

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `deals-report-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Deals report has been downloaded.",
      })
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Export Failed",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      <Navbar onToggle={setSidebarCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          typeof window !== 'undefined' && window.innerWidth <= 768
            ? "pt-20 px-2"
            : sidebarCollapsed
            ? "ml-20 px-4"
            : "ml-72 px-4"
        }`}
      >
        <div className="container mx-auto py-4 sm:py-8 px-4">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Deal Performance
                </h1>
                <p className="text-muted-foreground">
                  Track and manage successful client deals
                </p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Add New Deal
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : deals.length}</div>
                  <p className="text-xs text-muted-foreground">Successful transactions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : `$${totalAmount.toLocaleString()}`}
                  </div>
                  <p className="text-xs text-muted-foreground">Trading volume</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {loading ? "..." : `$${totalProfit.toLocaleString()}`}
                  </div>
                  <p className="text-xs text-muted-foreground">Generated profit</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Search deals by client name or deal type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </div>
            </div>

            {/* Tabs for Deals and Reports */}
            <Tabs defaultValue="deals" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deals">Deals Management</TabsTrigger>
                <TabsTrigger value="reports">Dashboard Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="deals" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Deals</CardTitle>
                    <CardDescription>
                      A list of all successful deals and their performance metrics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 sm:p-6">
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="text-muted-foreground">Loading deals...</div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <DealsTable deals={filteredDeals} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-6">
                <ReportsView />
              </TabsContent>
            </Tabs>

            {/* Add Deal Dialog */}
            <AddDealDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onAddDeal={addDeal}
              onFileUpload={(file) => {
                // File upload is now handled within FileUploadDialog
                // Refresh page to show updated reports
                window.location.reload()
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DealPerformance
