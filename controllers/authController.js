const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

// JWT secret key - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }
    
    // Validate user credentials
    const user = await userModel.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// Check authentication status
const checkAuth = (req, res) => {
  try {
    // If middleware has set req.user, the user is authenticated
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication check' 
    });
  }
};

// Logout user
const logout = (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie('token');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout' 
    });
  }
};

module.exports = {
  login,
  checkAuth,
  logout
}; 