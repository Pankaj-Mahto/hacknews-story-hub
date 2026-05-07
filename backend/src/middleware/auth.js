import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token. User not found.' 
        });
      }

      req.user = user;
      next();
    } catch (tokenError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication.' 
    });
  }
};
