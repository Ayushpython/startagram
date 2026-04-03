const Blueprint = require('../models/Blueprint');
const User = require('../models/User');

// @desc    Create a new blueprint
const createBlueprint = async (req, res) => {
  try {
    const { title, description, category, content, pricing, isProtected, protectionLevel } = req.body;

    if (!title || !description || !category || !content || pricing === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const blueprint = new Blueprint({
      title,
      description,
      author: req.user.userId,
      category,
      content,
      pricing,
      isProtected: isProtected || false,
      protectionLevel: protectionLevel || 'none',
      status: 'draft',
    });

    await blueprint.save();

    const user = await User.findById(req.user.userId);
    user.metrics.blueprintsCreated += 1;
    await user.save();

    res.status(201).json({ message: 'Blueprint created successfully', blueprint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all published blueprints with filters
const getBlueprints = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, tags, search, sortBy } = req.query;
    const filters = { status: 'published' };

    if (category) filters.category = category;
    if (search) filters.$text = { $search: search };
    if (minPrice || maxPrice) {
      filters.pricing = {};
      if (minPrice) filters.pricing.$gte = Number(minPrice);
      if (maxPrice) filters.pricing.$lte = Number(maxPrice);
    }
    if (tags) filters.tags = { $in: tags.split(',') };

    let query = Blueprint.find(filters);

    if (sortBy === 'newest') query = query.sort({ createdAt: -1 });
    else if (sortBy === 'price_low') query = query.sort({ pricing: 1 });
    else if (sortBy === 'price_high') query = query.sort({ pricing: -1 });
    else if (sortBy === 'rating') query = query.sort({ 'engagement.averageRating': -1 });
    else if (sortBy === 'popular') query = query.sort({ 'engagement.viewCount': -1 });

    const blueprints = await query
      .populate('author', 'firstName lastName avatar metrics.rating')
      .limit(50);

    res.json({ count: blueprints.length, blueprints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single blueprint
const getBlueprint = async (req, res) => {
  try {
    const blueprint = await Blueprint.findByIdAndUpdate(
      req.params.id,
      { $inc: { 'engagement.viewCount': 1 } },
      { new: true }
    )
      .populate('author', 'firstName lastName avatar metrics.rating bio')
      .populate('reviews.reviewer', 'firstName lastName avatar');

    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });
    res.json(blueprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a blueprint
const updateBlueprint = async (req, res) => {
  try {
    const blueprint = await Blueprint.findById(req.params.id);
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });
    if (blueprint.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateFields = ['title', 'description', 'category', 'content', 'pricing', 'tags', 'isProtected', 'protectionLevel'];
    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) blueprint[field] = req.body[field];
    });

    blueprint.updatedAt = new Date();
    await blueprint.save();

    res.json({ message: 'Blueprint updated successfully', blueprint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a blueprint
const deleteBlueprint = async (req, res) => {
  try {
    const blueprint = await Blueprint.findById(req.params.id);
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });
    if (blueprint.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Blueprint.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blueprint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Publish a blueprint
const publishBlueprint = async (req, res) => {
  try {
    const blueprint = await Blueprint.findById(req.params.id);
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });
    if (blueprint.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    blueprint.status = 'published';
    await blueprint.save();

    res.json({ message: 'Blueprint published successfully', blueprint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all blueprints by an author
const getBlueprintsByAuthor = async (req, res) => {
  try {
    const blueprints = await Blueprint.find({
      author: req.params.authorId,
      status: 'published',
    }).populate('author', 'firstName lastName avatar');

    res.json({ count: blueprints.length, blueprints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBlueprint,
  getBlueprints,
  getBlueprint,
  updateBlueprint,
  deleteBlueprint,
  publishBlueprint,
  getBlueprintsByAuthor,
};
