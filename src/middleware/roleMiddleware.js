const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  if (req.user.role !== role) {
    return res.status(403).json({
      message: `Akses ditolak. Hanya ${role} yang dapat mengakses endpoint ini.`
    });
  }

  next();
};

module.exports = requireRole;