import userModel from '../models/userModel.js';

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, color } = req.body;
    
    if (!userId || !itemId || !color) {
      return res.status(400).json({
        success: false,
        message: 'userId, itemId, and color are required'
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let cartData = userData.cartData || {};
    
    // Initialize product in cart if doesn't exist
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    
    // Add or increment quantity for the color
    cartData[itemId][color] = (cartData[itemId][color] || 0) + 1;
    
    // Update user's cart data in database
    await userModel.findByIdAndUpdate(userId, { cartData });
    
    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cartData
    });
    
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, itemId, color, quantity } = req.body;
    
    if (!userId || !itemId || !color || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'userId, itemId, color, and quantity are required'
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let cartData = userData.cartData || {};
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      if (cartData[itemId] && cartData[itemId][color]) {
        delete cartData[itemId][color];
        // Remove product entry if no colors left
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      // Update quantity
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][color] = quantity;
    }
    
    // Update user's cart data in database
    await userModel.findByIdAndUpdate(userId, { cartData });
    
    res.json({
      success: true,
      message: 'Cart updated successfully',
      cartData
    });
    
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      cartData: userData.cartData || {}
    });
    
  } catch (error) {
    console.error('Get user cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export { addToCart, updateCart, getUserCart }