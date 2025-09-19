// Express server for PDF API endpoints
import express from 'express';
import multer from 'multer';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import googleDriveService from './src/services/googleDriveService.js';
import googleDriveOAuth from './src/services/googleDriveOAuth.js';
import { google } from 'googleapis';
import fs from 'fs';

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

// OAuth2 setup
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

let oAuth2Client;

// Initialize OAuth2 client
function initializeOAuth() {
    try {
        if (fs.existsSync(CREDENTIALS_PATH)) {
            // Read file and remove BOM if present
            let fileContent = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
            // Remove BOM (Byte Order Mark) if present
            if (fileContent.charCodeAt(0) === 0xFEFF) {
                fileContent = fileContent.slice(1);
            }

            const credentials = JSON.parse(fileContent);

            // Check if credentials structure is valid
            if (!credentials.installed) {
                console.log('⚠️  Invalid credentials.json structure. Expected "installed" property.');
                console.log('   For now, using MongoDB GridFS as fallback storage.');
                return;
            }

            const { client_id, client_secret, redirect_uris } = credentials.installed;

            // Check if credentials are placeholder values
            if (client_id === 'YOUR_CLIENT_ID.apps.googleusercontent.com' ||
                client_secret === 'YOUR_CLIENT_SECRET') {
                console.log('⚠️  OAuth2 credentials are placeholder values. Please update credentials.json with real values from Google Cloud Console.');
                console.log('   For now, using MongoDB GridFS as fallback storage.');
                return;
            }

            oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            if (fs.existsSync(TOKEN_PATH)) {
                let tokenContent = fs.readFileSync(TOKEN_PATH, 'utf8');
                // Remove BOM if present
                if (tokenContent.charCodeAt(0) === 0xFEFF) {
                    tokenContent = tokenContent.slice(1);
                }
                const token = JSON.parse(tokenContent);
                oAuth2Client.setCredentials(token);
                console.log('✅ OAuth2 client initialized with existing token');
            } else {
                console.log('⚠️  OAuth2 client initialized, but no token found. Run getToken.js first.');
                console.log('   For now, using MongoDB GridFS as fallback storage.');
            }
        } else {
            console.log('⚠️  No credentials.json found. Please create it first.');
            console.log('   For now, using MongoDB GridFS as fallback storage.');
        }
    } catch (error) {
        console.error('❌ Error initializing OAuth2:', error.message);
        console.log('   For now, using MongoDB GridFS as fallback storage.');
    }
}

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
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080',
            'http://localhost:8081'
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
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

// Handle OPTIONS request for PDF file endpoint
app.options('/api/pdf/file/:gridfsId', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.status(200).end();
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

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');

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

// Google Drive Upload API
app.post('/api/uploadPdf', upload.single('file'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        console.log('Uploading PDF to Google Drive using OAuth:', {
            title,
            fileName,
            fileSize: fileBuffer.length
        });

        if (!oAuth2Client) {
            throw new Error('OAuth2 client not initialized. Please run getToken.js first.');
        }

        // Create Drive service
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        // Convert buffer to stream
        const { Readable } = await import('stream');
        const stream = new Readable();
        stream.push(fileBuffer);
        stream.push(null);

        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: ['16oaJPbcdwRp5ox7Aq8iRm3sYogaCmtYE'], // Specific folder
            },
            media: {
                mimeType: 'application/pdf',
                body: stream,
            },
            fields: 'id,name,webViewLink,webContentLink,size,createdTime',
        });

        // Make the file public
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const uploadedFile = response.data;

        // Save to MongoDB
        const document = {
            id: generateId(), // Add unique id field
            title: title || fileName,
            description: description || '',
            fileName: uploadedFile.name,
            fileSize: parseInt(uploadedFile.size) || fileBuffer.length,
            fileUrl: uploadedFile.webViewLink,
            driveFileId: uploadedFile.id,
            uploadDate: new Date(),
            storageType: 'googleDrive'
        };

        const result = await db.collection(COLLECTION_NAME).insertOne(document);

        res.json({
            success: true,
            document: {
                id: result.insertedId,
                title: document.title,
                description: document.description,
                fileName: document.fileName,
                fileSize: document.fileSize,
                fileUrl: document.fileUrl,
                driveFileId: document.driveFileId,
                uploadDate: document.uploadDate
            }
        });
    } catch (err) {
        console.error('Upload error:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
            status: err.status
        });
        res.status(500).json({
            success: false,
            error: 'Failed to upload PDF',
            details: err.message
        });
    }
});

