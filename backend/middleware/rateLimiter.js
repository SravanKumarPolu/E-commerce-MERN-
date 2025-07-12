// Rate limiter middleware to prevent brute force attacks
const loginAttempts = new Map();

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of loginAttempts.entries()) {
    if (now - value.lastAttempt > 15 * 60 * 1000) { // 15 minutes
      loginAttempts.delete(key);
    }
  }
}, 15 * 60 * 1000);

export const loginRateLimiter = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!loginAttempts.has(clientIP)) {
    loginAttempts.set(clientIP, {
      attempts: 0,
      lastAttempt: now,
      lockedUntil: 0
    });
  }
  
  const clientData = loginAttempts.get(clientIP);
  
  // Check if client is currently locked
  if (clientData.lockedUntil > now) {
    const remainingTime = Math.ceil((clientData.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      message: `Too many login attempts. Please try again in ${remainingTime} seconds.`
    });
  }
  
  // Reset attempts if last attempt was more than 15 minutes ago
  if (now - clientData.lastAttempt > 15 * 60 * 1000) {
    clientData.attempts = 0;
  }
  
  // Check if exceeded max attempts
  if (clientData.attempts >= 5) {
    clientData.lockedUntil = now + (10 * 60 * 1000); // Lock for 10 minutes
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 10 minutes.'
    });
  }
  
  // Increment attempts
  clientData.attempts++;
  clientData.lastAttempt = now;
  
  next();
};

export const resetLoginAttempts = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  if (loginAttempts.has(clientIP)) {
    loginAttempts.delete(clientIP);
  }
  next();
};

// Generic rate limiter for other endpoints
export const generalRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  // Clean up old entries
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requests.entries()) {
      if (now - value.windowStart > windowMs) {
        requests.delete(key);
      }
    }
  }, windowMs);
  
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(clientIP)) {
      requests.set(clientIP, {
        count: 0,
        windowStart: now
      });
    }
    
    const clientData = requests.get(clientIP);
    
    // Reset window if expired
    if (now - clientData.windowStart > windowMs) {
      clientData.count = 0;
      clientData.windowStart = now;
    }
    
    // Check if exceeded limit
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
    
    clientData.count++;
    next();
  };
}; 