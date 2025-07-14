import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import validator from 'validator';

// JWT token creation with expiration
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Route for user login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password field
    const user = await userModel.findOne({ email, isActive: true }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Create token
    const token = createToken(user._id);
    
    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Route for user registration
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Additional server-side validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12); // Increased salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Update last login
    await savedUser.updateLastLogin();

    // Create token
    const token = createToken(savedUser._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    next(error);
  }
};

// Route for admin login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "Admin configuration error"
      });
    }

    // Check credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { 
          email: email, 
          role: 'admin',
          type: 'admin' 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Shorter expiration for admin
      );
      
      res.json({ 
        success: true, 
        token,
        user: {
          email: email,
          role: 'admin'
        }
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }

  } catch (error) {
    console.error('Admin login error:', error);
    next(error);
  }
};

// Route to get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

// Route to update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long"
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

// Add delivery address to user
export const addUserAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;
    if (!firstName || !lastName || !email || !street || !city || !state || !zipcode || !country || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    user.addresses.push({ firstName, lastName, email, street, city, state, zipcode, country, phone });
    await user.save();
    res.status(201).json({ success: true, message: 'Address added to user.', addresses: user.addresses });
  } catch (error) {
    console.error('Add user address error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export { adminLogin, loginUser, registerUser, getUserProfile, updateUserProfile };