// Get latest PDF from Google Drive
app.get('/api/latestPdf', async (req, res) => {
    try {
        const document = await db.collection(COLLECTION_NAME)
            .findOne({}, { sort: { uploadDate: -1 } });

        if (!document) {
            return res.status(404).json({ success: false, error: 'No PDF found' });
        }

        res.json({
            success: true,
            document: {
                id: document.id,
                title: document.title,
                fileName: document.fileName,
                fileSize: document.fileSize,
                fileUrl: document.fileUrl,
                driveFileId: document.driveFileId,
                uploadDate: document.uploadDate
            }
        });
    } catch (error) {
        console.error('Get latest PDF error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch latest PDF' });
    }
});

// Delete PDF from Google Drive and MongoDB
app.delete('/api/deletePdf/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get document from MongoDB - try both id and _id
        let document = await db.collection(COLLECTION_NAME).findOne({ id });
        if (!document) {
            // Try with _id if id field not found
            try {
                const objectId = new ObjectId(id);
                document = await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
            } catch (objectIdError) {
                // If not a valid ObjectId, document is not found
            }
        }

        if (!document) {
            return res.status(404).json({ success: false, error: 'PDF not found' });
        }

        // Delete from Google Drive (if OAuth is available and has proper scopes)
        if (document.driveFileId && oAuth2Client) {
            try {
                const drive = google.drive({ version: 'v3', auth: oAuth2Client });

                // First check if we have permission to delete the file
                try {
                    await drive.files.get({ fileId: document.driveFileId, fields: 'id,permissions' });
                } catch (getError) {
                    console.log('Cannot access Google Drive file, skipping deletion:', getError.message);
                    console.log('File will remain in Google Drive but will be removed from database.');
                }

                // Attempt to delete from Google Drive
                await drive.files.delete({ fileId: document.driveFileId });
                console.log('Successfully deleted from Google Drive:', document.driveFileId);
            } catch (driveError) {
                console.error('Error deleting from Google Drive:', driveError.message);
                console.log('File will remain in Google Drive but will be removed from database.');
                // Continue with MongoDB deletion even if Google Drive fails
            }
        } else if (document.driveFileId) {
            console.log('Google Drive file exists but OAuth not available. File will remain in Google Drive.');
        }

        // Delete from MongoDB
        console.log('Attempting to delete document with id:', id);
        console.log('Document found:', document);

        // Build delete query based on document structure
        let deleteQuery;
        if (document.id) {
            deleteQuery = { id: id };
        } else {
            deleteQuery = { _id: document._id };
        }

        const deleteResult = await db.collection(COLLECTION_NAME).deleteOne(deleteQuery);

        console.log('Delete result:', deleteResult);

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'PDF not found in database' });
        }

        res.json({ success: true, message: 'PDF deleted successfully' });
    } catch (error) {
        console.error('Delete PDF error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete PDF' });
    }
});

// Get all PDFs
app.get('/api/allPdfs', async (req, res) => {
    try {
        const documents = await db.collection(COLLECTION_NAME)
            .find({})
            .sort({ uploadDate: -1 })
            .toArray();

        res.json({
            success: true,
            documents: documents.map(doc => ({
                id: doc.id || doc._id, // Use id field or fallback to _id
                title: doc.title,
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                fileUrl: doc.fileUrl,
                driveFileId: doc.driveFileId,
                uploadDate: doc.uploadDate
            }))
        });
    } catch (error) {
        console.error('Get all PDFs error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch PDFs' });
    }
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

// Fix missing id fields in existing documents
app.post('/api/debug/fix-ids', async (req, res) => {
    try {
        const documents = await db.collection(COLLECTION_NAME).find({ id: { $exists: false } }).toArray();
        let fixed = 0;

        for (const doc of documents) {
            await db.collection(COLLECTION_NAME).updateOne(
                { _id: doc._id },
                { $set: { id: generateId() } }
            );
            fixed++;
        }

        res.json({ success: true, fixed, total: documents.length });
    } catch (error) {
        console.error('Fix IDs error:', error);
        res.status(500).json({ success: false, error: 'Failed to fix IDs' });
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
    initializeOAuth();

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
