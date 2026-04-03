const Comment = require('../models/Comment');
const Blueprint = require('../models/Blueprint');

// @desc    Create a comment on a blueprint
const createComment = async (req, res) => {
  try {
    const { blueprintId, content, visibility, parentCommentId } = req.body;

    if (!blueprintId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const blueprint = await Blueprint.findById(blueprintId);
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });

    const comment = new Comment({
      author: req.user.userId,
      blueprint: blueprintId,
      content,
      visibility: visibility || 'public',
      parentComment: parentCommentId || null,
    });

    await comment.save();

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: comment._id } });
    }

    blueprint.engagement.commentCount += 1;
    await blueprint.save();

    await comment.populate('author', 'firstName lastName avatar metrics.rating');

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all comments for a blueprint
const getCommentsByBlueprint = async (req, res) => {
  try {
    const comments = await Comment.find({
      blueprint: req.params.blueprintId,
      parentComment: null,
      visibility: 'public',
    })
      .populate('author', 'firstName lastName avatar metrics.rating')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'firstName lastName avatar' },
      })
      .sort({ createdAt: -1 });

    res.json({ count: comments.length, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a comment
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Comment.deleteOne({ _id: req.params.id });

    const blueprint = await Blueprint.findById(comment.blueprint);
    blueprint.engagement.commentCount = Math.max(0, blueprint.engagement.commentCount - 1);
    await blueprint.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Like a comment
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (!comment.likes.includes(req.user.userId)) {
      comment.likes.push(req.user.userId);
    }
    await comment.save();

    res.json({ message: 'Comment liked', likeCount: comment.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByBlueprint,
  updateComment,
  deleteComment,
  likeComment,
};
