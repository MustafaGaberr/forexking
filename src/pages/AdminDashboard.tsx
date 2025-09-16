"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AdminLogin } from "@/components/admin/AdminLogin"
import PDFUploadDialog from "@/components/PDFUploadDialog"
import { pdfService, type PDFDocument } from "@/services/pdfService"
import { Upload, FileText, Trash2, Calendar, HardDrive } from "lucide-react"
import { useTranslation } from "react-i18next"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [pdfDocuments, setPdfDocuments] = useState<PDFDocument[]>([])
  const [showPDFUpload, setShowPDFUpload] = useState(false)
  const { toast } = useToast()
  const { i18n } = useTranslation()

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = sessionStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadPDFDocuments()
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  const loadPDFDocuments = () => {
    try {
      const documents = pdfService.getAllPDFs()
      setPdfDocuments(documents)
    } catch (error) {
      toast({
        title: "Failed to load documents",
        description: "Could not load PDF documents.",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = () => {
    sessionStorage.removeItem("admin_authenticated")
    setIsAuthenticated(false)
    navigate("/admin")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => {
      setIsAuthenticated(true);
      navigate('/admin');
    }} />
  }


  const handlePDFUpload = async (file: File, title: string, description?: string) => {
    try {
      await pdfService.uploadPDF(file, title, description)
      loadPDFDocuments()
    } catch (error) {
      throw error
    }
  }

  const handleDeletePDF = (id: string) => {
    try {
      const success = pdfService.deletePDF(id)
      if (success) {
        loadPDFDocuments()
        toast({
          title: "Document deleted",
          description: "PDF document has been removed successfully.",
        })
      } else {
        toast({
          title: "Delete failed",
          description: "Could not delete the document.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting the document.",
        variant: "destructive",
      })
    }
  }

  const storageInfo = pdfService.getStorageInfo()

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar onToggle={setSidebarCollapsed} />
      <div className={`fixed top-4 z-50 ${i18n.language === 'ar' ? 'left-4' : 'right-4'}`}>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
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
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage performance documents and reports</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">PDF Documents</CardTitle>
                    <CardDescription>Manage performance reports and documents</CardDescription>
                  </div>
                  <Button onClick={() => setShowPDFUpload(true)} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Storage Info */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{storageInfo.count} documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        <span>{(storageInfo.totalSize / 1024 / 1024).toFixed(2)} MB used</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PDF Documents List */}
                {pdfDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No PDF documents</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your first PDF document to get started
                    </p>
                    <Button onClick={() => setShowPDFUpload(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload PDF
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pdfDocuments.map((doc) => (
                      <Card key={doc.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <h3 className="font-medium">{doc.title}</h3>
                                {doc.description && (
                                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(doc.uploadDate).toLocaleDateString()}
                                  </span>
                                  <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePDF(doc.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* PDF Upload Dialog */}
      {showPDFUpload && (
        <PDFUploadDialog
          onUpload={handlePDFUpload}
          onClose={() => setShowPDFUpload(false)}
        />
      )}
    </div>
  )
}

export default AdminDashboard



