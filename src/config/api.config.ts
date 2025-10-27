// API Configuration
// Central configuration for all API endpoints

// Environment variable support for Vite
const getEnvVar = (key: string, defaultValue: string): string => {
  // Check Vite env variables first (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteValue = import.meta.env[`VITE_${key}`]
    if (viteValue) return viteValue
  }
  
  // Check process.env (for some build tools)
  if (typeof process !== 'undefined' && process.env) {
    const processValue = process.env[`REACT_APP_${key}`] || process.env[`VITE_${key}`]
    if (processValue) return processValue
  }
  
  return defaultValue
}

// Main API Base URL
export const API_BASE_URL = getEnvVar('API_URL', 'https://apis.forexking.info')

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Health Check
  HEALTH: `${API_BASE_URL}/health`,
  
  // Authentication & User Management
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/v1/users/signup`,
    LOGIN: `${API_BASE_URL}/api/v1/users/login`,
    VERIFY_OTP: `${API_BASE_URL}/api/v1/users/verify-otp`,
    RESEND_OTP: `${API_BASE_URL}/api/v1/users/resend-otp`,
  },
  
  // Contact
  CONTACT: `${API_BASE_URL}/api/v1/contact`,
  
  // Deals Management (if implemented in backend)
  DEALS: {
    BASE: `${API_BASE_URL}/api/v1/deals`,
    GET_ALL: `${API_BASE_URL}/api/v1/deals`,
    CREATE: `${API_BASE_URL}/api/v1/deals`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/deals/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/deals/${id}`,
  },
  
  // Reports Management (if implemented in backend)
  REPORTS: {
    BASE: `${API_BASE_URL}/api/v1/reports`,
    GET_ALL: `${API_BASE_URL}/api/v1/reports`,
    GENERATE: `${API_BASE_URL}/api/v1/reports/generate`,
    EXPORT: (reportId: string, format = 'csv') => 
      `${API_BASE_URL}/api/v1/reports/${reportId}/export?format=${format}`,
    EXPORT_DEALS: (format = 'csv') => 
      `${API_BASE_URL}/api/v1/reports/deals/export?format=${format}`,
  },
  
  // PDF Management (if using separate PDF service or main API)
  // For now, pointing to main API - update if PDF service has different URL
  PDF: {
    BASE: `${API_BASE_URL}/api/v1/pdf`,
    UPLOAD: `${API_BASE_URL}/api/v1/pdf/upload`,
    UPLOAD_BASE64: `${API_BASE_URL}/api/v1/pdf/uploadBase64`,
    GET_ALL: `${API_BASE_URL}/api/v1/pdf/all`,
    GET_LATEST: `${API_BASE_URL}/api/v1/pdf/latest`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/pdf/${id}`,
    GET_BASE64: (id: string) => `${API_BASE_URL}/api/v1/pdf/${id}/base64`,
    DELETE: (id: string) => `${API_BASE_URL}/api/v1/pdf/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/v1/pdf/${id}`,
    STORAGE_INFO: `${API_BASE_URL}/api/v1/pdf/storage/info`,
    FILE: (gridfsId: string) => `${API_BASE_URL}/api/v1/pdf/file/${gridfsId}`,
  },
}

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
}

// CORS Configuration (for reference - handled by backend)
export const ALLOWED_ORIGINS = [
  'https://forexking.info',
  'http://localhost:5173',
  'http://localhost:3000',
]

export default API_BASE_URL

