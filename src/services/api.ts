// ForexKing API Service
const API_BASE_URL = "https://api.forexking.info"

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
  async signUp(userData: {
    name: string
    email: string
    password: string
  }): Promise<User> {
    const response = await apiRequest<{ user: User; token: string }>("/api/v1/users/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    // Store token in localStorage
    localStorage.setItem("forexking_token", response.token)
    return { ...response.user, token: response.token }
  },

  async signIn(credentials: {
    email: string
    password: string
  }): Promise<User> {
    const response = await apiRequest<{ user: User; token: string }>("/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    // Store token in localStorage
    localStorage.setItem("forexking_token", response.token)
    return { ...response.user, token: response.token }
  },

  async signOut(): Promise<void> {
    await apiRequest("/auth/signout", {
      method: "POST",
    })
    localStorage.removeItem("forexking_token")
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem("forexking_token")
    if (!token) return null

    try {
      // Decode JWT token to get user info (basic implementation)
      const payload = JSON.parse(atob(token.split(".")[1]))
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
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
