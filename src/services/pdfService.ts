// PDF Service for handling PDF uploads and retrieval
// This service will work with both localStorage (for development) and future database integration

export interface PDFDocument {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  fileUrl: string;
  mimeType: string;
}

class PDFService {
  private readonly STORAGE_KEY = 'pdf_documents';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Convert file to base64 data URL
  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

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

  // Upload PDF document
  async uploadPDF(file: File, title: string, description?: string): Promise<PDFDocument> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const fileUrl = await this.fileToDataURL(file);
      const document: PDFDocument = {
        id: this.generateId(),
        title,
        description,
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        fileUrl,
        mimeType: file.type,
      };

      // Get existing documents
      const existingDocs = this.getAllPDFs();
      
      // Add new document
      const updatedDocs = [...existingDocs, document];
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedDocs));

      return document;
    } catch (error) {
      throw new Error('Failed to process PDF file');
    }
  }

  // Get all PDF documents
  getAllPDFs(): PDFDocument[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading PDF documents:', error);
      return [];
    }
  }

  // Get latest PDF document (for Deal Performance page)
  getLatestPDF(): PDFDocument | null {
    const documents = this.getAllPDFs();
    if (documents.length === 0) return null;
    
    // Sort by upload date (newest first) and return the first one
    return documents.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )[0];
  }

  // Get PDF by ID
  getPDFById(id: string): PDFDocument | null {
    const documents = this.getAllPDFs();
    return documents.find(doc => doc.id === id) || null;
  }

  // Delete PDF document
  deletePDF(id: string): boolean {
    try {
      const documents = this.getAllPDFs();
      const filteredDocs = documents.filter(doc => doc.id !== id);
      
      if (filteredDocs.length === documents.length) {
        return false; // Document not found
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredDocs));
      return true;
    } catch (error) {
      console.error('Error deleting PDF document:', error);
      return false;
    }
  }

  // Update PDF document metadata
  updatePDF(id: string, updates: Partial<Pick<PDFDocument, 'title' | 'description'>>): boolean {
    try {
      const documents = this.getAllPDFs();
      const docIndex = documents.findIndex(doc => doc.id === id);
      
      if (docIndex === -1) {
        return false; // Document not found
      }

      documents[docIndex] = { ...documents[docIndex], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
      return true;
    } catch (error) {
      console.error('Error updating PDF document:', error);
      return false;
    }
  }

  // Clear all PDF documents
  clearAllPDFs(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get storage usage info
  getStorageInfo(): { count: number; totalSize: number } {
    const documents = this.getAllPDFs();
    const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);
    
    return {
      count: documents.length,
      totalSize,
    };
  }
}

// Export singleton instance
export const pdfService = new PDFService();

// Future database integration functions (to be implemented)
export const pdfDatabaseService = {
  // These functions will be implemented when database is set up
  async uploadToDatabase(file: File, title: string, description?: string): Promise<PDFDocument> {
    // TODO: Implement database upload
    throw new Error('Database integration not implemented yet');
  },

  async getFromDatabase(id: string): Promise<PDFDocument | null> {
    // TODO: Implement database retrieval
    throw new Error('Database integration not implemented yet');
  },

  async getAllFromDatabase(): Promise<PDFDocument[]> {
    // TODO: Implement database retrieval
    throw new Error('Database integration not implemented yet');
  },

  async deleteFromDatabase(id: string): Promise<boolean> {
    // TODO: Implement database deletion
    throw new Error('Database integration not implemented yet');
  },
};
