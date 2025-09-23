const express = require('express');
const ClassCoupon = require('../models/ClassCoupon');

const router = express.Router();

// GET /members/:id/coupons - Get all coupons for a specific member
router.get('/:id/coupons', async (req, res) => {
  try {
    const { id } = req.params;
    const { active_only = 'true' } = req.query;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    
    const coupons = await ClassCoupon.findByMemberId(
      parseInt(id), 
      active_only === 'true'
    );
    
    res.json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    console.error('Error fetching member coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /members/:id/coupon-summary - Get coupon summary for a member
router.get('/:id/coupon-summary', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    
    const summary = await ClassCoupon.getMemberCouponSummary(parseInt(id));
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching member coupon summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;