import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import emailService from './emailService.js';

class SocialAuthService {
  constructor() {
    this.isEnabled = process.env.ENABLE_SOCIAL_LOGIN === 'true';
    this.initializePassport();
  }

  initializePassport() {
    if (!this.isEnabled) return;

    // Google OAuth Strategy
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email']
      }, this.handleGoogleCallback.bind(this)));
    }

    // Facebook OAuth Strategy
    if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
      passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
      }, this.handleFacebookCallback.bind(this)));
    }

    // Serialize user for session
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  async handleGoogleCallback(accessToken, refreshToken, profile, done) {
    try {
      const { id, displayName, emails, photos } = profile;
      
      if (!emails || emails.length === 0) {
        return done(new Error('Email is required for registration'), null);
      }

      const email = emails[0].value;
      const avatar = photos && photos.length > 0 ? photos[0].value : null;

      const userData = {
        name: displayName,
        email: email.toLowerCase(),
        googleId: id,
        avatar,
        emailVerified: true,
        isActive: true,
        role: 'user',
        socialLogin: {
          provider: 'google',
          providerId: id,
          lastLogin: new Date()
        }
      };

      const user = await this.findOrCreateUser(userData);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }

  async handleFacebookCallback(accessToken, refreshToken, profile, done) {
    try {
      const { id, displayName, photos, emails } = profile;
      
      if (!emails || emails.length === 0) {
        return done(new Error('Email is required for registration'), null);
      }

      const email = emails[0].value;
      const avatar = photos && photos.length > 0 ? photos[0].value : null;

      const userData = {
        name: displayName,
        email: email.toLowerCase(),
        facebookId: id,
        avatar,
        emailVerified: true,
        isActive: true,
        role: 'user',
        socialLogin: {
          provider: 'facebook',
          providerId: id,
          lastLogin: new Date()
        }
      };

      const user = await this.findOrCreateUser(userData);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }

  async findOrCreateUser(userData) {
    try {
      // Check if user exists by email
      let user = await User.findOne({ email: userData.email });

      if (user) {
        // Update existing user with social login info
        user.socialLogin = userData.socialLogin;
        user.lastLogin = new Date();
        
        // Update avatar if not already set
        if (!user.avatar && userData.avatar) {
          user.avatar = userData.avatar;
        }
        
        await user.save();
        return user;
      }

      // Create new user
      const newUser = new User(userData);
      await newUser.save();
      
      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(newUser.email, newUser.name);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError.message);
      }

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        socialLogin: user.socialLogin
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  getAuthUrls() {
    const urls = {};
    
    if (process.env.GOOGLE_CLIENT_ID) {
      urls.google = `/api/auth/google`;
    }
    
    if (process.env.FACEBOOK_APP_ID) {
      urls.facebook = `/api/auth/facebook`;
    }
    
    return urls;
  }

  getEnabledProviders() {
    const providers = [];
    
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push('google');
    }
    
    if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
      providers.push('facebook');
    }
    
    return providers;
  }

  async linkSocialAccount(userId, provider, providerId, profile) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if social account is already linked to another user
      const existingUser = await User.findOne({
        $or: [
          { googleId: providerId },
          { facebookId: providerId }
        ]
      });

      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error('This social account is already linked to another user');
      }

      // Update user with social login info
      if (provider === 'google') {
        user.googleId = providerId;
      } else if (provider === 'facebook') {
        user.facebookId = providerId;
      }

      user.socialLogin = {
        provider,
        providerId,
        linkedAt: new Date(),
        lastLogin: new Date()
      };

      // Update avatar if not already set
      if (!user.avatar && profile.photos && profile.photos.length > 0) {
        user.avatar = profile.photos[0].value;
      }

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async unlinkSocialAccount(userId, provider) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (provider === 'google') {
        user.googleId = undefined;
      } else if (provider === 'facebook') {
        user.facebookId = undefined;
      }

      user.socialLogin = undefined;
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getSocialAccounts(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const accounts = [];
      
      if (user.googleId) {
        accounts.push({
          provider: 'google',
          providerId: user.googleId,
          linkedAt: user.socialLogin?.linkedAt,
          lastLogin: user.socialLogin?.lastLogin
        });
      }
      
      if (user.facebookId) {
        accounts.push({
          provider: 'facebook',
          providerId: user.facebookId,
          linkedAt: user.socialLogin?.linkedAt,
          lastLogin: user.socialLogin?.lastLogin
        });
      }
      
      return accounts;
    } catch (error) {
      throw error;
    }
  }

  validateProvider(provider) {
    const validProviders = ['google', 'facebook'];
    return validProviders.includes(provider);
  }

  async handleSocialLoginError(error) {
    console.error('Social login error:', error);
    
    const errorMessages = {
      'Email is required for registration': 'Email access is required for registration. Please allow email access and try again.',
      'This social account is already linked to another user': 'This social account is already linked to another user account.',
      'User not found': 'User account not found.',
      'Invalid provider': 'Invalid social login provider.'
    };

    return {
      success: false,
      message: errorMessages[error.message] || 'Social login failed. Please try again.',
      error: error.message
    };
  }

  // Middleware for protecting routes that require social login
  requireSocialAuth(provider) {
    return (req, res, next) => {
      if (!this.validateProvider(provider)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid social login provider'
        });
      }

      passport.authenticate(provider, { session: false }, (err, user, info) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: err.message
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: info?.message || 'User not found'
          });
        }

        req.user = user;
        next();
      })(req, res, next);
    };
  }

  // Get passport instance for use in routes
  getPassport() {
    return passport;
  }

  // Check if social login is enabled
  isEnabled() {
    return this.isEnabled;
  }

  // Get configuration status
  getConfigStatus() {
    return {
      enabled: this.isEnabled,
      google: {
        enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        clientId: process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
      },
      facebook: {
        enabled: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
        appId: process.env.FACEBOOK_APP_ID ? 'Configured' : 'Not configured',
        callbackUrl: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback'
      }
    };
  }
}

export default new SocialAuthService(); 