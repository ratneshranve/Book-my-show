/**
 * Role-based middleware
 * Structure ready for JWT integration.
 * For now, role is passed via x-user-role header (dev mode).
 */
const isAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin only' });
  }
  next();
};

const isUser = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (!role || (role !== 'user' && role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Access denied: Authentication required' });
  }
  next();
};

module.exports = { isAdmin, isUser };
