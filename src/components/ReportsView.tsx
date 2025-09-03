import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Loader } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { reportsAPI, type Report, APIError } from "@/services/api"

const ReportsView = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [exportingReports, setExportingReports] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      const fetchedReports = await reportsAPI.getReports()
      setReports(fetchedReports)
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Failed to load reports",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async (reportId: string, title: string) => {
    try {
      setExportingReports(prev => new Set([...prev, reportId]))
      
      const blob = await reportsAPI.exportReport(reportId, "csv")
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `Report "${title}" has been downloaded.`,
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
      setExportingReports(prev => {
        const newSet = new Set(prev)
        newSet.delete(reportId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading reports...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Reports</CardTitle>
          <CardDescription>
            View and download uploaded PDF reports and generated reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reports uploaded yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Upload files through the Deal Performance section to see them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report.type} • Created {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(report.id, report.title)}
                    disabled={exportingReports.has(report.id)}
                    className="flex items-center gap-2"
                  >
                    {exportingReports.has(report.id) ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {exportingReports.has(report.id) ? "Downloading..." : "Download"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsView