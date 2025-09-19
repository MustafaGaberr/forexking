import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GoogleDriveService {
    constructor() {
        this.drive = null;
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            // Load service account credentials
            const credentialsPath = path.join(__dirname, 'pdfviewer-472517-d1d6e1e42371.json');
            console.log('Loading credentials from:', credentialsPath);

            const fs = await import('fs');

            // Check if file exists
            if (!fs.existsSync(credentialsPath)) {
                throw new Error(`Credentials file not found at: ${credentialsPath}`);
            }

            const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
            console.log('Credentials loaded successfully');

            // Create JWT auth client
            const auth = new google.auth.JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: ['https://www.googleapis.com/auth/drive']
            });

            // Test authentication
            console.log('Testing Google Drive authentication...');
            await auth.authorize();
            console.log('Google Drive authentication successful');

            // Initialize drive instance
            this.drive = google.drive({ version: 'v3', auth });
            console.log('Google Drive service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Google Drive service:', error);
            if (error.code === 'ENOENT') {
                console.error('Credentials file not found. Please check the file path and ensure the JSON file exists.');
            } else if (error instanceof SyntaxError) {
                console.error('Invalid JSON format in credentials file. Please check the file content.');
            } else {
                console.error('Authentication error:', error.message);
            }
            throw error;
        }
    }

    async uploadPDF(fileBuffer, fileName, mimeType = 'application/pdf') {
        try {
            if (!this.drive) {
                await this.initializeAuth();
            }

            // Convert Buffer to Readable stream
            const { Readable } = await import('stream');
            const stream = new Readable();
            stream.push(fileBuffer);
            stream.push(null); // End the stream

            // Upload file to Google Drive
            const response = await this.drive.files.create({
                requestBody: {
                    name: fileName,
                    parents: [], // Use root folder for now
                    supportsAllDrives: true, // Enable shared drives support
                },
                media: {
                    mimeType: mimeType,
                    body: stream, // Use stream instead of buffer
                },
                fields: 'id,name,webViewLink,webContentLink,size,createdTime',
                supportsAllDrives: true, // Enable shared drives support
            });

            // Make the file public
            await this.drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            console.log('PDF uploaded to Google Drive:', response.data.name);
            return {
                id: response.data.id,
                name: response.data.name,
                webViewLink: response.data.webViewLink,
                webContentLink: response.data.webContentLink,
                size: response.data.size,
                createdTime: response.data.createdTime,
            };
        } catch (error) {
            console.error('Error uploading PDF to Google Drive:', error);
            throw error;
        }
    }

    async deletePDF(fileId) {
        try {
            if (!this.drive) {
                await this.initializeAuth();
            }

            await this.drive.files.delete({
                fileId: fileId,
            });

            console.log('PDF deleted from Google Drive:', fileId);
            return true;
        } catch (error) {
            console.error('Error deleting PDF from Google Drive:', error);
            throw error;
        }
    }

    async getFileInfo(fileId) {
        try {
            if (!this.drive) {
                await this.initializeAuth();
            }

            const response = await this.drive.files.get({
                fileId: fileId,
                fields: 'id,name,webViewLink,webContentLink,size,createdTime',
            });

            return response.data;
        } catch (error) {
            console.error('Error getting file info from Google Drive:', error);
            throw error;
        }
    }
}

export default new GoogleDriveService();
