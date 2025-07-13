import { v2 as cloudinary } from 'cloudinary';
import productModel from "../models/productModel.js";

// Add Product
const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, subCategory, color, bestseller } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category || !subCategory || !color) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check for uploaded images
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(item => item !== undefined);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required'
      });
    }

    // Upload images to Cloudinary
    let imagesUrl = [];
    try {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: 'image',
            folder: 'ecommerce/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          });
          return result.secure_url;
        })
      );
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Error uploading images'
      });
    }

    // Parse color array if it's a string
    let colorArray;
    try {
      colorArray = typeof color === "string" ? JSON.parse(color) : color;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid color format'
      });
    }

    // Create product data
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      subCategory: subCategory.trim(),
      color: colorArray,
      bestseller: bestseller === "true" || bestseller === true,
      image: imagesUrl,
      date: Date.now(),
      inStock: true,
      stockQuantity: 100 // Default stock quantity
    };

    // Create and save product
    const product = new productModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: product
    });

  } catch (error) {
    console.error('Add product error:', error);
    next(error);
  }
};

// Remove Product
const removeProduct = async (req, res, next) => {
  try {
    const { id } = req.body;

    // Check if product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Delete product images from Cloudinary
    try {
      if (product.image && product.image.length > 0) {
        await Promise.all(
          product.image.map(async (imageUrl) => {
            // Extract public_id from Cloudinary URL
            const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          })
        );
      }
    } catch (deleteError) {
      console.warn('Error deleting images from Cloudinary:', deleteError);
      // Continue with product deletion even if image deletion fails
    }

    // Delete product from database
    await productModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product removed successfully"
    });

  } catch (error) {
    console.error('Remove product error:', error);
    next(error);
  }
};

// List Products
const listProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, subCategory, inStock, bestseller, search } = req.query;

    // Build query object
    const query = {};
    
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (bestseller !== undefined) query.bestseller = bestseller === 'true';
    
    // Add text search if search query provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get products with pagination
    const products = await productModel.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await productModel.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNextPage: skip + products.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('List products error:', error);
    next(error);
  }
};

// Single Product
const singleProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Single product error:', error);
    next(error);
  }
};

// Update Product Stock
const updateProductStock = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Update stock
    await product.updateStock(parseInt(quantity));

    res.json({
      success: true,
      message: "Stock updated successfully",
      product: {
        id: product._id,
        name: product.name,
        stockQuantity: product.stockQuantity,
        inStock: product.inStock
      }
    });

  } catch (error) {
    console.error('Update stock error:', error);
    next(error);
  }
};

export { addProduct, singleProduct, removeProduct, listProducts, updateProductStock };