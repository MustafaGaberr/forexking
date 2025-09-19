// Google Drive API service for frontend
class GoogleDriveAPIService {
  private readonly API_BASE_URL = 'http://localhost:3001/api';

  // Upload PDF to Google Drive
  async uploadPDF(file: File, title: string, description?: string): Promise<PDFDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      if (description) {
        formData.append('description', description);
      }

      console.log('Uploading PDF to Google Drive:', { title, fileName: file.name, size: file.size });

      const response = await fetch(`${this.API_BASE_URL}/uploadPdf`, {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(errorData.error || `Failed to upload PDF: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload success:', result);
      return result.document;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }

  // Get latest PDF
  async getLatestPDF(): Promise<PDFDocument | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/latestPdf`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch latest PDF');
      }

      const result = await response.json();
      return result.document;
    } catch (error) {
      console.error('Error fetching latest PDF:', error);
      throw error;
    }
  }

  // Get all PDFs
  async getAllPDFs(): Promise<PDFDocument[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/allPdfs`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch PDFs');
      }

      const result = await response.json();
      return result.documents;
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      throw error;
    }
  }

  // Delete PDF
  async deletePDF(id: string): Promise<boolean> {
    try {
      console.log('Attempting to delete PDF with ID:', id);
      
      const response = await fetch(`${this.API_BASE_URL}/deletePdf/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Delete PDF failed:', result);
        throw new Error(result.error || 'Failed to delete PDF');
      }

      console.log('PDF deleted successfully:', result);
      return true;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      return false;
    }
  }
}

export interface PDFDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  driveFileId: string;
  uploadDate: string;
  description?: string;
}

export default new GoogleDriveAPIService();
