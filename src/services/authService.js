const AuthService = {
  // Check authentication status
  checkAuthStatus: async () => {
    try {
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return { 
          success: true, 
          user: data.user 
        };
      } else {
        return { 
          success: false, 
          message: data.message || 'Không thể xác thực trạng thái đăng nhập' 
        };
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return { 
        success: false, 
        message: 'Lỗi kết nối đến server' 
      };
    }
  },

  // Login user
  login: async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return { 
          success: true, 
          user: data.user 
        };
      } else {
        return { 
          success: false, 
          message: data.message || 'Đăng nhập thất bại' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Lỗi kết nối đến server. Vui lòng thử lại sau.' 
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return { success: true };
      } else {
        console.error('Logout failed:', data.message);
        return { 
          success: false, 
          message: data.message || 'Đăng xuất thất bại' 
        };
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        message: 'Lỗi kết nối đến server' 
      };
    }
  }
};

export default AuthService; 