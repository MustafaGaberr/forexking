# MongoDB Database Setup Guide

## Overview

This guide will help you set up MongoDB database integration for the PDF document management system in your Forex King application.

## Prerequisites

- Node.js installed
- MongoDB Atlas account (recommended) or local MongoDB installation
- Basic understanding of MongoDB and Node.js

## Step 1: MongoDB Atlas Setup (Recommended)

### 1.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier M0)

### 1.2 Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with read/write permissions
4. Note down the username and password

### 1.3 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Add your current IP address or use "0.0.0.0/0" for all IPs (less secure)

### 1.4 Get Connection String

1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (replace `<password>` with your actual password)

## Step 2: Install Required Dependencies

```bash
npm install mongodb mongoose multer multer-gridfs-storage gridfs-stream
```

## Step 3: Environment Variables

Create a `.env` file in your project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
DB_NAME=forex_king

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads
```

## Step 4: Database Schema

Create the following MongoDB collections:

### 4.1 PDF Documents Collection

```javascript
// Collection: pdf_documents
{
  _id: ObjectId,
  title: String,
  description: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  uploadDate: Date,
  fileId: ObjectId, // Reference to GridFS file
  isActive: Boolean,
  uploadedBy: String // Admin user ID
}
```

### 4.2 GridFS for File Storage

Files will be stored in GridFS with the following metadata:

```javascript
{
  filename: String,
  contentType: String,
  uploadDate: Date,
  metadata: {
    title: String,
    description: String,
    uploadedBy: String
  }
}
```

## Step 5: Backend API Implementation

### 5.1 Database Connection

Create `src/lib/mongodb.ts`:

```typescript
import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) return db;

  client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  db = client.db(process.env.DB_NAME);

  return db;
}

export { db };
```

### 5.2 PDF Service with Database

Update `src/services/pdfService.ts` to include database functions:

```typescript
import { connectToDatabase } from "../lib/mongodb";
import { GridFSBucket } from "mongodb";

export class PDFDatabaseService {
  private async getGridFSBucket() {
    const db = await connectToDatabase();
    return new GridFSBucket(db, { bucketName: "pdfs" });
  }

  async uploadToDatabase(
    file: File,
    title: string,
    description?: string
  ): Promise<PDFDocument> {
    const db = await connectToDatabase();
    const bucket = await this.getGridFSBucket();

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: { title, description, uploadedBy: "admin" },
    });

    return new Promise((resolve, reject) => {
      uploadStream.end(buffer);
      uploadStream.on("finish", async () => {
        // Save document metadata
        const document: PDFDocument = {
          id: uploadStream.id.toString(),
          title,
          description,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          fileUrl: `/api/pdf/${uploadStream.id}`,
          mimeType: file.type,
        };

        await db.collection("pdf_documents").insertOne(document);
        resolve(document);
      });
      uploadStream.on("error", reject);
    });
  }

  async getFromDatabase(id: string): Promise<PDFDocument | null> {
    const db = await connectToDatabase();
    return await db.collection("pdf_documents").findOne({ id });
  }

  async getAllFromDatabase(): Promise<PDFDocument[]> {
    const db = await connectToDatabase();
    return await db
      .collection("pdf_documents")
      .find({})
      .sort({ uploadDate: -1 })
      .toArray();
  }

  async deleteFromDatabase(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const bucket = await this.getGridFSBucket();

    try {
      // Delete from GridFS
      await bucket.delete(new ObjectId(id));

      // Delete metadata
      const result = await db.collection("pdf_documents").deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting PDF:", error);
      return false;
    }
  }
}
```

### 5.3 API Routes

Create API routes for PDF management:

```typescript
// src/routes/api/pdf.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PDFDatabaseService } from "../../services/pdfService";

const pdfService = new PDFDatabaseService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      if (req.query.id) {
        const pdf = await pdfService.getFromDatabase(req.query.id as string);
        if (!pdf) return res.status(404).json({ error: "PDF not found" });
        return res.json(pdf);
      } else {
        const pdfs = await pdfService.getAllFromDatabase();
        return res.json(pdfs);
      }

    case "POST":
      // Handle file upload
      break;

    case "DELETE":
      const { id } = req.query;
      const deleted = await pdfService.deleteFromDatabase(id as string);
      return res.json({ success: deleted });

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## Step 6: Frontend Integration

### 6.1 Update PDF Service

Modify `src/services/pdfService.ts` to use database when available:

```typescript
// Add database integration check
const useDatabase =
  process.env.NODE_ENV === "production" || process.env.USE_DATABASE === "true";

export const pdfService = {
  async uploadPDF(
    file: File,
    title: string,
    description?: string
  ): Promise<PDFDocument> {
    if (useDatabase) {
      return await pdfDatabaseService.uploadToDatabase(
        file,
        title,
        description
      );
    } else {
      // Use localStorage fallback
      return await this.uploadToLocalStorage(file, title, description);
    }
  },

  // ... other methods with similar database/localStorage logic
};
```

## Step 7: Deployment Considerations

### 7.1 Environment Variables

Make sure to set environment variables in your deployment platform:

- Vercel: Add in Project Settings > Environment Variables
- Netlify: Add in Site Settings > Environment Variables
- Heroku: Use `heroku config:set` command

### 7.2 File Size Limits

- MongoDB Atlas: 16MB per document (GridFS handles larger files)
- Vercel: 4.5MB for serverless functions
- Consider using cloud storage (AWS S3, Cloudinary) for larger files

### 7.3 Security

- Implement proper authentication for admin routes
- Add file type validation
- Implement rate limiting for uploads
- Use HTTPS for all connections

## Step 8: Testing

### 8.1 Local Testing

1. Start your development server
2. Upload a PDF through the admin dashboard
3. Check if it appears on the Deal Performance page
4. Verify file is stored in MongoDB

### 8.2 Production Testing

1. Deploy to your hosting platform
2. Test upload functionality
3. Verify database connectivity
4. Test file retrieval and display

## Troubleshooting

### Common Issues:

1. **Connection refused**: Check MongoDB URI and network access
2. **File upload fails**: Check file size limits and permissions
3. **PDF not displaying**: Verify file URL and CORS settings
4. **Database timeout**: Check connection pool settings

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are set
3. Test database connection independently
4. Check server logs for detailed error messages

## Next Steps

After setting up the database:

1. Implement user authentication for admin access
2. Add file versioning and history
3. Implement file compression for optimization
4. Add analytics for document views
5. Set up automated backups

## Support

If you encounter issues:

1. Check MongoDB Atlas logs
2. Review application logs
3. Test with smaller files first
4. Verify all environment variables are correct
