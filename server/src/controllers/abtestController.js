import abTestingService from '../services/abTestingService.js';

export const getTestVariant = async (req, res) => {
  const { testName } = req.params;
  const { userId, sessionId } = req.query;

  try {
    const variant = await abTestingService.getVariantForUser(testName, userId, sessionId);
    if (variant) {
      res.json({ success: true, variant });
    } else {
      res.status(404).json({ success: false, message: 'Test not found or not active' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting A/B test variant' });
  }
};