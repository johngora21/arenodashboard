// API Service for departments - Connected to Laravel Backend
const API_BASE_URL = 'http://localhost:8000/api';

export interface Department {
  id: string
  name: string
  branchId: string
  branchName: string
  code: string
  location: string
  description: string
  manager: string
  budget: number
  employeeCount: number
  status: "active" | "inactive" | "restructuring"
  createdAt: Date
  updatedAt: Date
}

export interface DepartmentStats {
  totalDepartments: number
  activeDepartments: number
  totalEmployees: number
  averageBudget: number
  departmentsByStatus: {
    active: number
    inactive: number
    restructuring: number
  }
  departmentsByBranch: Array<{
    branch_name: string
    count: number
  }>
  budgetDistribution: Array<{
    name: string
    budget: number
  }>
}

export const departmentsAPI = {
  async getAll(searchTerm?: string, status?: string): Promise<Department[]> {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (status) params.append('status', status);
      
      const response = await fetch(`${API_BASE_URL}/departments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  async getStats(): Promise<DepartmentStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/stats`);
      if (!response.ok) throw new Error('Failed to fetch department stats');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching department stats:', error);
      throw error;
    }
  },

  async create(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          name: department.name,
          branch_id: department.branchId,
          code: department.code,
          location: department.location,
          description: department.description,
          manager_id: department.manager,
          budget: department.budget,
          status: department.status
        })
      });
      
      if (!response.ok) throw new Error('Failed to create department');
      
      return await response.json();
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Department>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          name: updates.name,
          branch_id: updates.branchId,
          code: updates.code,
          location: updates.location,
          description: updates.description,
          manager_id: updates.manager,
          budget: updates.budget,
          status: updates.status
        })
      });
      
      if (!response.ok) throw new Error('Failed to update department');
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete department');
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  }
}

// Auth API Service - Connected to Laravel Backend
export const authAPI = {
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/password/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) throw new Error('Password reset request failed');
      
      return {
        success: true,
        message: 'Password reset link sent to your email'
      };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  async resetPassword(token: string, email: string, password: string, confirmPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const response = await fetch(`${API_BASE_URL}/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, email, password, password_confirmation: confirmPassword })
      });
      
      if (!response.ok) throw new Error('Password reset failed');
      
      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      localStorage.setItem('auth-token', data.token);
      
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;
      
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      localStorage.removeItem('auth-token');
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.removeItem('auth-token');
    }
  },

  async getCurrentUser(): Promise<any> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('No auth token');
      
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to get user');
      
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
}
