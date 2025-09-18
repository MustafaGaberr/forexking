// PDF Service for handling PDF uploads and retrieval
// This service now uses MongoDB for storage

import { pdfAPIService, type PDFDocument as APIPDFDocument } from './pdfAPI';

export interface PDFDocument {
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

class PDFService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Validate file
  private validateFile(file: File): { valid: boolean; error?: string } {
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'File must be a PDF document' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    return { valid: true };
  }

  // Convert API PDF document to local PDF document format
  private convertAPIToLocal(apiDoc: APIPDFDocument): PDFDocument {
    return {
      id: apiDoc.id,
      title: apiDoc.title,
      description: apiDoc.description,
      fileName: apiDoc.fileName,
      fileSize: apiDoc.fileSize,
      uploadDate: apiDoc.uploadDate,
      fileUrl: apiDoc.fileUrl,
      mimeType: apiDoc.mimeType,
      gridfsId: apiDoc.gridfsId?.toString(),
    };
  }

  // Upload PDF document
  async uploadPDF(file: File, title: string, description?: string): Promise<PDFDocument> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const apiDoc = await pdfAPIService.uploadPDF(file, title, description);
      return this.convertAPIToLocal(apiDoc);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new Error('Failed to upload PDF to database');
    }
  }

  // Get all PDF documents
  async getAllPDFs(): Promise<PDFDocument[]> {
    try {
      const apiDocs = await pdfAPIService.getAllPDFs();
      return apiDocs.map(doc => this.convertAPIToLocal(doc));
    } catch (error) {
      console.error('Error loading PDF documents:', error);
      return [];
    }
  }

  // Get latest PDF document (for Deal Performance page)
  async getLatestPDF(): Promise<PDFDocument | null> {
    try {
      const apiDoc = await pdfAPIService.getLatestPDF();
      return apiDoc ? this.convertAPIToLocal(apiDoc) : null;
    } catch (error) {
      console.error('Error loading latest PDF:', error);
      return null;
    }
  }

  // Get PDF by ID
  async getPDFById(id: string): Promise<PDFDocument | null> {
    try {
      const apiDoc = await pdfAPIService.getPDFById(id);
      return apiDoc ? this.convertAPIToLocal(apiDoc) : null;
    } catch (error) {
      console.error('Error loading PDF by ID:', error);
      return null;
    }
  }

  // Delete PDF document
  async deletePDF(id: string): Promise<boolean> {
    try {
      return await pdfAPIService.deletePDF(id);
    } catch (error) {
      console.error('Error deleting PDF document:', error);
      return false;
    }
  }

  // Update PDF document metadata
  async updatePDF(id: string, updates: Partial<Pick<PDFDocument, 'title' | 'description'>>): Promise<boolean> {
    try {
      return await pdfAPIService.updatePDF(id, updates);
    } catch (error) {
      console.error('Error updating PDF document:', error);
      return false;
    }
  }

  // Get storage usage info
  async getStorageInfo(): Promise<{ count: number; totalSize: number }> {
    try {
      return await pdfAPIService.getStorageInfo();
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { count: 0, totalSize: 0 };
    }
  }

  // Get PDF file URL for display
  getPDFFileUrl(gridfsId: string): string {
    return pdfAPIService.getPDFFileUrl(gridfsId);
  }

  // Download PDF file
  async downloadPDF(gridfsId: string): Promise<Blob> {
    try {
      return await pdfAPIService.downloadPDF(gridfsId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const pdfService = new PDFService();
