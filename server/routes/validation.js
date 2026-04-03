const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Validation = require('../models/Validation');
const Blueprint = require('../models/Blueprint');

const router = express.Router();

// @route   GET /api/validation/:blueprintId
// @desc    Get validation score and analysis for a blueprint
// @access  Public
router.get('/:blueprintId', async (req, res) => {
  try {
    const validation = await Validation.findOne({ blueprint: req.params.blueprintId });

    if (!validation) {
      return res.status(404).json({ error: 'Validation not found for this blueprint' });
    }

    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/validation/:blueprintId/generate
// @desc    Generate AI validation for a blueprint
// @access  Private
router.post('/:blueprintId/generate', authMiddleware, async (req, res) => {
  try {
    const blueprint = await Blueprint.findById(req.params.blueprintId);

    if (!blueprint) {
      return res.status(404).json({ error: 'Blueprint not found' });
    }

    if (blueprint.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if validation already exists
    let validation = await Validation.findOne({ blueprint: req.params.blueprintId });

    if (validation) {
      return res.status(400).json({ error: 'Validation already exists for this blueprint' });
    }

    // TODO: Integrate with OpenAI or other AI service to generate validation
    // For now, return mock validation
    const mockValidation = {
      overallScore: 7.8,
      scores: {
        marketDemand: 8.2,
        technicalFeasibility: 7.5,
        monetization: 7.3,
        competitiveAdvantage: 7.9,
        team: 7.6
      },
      analysis: {
        summary: 'Strong market opportunity with good technical feasibility.',
        strengths: [
          'Clear target audience',
          'Monetization model is well-defined',
          'Competitive advantage is notable'
        ],
        weaknesses: [
          'Market saturation concerns',
          'Technical complexity might be underestimated'
        ],
        opportunities: [
          'International expansion',
          'Partnership with existing platforms'
        ],
        risks: [
          'Market entry barriers',
          'Technology obsolescence risk'
        ]
      },
      flags: {
        highRisk: false,
        lowMarketDemand: false,
        technicalChallenges: true,
        overSaturated: false
      },
      recommendations: [
        'Conduct competitive analysis before launch',
        'Invest in technical team expertise',
        'Validate market demand with user interviews'
      ]
    };

    validation = new Validation({
      blueprint: req.params.blueprintId,
      ...mockValidation
    });

    await validation.save();

    // Update blueprint with validation score
    blueprint.validation.score = mockValidation.overallScore;
    blueprint.validation.scoredAt = new Date();
    blueprint.validation.validationDetails = mockValidation.scores;
    await blueprint.save();

    res.status(201).json({
      message: 'Validation generated successfully',
      validation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/validation/market-comparables
// @desc    Get market comparable companies
// @access  Public
router.get('/market-comparables', async (req, res) => {
  try {
    // TODO: Fetch from external data source
    const comparables = [
      {
        company: 'OpenAI',
        fundingRaised: '$10B+',
        market: 'AI/ML'
      },
      {
        company: 'Stripe',
        fundingRaised: '$1B+',
        market: 'FinTech'
      },
      {
        company: 'Figma',
        fundingRaised: '$333M',
        market: 'Design Tools'
      }
    ];

    res.json(comparables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
