// PDF API Service for handling PDF operations with MongoDB
import { mongoDBService } from './mongodbService';

export interface PDFDocument {
  _id?: string;
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  fileUrl: string;
  mimeType: string;
  gridfsId?: string;
}

export interface PDFUploadResponse {
  success: boolean;
  document?: PDFDocument;
  error?: string;
}

export interface PDFListResponse {
  success: boolean;
  documents?: PDFDocument[];
  error?: string;
}

export interface PDFResponse {
  success: boolean;
  document?: PDFDocument;
  error?: string;
}

class PDFAPIService {
  private readonly API_BASE_URL = 'http://localhost:3001/api/pdf';

  // Upload PDF file
  async uploadPDF(file: File, title: string, description?: string): Promise<PDFDocument> {
    try {
      // Validate file
      if (file.type !== 'application/pdf') {
        throw new Error('File must be a PDF document');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      if (description) {
        formData.append('description', description);
      }

      // Upload to server
      const response = await fetch(`${this.API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload PDF');
      }

      const result = await response.json();
      return result.document;
    } catch (error) {
      console.error('PDF upload error:', error);
      throw error;
    }
  }

  // Get all PDF documents
  async getAllPDFs(): Promise<PDFDocument[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch PDFs');
      }
      const result = await response.json();
      return result.documents || [];
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      throw error;
    }
  }

  // Get latest PDF document
  async getLatestPDF(): Promise<PDFDocument | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/latest`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest PDF');
      }
      const result = await response.json();
      return result.document || null;
    } catch (error) {
      console.error('Error fetching latest PDF:', error);
      throw error;
    }
  }

  // Get PDF by ID
  async getPDFById(id: string): Promise<PDFDocument | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch PDF');
      }
      const result = await response.json();
      return result.document || null;
    } catch (error) {
      console.error('Error fetching PDF by ID:', error);
      throw error;
    }
  }

  // Delete PDF document
  async deletePDF(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete PDF');
      }
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  }

  // Update PDF document
  async updatePDF(id: string, updates: Partial<Pick<PDFDocument, 'title' | 'description'>>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update PDF');
      }
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error updating PDF:', error);
      throw error;
    }
  }

  // Get storage info
  async getStorageInfo(): Promise<{ count: number; totalSize: number }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/storage/info`);
      if (!response.ok) {
        throw new Error('Failed to get storage info');
      }
      const result = await response.json();
      return { count: result.count, totalSize: result.totalSize };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { count: 0, totalSize: 0 };
    }
  }

  // Get PDF file URL for display
  getPDFFileUrl(gridfsId: string): string {
    return `${this.API_BASE_URL}/file/${gridfsId}`;
  }

  // Download PDF file
  async downloadPDF(gridfsId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/file/${gridfsId}`);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      return await response.blob();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const pdfAPIService = new PDFAPIService();
