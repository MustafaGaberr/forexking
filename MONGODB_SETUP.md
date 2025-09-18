# MongoDB PDF Storage Setup

This document explains how to set up and use the MongoDB PDF storage system for the Forex King application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- The MongoDB connection string provided

## Setup Instructions

### 1. Install Dependencies

All required dependencies are already installed:

- `mongodb` - MongoDB driver
- `multer` - File upload handling
- `cors` - Cross-origin resource sharing
- `concurrently` - Run multiple commands simultaneously

### 2. MongoDB Configuration

The application is configured to use the provided MongoDB Atlas cluster:

- **Connection String**: `mongodb+srv://gabourhostinger1_db_user:IB0MYgjC8LeP7n9P@cluster0.delec68.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
- **Database Name**: `pdfViewer`
- **Collection**: `pdfDocuments`
- **GridFS Bucket**: `pdfFiles`

### 3. Running the Application

#### Option 1: Run Both Server and Client (Recommended)

```bash
npm run dev:full
```

This will start:

- MongoDB API server on `http://localhost:3001`
- React development server on `http://localhost:5173`

#### Option 2: Run Separately

**Terminal 1 - Start the API server:**

```bash
npm run server
```

**Terminal 2 - Start the React app:**

```bash
npm run dev
```

### 4. API Endpoints

The server provides the following endpoints:

- `POST /api/pdf/upload` - Upload a PDF file
- `GET /api/pdf/all` - Get all PDF documents
- `GET /api/pdf/latest` - Get the latest PDF document
- `GET /api/pdf/:id` - Get PDF by ID
- `GET /api/pdf/file/:gridfsId` - Serve PDF file for display
- `DELETE /api/pdf/:id` - Delete PDF document
- `PUT /api/pdf/:id` - Update PDF metadata
- `GET /api/pdf/storage/info` - Get storage information
- `GET /api/health` - Health check

### 5. How It Works

#### PDF Upload Process:

1. User selects a PDF file in Admin Dashboard
2. File is validated (PDF format, size limit)
3. File is uploaded to MongoDB GridFS
4. Document metadata is stored in MongoDB collection
5. Success response is returned to client

#### PDF Display Process:

1. Deal Performance page requests latest PDF
2. API returns PDF metadata including GridFS ID
3. PDFViewer component loads PDF using GridFS URL
4. PDF is streamed directly from MongoDB

### 6. File Structure

```
src/
├── services/
│   ├── mongodbService.ts    # MongoDB connection and operations
│   ├── pdfAPI.ts           # API service layer
│   └── pdfService.ts       # Main PDF service (updated for MongoDB)
├── pages/
│   ├── AdminDashboard.tsx  # PDF upload interface
│   └── DealPerformance.tsx # PDF display interface
└── components/
    └── PDFViewer.tsx       # PDF viewing component

server.js                   # Express API server
```

### 7. Database Schema

#### PDF Documents Collection:

```javascript
{
  _id: ObjectId,
  id: String,              // Custom ID for frontend
  title: String,           // Document title
  description: String,     // Optional description
  fileName: String,        // Original filename
  fileSize: Number,        // File size in bytes
  uploadDate: String,      // ISO date string
  fileUrl: String,         // API endpoint URL
  mimeType: String,        // MIME type
  gridfsId: ObjectId       // GridFS file ID
}
```

#### GridFS Storage:

- Files are stored in the `pdfFiles` bucket
- Each file has a unique ObjectId
- Metadata includes original filename, title, description, etc.

### 8. Security Considerations

- File size limit: 10MB
- Only PDF files are accepted
- CORS is enabled for development
- Files are served with appropriate headers

### 9. Troubleshooting

#### Common Issues:

1. **Connection Error**: Check MongoDB connection string and network access
2. **Upload Fails**: Verify file is PDF and under 10MB
3. **PDF Not Displaying**: Check if server is running on port 3001
4. **CORS Issues**: Ensure server is running and accessible

#### Debug Steps:

1. Check server logs for errors
2. Verify MongoDB connection in server console
3. Test API endpoints directly (e.g., `http://localhost:3001/api/health`)
4. Check browser network tab for failed requests

### 10. Production Deployment

For production deployment:

1. Update API_BASE_URL in `src/services/pdfAPI.ts`
2. Configure proper CORS settings
3. Set up environment variables for MongoDB connection
4. Use a reverse proxy (nginx) for serving files
5. Implement proper authentication and authorization

## Features

- ✅ PDF upload with validation
- ✅ MongoDB GridFS storage
- ✅ PDF metadata management
- ✅ PDF viewing with zoom/rotate controls
- ✅ File download functionality
- ✅ Storage usage tracking
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ Bilingual support (Arabic/English)
