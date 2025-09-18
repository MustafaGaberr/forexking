// MongoDB Service for PDF document management
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

export interface PDFDocument {
  _id?: ObjectId;
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  fileUrl: string;
  mimeType: string;
  gridfsId?: ObjectId;
}

class MongoDBService {
  private client: MongoClient | null = null;
  private db: any = null;
  private bucket: GridFSBucket | null = null;
  private readonly MONGODB_URI = 'mongodb+srv://gabourhostinger1_db_user:IB0MYgjC8LeP7n9P@cluster0.delec68.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  private readonly DB_NAME = 'pdfViewer';
  private readonly COLLECTION_NAME = 'pdfDocuments';

  // Connect to MongoDB
  private async connect(): Promise<void> {
    if (this.client) return;

    try {
      this.client = new MongoClient(this.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(this.DB_NAME);
      this.bucket = new GridFSBucket(this.db, { bucketName: 'pdfFiles' });
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw new Error('Database connection failed');
    }
  }

  // Disconnect from MongoDB
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.bucket = null;
    }
  }

  // Convert file to buffer
  private fileToBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);
        resolve(buffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Upload PDF to MongoDB
  async uploadPDF(file: File, title: string, description?: string): Promise<PDFDocument> {
    await this.connect();

    try {
      // Convert file to buffer
      const buffer = await this.fileToBuffer(file);
      
      // Generate unique filename
      const fileId = new ObjectId();
      const fileName = `${fileId.toString()}_${file.name}`;

      // Upload to GridFS
      const uploadStream = this.bucket!.openUploadStream(fileName, {
        metadata: {
          originalName: file.name,
          title,
          description,
          mimeType: file.type,
          uploadDate: new Date().toISOString()
        }
      });

      uploadStream.write(buffer);
      uploadStream.end();

      // Wait for upload to complete
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });

      // Create document record
      const document: PDFDocument = {
        id: this.generateId(),
        title,
        description,
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        fileUrl: `/api/pdf/${fileId.toString()}`, // API endpoint for serving files
        mimeType: file.type,
        gridfsId: fileId
      };

      // Save document metadata to collection
      await this.db.collection(this.COLLECTION_NAME).insertOne(document);

      return document;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new Error('Failed to upload PDF to database');
    }
  }

  // Get all PDF documents
  async getAllPDFs(): Promise<PDFDocument[]> {
    await this.connect();

    try {
      const documents = await this.db.collection(this.COLLECTION_NAME)
        .find({})
        .sort({ uploadDate: -1 })
        .toArray();
      
      return documents;
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      throw new Error('Failed to fetch PDF documents');
    }
  }

  // Get latest PDF document
  async getLatestPDF(): Promise<PDFDocument | null> {
    await this.connect();

    try {
      const document = await this.db.collection(this.COLLECTION_NAME)
        .findOne({}, { sort: { uploadDate: -1 } });
      
      return document;
    } catch (error) {
      console.error('Error fetching latest PDF:', error);
      throw new Error('Failed to fetch latest PDF document');
    }
  }

  // Get PDF by ID
  async getPDFById(id: string): Promise<PDFDocument | null> {
    await this.connect();

    try {
      const document = await this.db.collection(this.COLLECTION_NAME)
        .findOne({ id });
      
      return document;
    } catch (error) {
      console.error('Error fetching PDF by ID:', error);
      throw new Error('Failed to fetch PDF document');
    }
  }

  // Get PDF file stream by GridFS ID
  async getPDFStream(gridfsId: string): Promise<NodeJS.ReadableStream | null> {
    await this.connect();

    try {
      const objectId = new ObjectId(gridfsId);
      const downloadStream = this.bucket!.openDownloadStream(objectId);
      return downloadStream;
    } catch (error) {
      console.error('Error fetching PDF stream:', error);
      return null;
    }
  }

  // Delete PDF document
  async deletePDF(id: string): Promise<boolean> {
    await this.connect();

    try {
      // Get document to find GridFS ID
      const document = await this.db.collection(this.COLLECTION_NAME)
        .findOne({ id });

      if (!document) {
        return false;
      }

      // Delete from GridFS
      if (document.gridfsId) {
        await this.bucket!.delete(new ObjectId(document.gridfsId));
      }

      // Delete from collection
      const result = await this.db.collection(this.COLLECTION_NAME)
        .deleteOne({ id });

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw new Error('Failed to delete PDF document');
    }
  }

  // Update PDF document metadata
  async updatePDF(id: string, updates: Partial<Pick<PDFDocument, 'title' | 'description'>>): Promise<boolean> {
    await this.connect();

    try {
      const result = await this.db.collection(this.COLLECTION_NAME)
        .updateOne(
          { id },
          { $set: { ...updates, updatedAt: new Date().toISOString() } }
        );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating PDF:', error);
      throw new Error('Failed to update PDF document');
    }
  }

  // Get storage info
  async getStorageInfo(): Promise<{ count: number; totalSize: number }> {
    await this.connect();

    try {
      const count = await this.db.collection(this.COLLECTION_NAME).countDocuments();
      const docs = await this.db.collection(this.COLLECTION_NAME)
        .find({}, { projection: { fileSize: 1 } })
        .toArray();
      
      const totalSize = docs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
      
      return { count, totalSize };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { count: 0, totalSize: 0 };
    }
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBService();
