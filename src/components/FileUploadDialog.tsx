import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { reportsAPI, APIError } from "@/services/api"

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileUpload: (file: File) => void
}

const FileUploadDialog = ({ open, onOpenChange, onFileUpload }: FileUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf" || file.type.includes("sheet") || file.name.endsWith('.csv')) {
        setSelectedFile(file)
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, Excel, or CSV file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf" || file.type.includes("sheet") || file.name.endsWith('.csv')) {
        setSelectedFile(file)
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, Excel, or CSV file.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        // Use the reports API to upload the file
        await reportsAPI.generateReport("daily_deals", { 
          file: selectedFile,
          filename: selectedFile.name 
        })
        
        onFileUpload(selectedFile)
        setSelectedFile(null)
        onOpenChange(false)
        toast({
          title: "File Uploaded",
          description: "Daily deals file has been uploaded successfully to reports.",
        })
      } catch (error) {
        if (error instanceof APIError) {
          toast({
            title: "Upload Failed",
            description: error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Upload Failed",
            description: "An unexpected error occurred while uploading the file.",
            variant: "destructive",
          })
        }
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Daily Deals</DialogTitle>
          <DialogDescription>
            Upload a PDF, Excel, or CSV file containing the daily deals data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">PDF, Excel, or CSV files only</p>
                </div>
              </div>
            )}
          </div>

          {/* File Format Info */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
            <p className="font-medium mb-1">Supported formats:</p>
            <ul className="space-y-1">
              <li>• PDF files (.pdf)</li>
              <li>• Excel files (.xlsx, .xls)</li>
              <li>• CSV files (.csv)</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile}>
            Upload File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FileUploadDialog