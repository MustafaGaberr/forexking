// ForexKing API Service
const API_BASE_URL = "https://apis.forexking.info"

// Types for API responses
export interface User {
  id: string
  name: string
  email: string
  token?: string
}

export interface Deal {
  id: string
  clientName: string
  dealType: string
  amount: number
  profit: number
  date: string
  status: string
}

export interface Report {
  id: string
  title: string
  type: string
  data: any
  createdAt: string
}

// API Error handling
class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("forexking_token")

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(response.status, errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(0, "Network error or server unavailable")
  }
}

// Authentication API
export const authAPI = {
  // ✅ signUp - Register user and send OTP (no token yet)
  async signUp(userData: {
    name: string
    email: string
    password: string
    phoneNumber: string
  }): Promise<{ success: boolean; email: string; name: string }> {
    // تغير اسم المفتاح phoneNumber إلى phone_number
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phoneNumber, // ✅ بدلها هنا
    }
    const response = await apiRequest<any>("/api/v1/users/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    // Don't save token yet - need OTP verification first
    return {
      success: response.success,
      email: response.data.email,
      name: response.data.name,
    }
  },

  // ✅ signIn fixed according to actual API response
  async signIn(credentials: {
    email: string
    password: string
  }): Promise<User> {
    const response = await apiRequest<any>("/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    // Save token
    localStorage.setItem("forexking_token", response.accessToken)

    return {
      id: response.id,
      name: response.name,
      email: response.email,
      token: response.accessToken,
    }
  },

  // ✅ Verify OTP after registration
  async verifyOTP(data: {
    email: string
    otp: string
  }): Promise<User> {
    const response = await apiRequest<any>("/api/v1/users/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    })

    // Save token
    localStorage.setItem("forexking_token", response.accessToken)

    return {
      id: response.id,
      name: response.name,
      email: response.email,
      token: response.accessToken,
    }
  },

  // ✅ Resend OTP
  async resendOTP(data: { email: string }): Promise<void> {
    await apiRequest<any>("/api/v1/users/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // ✅ signOut simplified (no request needed)
  async signOut(): Promise<void> {
    localStorage.removeItem("forexking_token")
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem("forexking_token")
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return {
        id: payload.id?.toString() ?? "",
        name: payload.name ?? "",
        email: payload.email ?? "",
        token,
      }
    } catch {
      localStorage.removeItem("forexking_token")
      return null
    }
  },
}

// Deals API
export const dealsAPI = {
  async getDeals(): Promise<Deal[]> {
    return await apiRequest<Deal[]>("/deals")
  },

  async createDeal(dealData: Omit<Deal, "id" | "status">): Promise<Deal> {
    return await apiRequest<Deal>("/deals", {
      method: "POST",
      body: JSON.stringify(dealData),
    })
  },

  async updateDeal(id: string, dealData: Partial<Deal>): Promise<Deal> {
    return await apiRequest<Deal>(`/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify(dealData),
    })
  },

  async deleteDeal(id: string): Promise<void> {
    await apiRequest(`/deals/${id}`, {
      method: "DELETE",
    })
  },
}

// Reports API
export const reportsAPI = {
  async getReports(): Promise<Report[]> {
    return await apiRequest<Report[]>("/reports")
  },

  async generateReport(type: string, filters?: any): Promise<Report> {
    return await apiRequest<Report>("/reports/generate", {
      method: "POST",
      body: JSON.stringify({ type, filters }),
    })
  },

  async exportReport(reportId: string, format: "csv" | "excel" = "csv"): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("forexking_token")}`,
      },
    })

    if (!response.ok) {
      throw new APIError(response.status, "Failed to export report")
    }

    return await response.blob()
  },

  async exportDealsReport(filters?: any, format: "csv" | "excel" = "csv"): Promise<Blob> {
    const queryParams = new URLSearchParams({
      format,
      ...(filters && { filters: JSON.stringify(filters) }),
    })

    const response = await fetch(`${API_BASE_URL}/reports/deals/export?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("forexking_token")}`,
      },
    })

    if (!response.ok) {
      throw new APIError(response.status, "Failed to export deals report")
    }

    return await response.blob()
  },
}

export { APIError }
