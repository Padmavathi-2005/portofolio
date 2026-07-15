import * as adminService from './admin.service.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const { admin, token } = await adminService.authenticateAdmin(username, password);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      admin,
      token
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    // If the middleware passed, req.admin is populated
    return res.status(200).json({
      success: true,
      message: 'Authenticated',
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};
