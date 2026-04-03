const Validation = require('../models/Validation');
const Blueprint = require('../models/Blueprint');

// @desc    Get validation score for a blueprint
const getValidation = async (req, res) => {
  try {
    const validation = await Validation.findOne({ blueprint: req.params.blueprintId });
    if (!validation) return res.status(404).json({ error: 'Validation not found for this blueprint' });
    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Generate AI validation for a blueprint
const generateValidation = async (req, res) => {
  try {
    const blueprint = await Blueprint.findById(req.params.blueprintId);
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' });
    if (blueprint.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let validation = await Validation.findOne({ blueprint: req.params.blueprintId });
    if (validation) {
      return res.status(400).json({ error: 'Validation already exists for this blueprint' });
    }

    // TODO: Integrate with OpenAI or other AI service
    const mockValidation = {
      overallScore: 7.8,
      scores: {
        marketDemand: 8.2,
        technicalFeasibility: 7.5,
        monetization: 7.3,
        competitiveAdvantage: 7.9,
        team: 7.6,
      },
      analysis: {
        summary: 'Strong market opportunity with good technical feasibility.',
        strengths: ['Clear target audience', 'Monetization model is well-defined', 'Competitive advantage is notable'],
        weaknesses: ['Market saturation concerns', 'Technical complexity might be underestimated'],
        opportunities: ['International expansion', 'Partnership with existing platforms'],
        risks: ['Market entry barriers', 'Technology obsolescence risk'],
      },
      flags: {
        highRisk: false,
        lowMarketDemand: false,
        technicalChallenges: true,
        overSaturated: false,
      },
      recommendations: [
        'Conduct competitive analysis before launch',
        'Invest in technical team expertise',
        'Validate market demand with user interviews',
      ],
    };

    validation = new Validation({ blueprint: req.params.blueprintId, ...mockValidation });
    await validation.save();

    blueprint.validation.score = mockValidation.overallScore;
    blueprint.validation.scoredAt = new Date();
    blueprint.validation.validationDetails = mockValidation.scores;
    await blueprint.save();

    res.status(201).json({ message: 'Validation generated successfully', validation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get market comparable companies
const getMarketComparables = async (req, res) => {
  try {
    // TODO: Fetch from external data source
    const comparables = [
      { company: 'OpenAI', fundingRaised: '$10B+', market: 'AI/ML' },
      { company: 'Stripe', fundingRaised: '$1B+', market: 'FinTech' },
      { company: 'Figma', fundingRaised: '$333M', market: 'Design Tools' },
    ];
    res.json(comparables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getValidation, generateValidation, getMarketComparables };
