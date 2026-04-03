const Blueprint = require('../models/Blueprint');

// @desc    Search and filter blueprints
const searchBlueprints = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, validationScore, sortBy, page = 1, limit = 20 } = req.query;
    const filters = { status: 'published' };

    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    if (category) filters.category = category;
    if (validationScore) filters['validation.score'] = { $gte: Number(validationScore) };

    if (minPrice || maxPrice) {
      filters.pricing = {};
      if (minPrice) filters.pricing.$gte = Number(minPrice);
      if (maxPrice) filters.pricing.$lte = Number(maxPrice);
    }

    let query = Blueprint.find(filters);

    if (sortBy === 'newest') query = query.sort({ createdAt: -1 });
    else if (sortBy === 'price_low') query = query.sort({ pricing: 1 });
    else if (sortBy === 'price_high') query = query.sort({ pricing: -1 });
    else if (sortBy === 'rating') query = query.sort({ 'engagement.averageRating': -1 });
    else if (sortBy === 'validation') query = query.sort({ 'validation.score': -1 });

    const skip = (page - 1) * limit;
    const blueprints = await query
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'firstName lastName avatar metrics.rating');

    const total = await Blueprint.countDocuments(filters);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
      blueprints,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all blueprint categories
const getCategories = async (req, res) => {
  try {
    const categories = await Blueprint.distinct('category', { status: 'published' });
    const categoryStats = {};

    for (const category of categories) {
      categoryStats[category] = await Blueprint.countDocuments({ category, status: 'published' });
    }

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get trending blueprints
const getTrending = async (req, res) => {
  try {
    const blueprints = await Blueprint.find({ status: 'published' })
      .sort({ 'engagement.viewCount': -1 })
      .limit(10)
      .populate('author', 'firstName lastName avatar metrics.rating');

    res.json(blueprints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get personalized recommendations
const getRecommendations = async (req, res) => {
  try {
    const userBlueprints = await Blueprint.find({ author: req.user.userId });
    const userTags = new Set();
    userBlueprints.forEach((bp) => bp.tags.forEach((tag) => userTags.add(tag)));

    const recommendations = await Blueprint.find({
      status: 'published',
      author: { $ne: req.user.userId },
      tags: { $in: Array.from(userTags) },
    })
      .limit(10)
      .populate('author', 'firstName lastName avatar metrics.rating');

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Rate a blueprint
const rateBlueprint = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const blueprint = await Blueprint.findById(req.params.blueprintId);
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });

    const existingReview = blueprint.reviews.find(
      (r) => r.reviewer.toString() === req.user.userId
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment || '';
    } else {
      blueprint.reviews.push({ reviewer: req.user.userId, rating, comment: comment || '' });
    }

    const avgRating =
      blueprint.reviews.length > 0
        ? (blueprint.reviews.reduce((sum, r) => sum + r.rating, 0) / blueprint.reviews.length).toFixed(1)
        : 0;

    blueprint.engagement.averageRating = avgRating;
    await blueprint.save();

    res.json({ message: 'Rating saved successfully', blueprint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchBlueprints,
  getCategories,
  getTrending,
  getRecommendations,
  rateBlueprint,
};
