// Express server for PDF API endpoints
import express from 'express';
import multer from 'multer';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://gabourhostinger1_db_user:IB0MYgjC8LeP7n9P@cluster0.delec68.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'pdfViewer';
const COLLECTION_NAME = 'pdfDocuments';

let client;
let db;
let bucket;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        bucket = new GridFSBucket(db, { bucketName: 'pdfFiles' });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// API Routes

// Upload PDF
app.post('/api/pdf/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, error: 'Title is required' });
        }

        // Generate unique filename
        const fileId = new ObjectId();
        const fileName = `${fileId.toString()}_${req.file.originalname}`;

        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(fileName, {
            metadata: {
                originalName: req.file.originalname,
                title,
                description,
                mimeType: req.file.mimetype,
                uploadDate: new Date().toISOString()
            }
        });

        uploadStream.write(req.file.buffer);
        uploadStream.end();

        // Wait for upload to complete and get the actual file ID
        const actualFileId = await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => {
                resolve(uploadStream.id);
            });
            uploadStream.on('error', reject);
        });

        // Create document record
        const document = {
            id: generateId(),
            title,
            description,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            uploadDate: new Date().toISOString(),
            fileUrl: `/api/pdf/file/${actualFileId.toString()}`,
            mimeType: req.file.mimetype,
            gridfsId: actualFileId
        };

        // Save document metadata to collection
        await db.collection(COLLECTION_NAME).insertOne(document);

        res.json({ success: true, document });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: 'Failed to upload PDF' });
    }
});

// Get all PDFs
app.get('/api/pdf/all', async (req, res) => {
    try {
        const documents = await db.collection(COLLECTION_NAME)
            .find({})
            .sort({ uploadDate: -1 })
            .toArray();

        res.json({ success: true, documents });
    } catch (error) {
        console.error('Get all PDFs error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch PDFs' });
    }
});

// Get latest PDF
app.get('/api/pdf/latest', async (req, res) => {
    try {
        const document = await db.collection(COLLECTION_NAME)
            .findOne({}, { sort: { uploadDate: -1 } });

        res.json({ success: true, document });
    } catch (error) {
        console.error('Get latest PDF error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch latest PDF' });
    }
});

// Get PDF by ID
app.get('/api/pdf/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const document = await db.collection(COLLECTION_NAME)
            .findOne({ id });

        if (!document) {
            return res.status(404).json({ success: false, error: 'PDF not found' });
        }

        res.json({ success: true, document });
    } catch (error) {
        console.error('Get PDF by ID error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch PDF' });
    }
});

// Serve PDF file
app.get('/api/pdf/file/:gridfsId', async (req, res) => {
    try {
        const { gridfsId } = req.params;
        const objectId = new ObjectId(gridfsId);

        // Get file metadata first
        const files = await bucket.find({ _id: objectId }).toArray();
        if (files.length === 0) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        const file = files[0];
        const filename = file.metadata?.originalName || file.filename || 'document.pdf';

        // Set appropriate headers for inline display
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('X-Content-Type-Options', 'nosniff');

        // Stream the file
        const downloadStream = bucket.openDownloadStream(objectId);
        downloadStream.pipe(res);

        downloadStream.on('error', (error) => {
            console.error('Download stream error:', error);
            if (!res.headersSent) {
                res.status(404).json({ success: false, error: 'File not found' });
            }
        });
    } catch (error) {
        console.error('Serve PDF file error:', error);
        res.status(500).json({ success: false, error: 'Failed to serve PDF file' });
    }
});

// Delete PDF
app.delete('/api/pdf/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get document to find GridFS ID
        const document = await db.collection(COLLECTION_NAME)
            .findOne({ id });

        if (!document) {
            return res.status(404).json({ success: false, error: 'PDF not found' });
        }

        // Delete from GridFS
        if (document.gridfsId) {
            await bucket.delete(new ObjectId(document.gridfsId));
        }

        // Delete from collection
        const result = await db.collection(COLLECTION_NAME)
            .deleteOne({ id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'PDF not found' });
        }

        res.json({ success: true, message: 'PDF deleted successfully' });
    } catch (error) {
        console.error('Delete PDF error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete PDF' });
    }
});

// Update PDF metadata
app.put('/api/pdf/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const result = await db.collection(COLLECTION_NAME)
            .updateOne(
                { id },
                { $set: { title, description, updatedAt: new Date().toISOString() } }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: 'PDF not found' });
        }

        res.json({ success: true, message: 'PDF updated successfully' });
    } catch (error) {
        console.error('Update PDF error:', error);
        res.status(500).json({ success: false, error: 'Failed to update PDF' });
    }
});

// Get storage info
app.get('/api/pdf/storage/info', async (req, res) => {
    try {
        const count = await db.collection(COLLECTION_NAME).countDocuments();
        const docs = await db.collection(COLLECTION_NAME)
            .find({}, { projection: { fileSize: 1 } })
            .toArray();

        const totalSize = docs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

        res.json({ success: true, count, totalSize });
    } catch (error) {
        console.error('Get storage info error:', error);
        res.status(500).json({ success: false, error: 'Failed to get storage info' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'PDF API server is running' });
});

// Debug endpoint to check GridFS files
app.get('/api/debug/gridfs', async (req, res) => {
    try {
        const files = await bucket.find({}).toArray();
        res.json({ success: true, files: files.map(f => ({ id: f._id, filename: f.filename, uploadDate: f.uploadDate })) });
    } catch (error) {
        console.error('GridFS debug error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch GridFS files' });
    }
});

// Fix existing documents with correct GridFS IDs
app.post('/api/debug/fix-documents', async (req, res) => {
    try {
        const documents = await db.collection(COLLECTION_NAME).find({}).toArray();
        const gridfsFiles = await bucket.find({}).toArray();

        let fixed = 0;
        for (const doc of documents) {
            // Find matching GridFS file by filename pattern
            const matchingFile = gridfsFiles.find(f =>
                f.filename.includes(doc.fileName) ||
                f.metadata?.originalName === doc.fileName
            );

            if (matchingFile && doc.gridfsId.toString() !== matchingFile._id.toString()) {
                await db.collection(COLLECTION_NAME).updateOne(
                    { _id: doc._id },
                    {
                        $set: {
                            gridfsId: matchingFile._id,
                            fileUrl: `/api/pdf/file/${matchingFile._id}`
                        }
                    }
                );
                fixed++;
            }
        }

        res.json({ success: true, fixed, total: documents.length });
    } catch (error) {
        console.error('Fix documents error:', error);
        res.status(500).json({ success: false, error: 'Failed to fix documents' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ success: false, error: error.message });
});

// Start server
async function startServer() {
    await connectToMongoDB();

    app.listen(PORT, () => {
        console.log(`PDF API server running on port ${PORT}`);
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    if (client) {
        await client.close();
    }
    process.exit(0);
});

startServer().catch(console.error);
