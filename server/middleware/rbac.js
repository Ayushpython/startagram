module.exports = {
  // Role-based validation
  isCreator: (req, res, next) => {
    if (req.user?.role !== 'creator' && req.user?.role !== 'both') {
      return res.status(403).json({ error: 'Access denied - Creator role required' });
    }
    next();
  },

  isBuilder: (req, res, next) => {
    if (req.user?.role !== 'builder' && req.user?.role !== 'both') {
      return res.status(403).json({ error: 'Access denied - Builder role required' });
    }
    next();
  },

  // Resource ownership check
  isOwner: (ownerField) => (req, res, next) => {
    if (req.params[ownerField] !== req.user?.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  }
};
