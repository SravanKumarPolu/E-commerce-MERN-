import { FormEvent, useState } from "react";
import { useShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [currentState, setCurrentState] = useState<string>("Login");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
  // Field validation states
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const { loginUser, registerUser, isLoggedIn } = useShopContext();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Clear error when switching between login/signup
  useEffect(() => {
    setError("");
    setSuccess("");
    setFieldErrors({ name: "", email: "", password: "" });
  }, [currentState]);

  // Real-time validation functions
  const validateName = (name: string) => {
    if (currentState !== "Sign Up") return "";
    if (name.length === 0) return "";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email: string) => {
    if (email.length === 0) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePasswordField = (password: string) => {
    if (currentState !== "Sign Up") return "";
    if (password.length === 0) return "";
    
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    if (!minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return "Password must meet all requirements";
    }
    
    return "";
  };

  // Handle field changes with validation
  const handleNameChange = (value: string) => {
    setName(value);
    setFieldErrors(prev => ({ ...prev, name: validateName(value) }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setFieldErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setFieldErrors(prev => ({ ...prev, password: validatePasswordField(value) }));
  };

  // Password validation for signup
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        minLength: !minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumbers: !hasNumbers,
        hasSpecialChar: !hasSpecialChar
      }
    };
  };

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let success = false;
      
      if (currentState === "Login") {
        success = await loginUser(email, password);
      } else {
        // Validate password for signup
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          setError("Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)");
          setIsLoading(false);
          return;
        }

        // Validate name
        if (name.trim().length < 2) {
          setError("Name must be at least 2 characters long");
          setIsLoading(false);
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          setIsLoading(false);
          return;
        }

        success = await registerUser(name.trim(), email.toLowerCase(), password);
      }

      if (success) {
        setSuccess(currentState === "Login" ? "Login successful!" : "Account created successfully!");
        setTimeout(() => {
          navigate('/'); // Redirect to home page after successful login/signup
        }, 1000);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            variants={itemVariants}
          >
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 text-base"
            variants={itemVariants}
          >
            {currentState === "Login" 
              ? "Sign in to your account to continue shopping" 
              : "Join us and start your shopping journey"
            }
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="card-modern card-elevated p-8"
          variants={formVariants}
        >
          <AnimatePresence mode="wait">
            <motion.form
              key={currentState}
              onSubmit={onSubmitHandler}
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{success}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name Field - Only for Sign Up */}
              <AnimatePresence>
                {currentState === "Sign Up" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className={`input-modern w-full pl-12 pr-4 py-3 ${
                            fieldErrors.name 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : name.length > 0 && !fieldErrors.name 
                                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                                : ''
                          }`}
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          required
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        {/* Validation indicator */}
                        {name.length > 0 && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {fieldErrors.name ? (
                              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                      {fieldErrors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {fieldErrors.name}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className={`input-modern w-full pl-12 pr-4 py-3 ${
                      fieldErrors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : email.length > 0 && !fieldErrors.email 
                          ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : ''
                    }`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {/* Validation indicator */}
                  {email.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {fieldErrors.email ? (
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {fieldErrors.email}
                  </motion.div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input-modern w-full pl-12 pr-12 py-3 ${
                      fieldErrors.password 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : password.length > 0 && !fieldErrors.password 
                          ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                          : ''
                    }`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    minLength={8}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                  {/* Validation indicator - positioned to the left of password toggle */}
                  {password.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-12 flex items-center">
                      {fieldErrors.password ? (
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Password error message */}
                {fieldErrors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {fieldErrors.password}
                  </motion.div>
                )}
                
                {/* Password Requirements - Only show for Sign Up */}
                {currentState === "Sign Up" && password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
                    <div className="space-y-1">
                      {[
                        { key: 'minLength', label: 'At least 8 characters', test: password.length >= 8 },
                        { key: 'hasUpperCase', label: 'One uppercase letter', test: /[A-Z]/.test(password) },
                        { key: 'hasLowerCase', label: 'One lowercase letter', test: /[a-z]/.test(password) },
                        { key: 'hasNumbers', label: 'One number', test: /\d/.test(password) },
                        { key: 'hasSpecialChar', label: 'One special character (@$!%*?&)', test: /[@$!%*?&]/.test(password) }
                      ].map((requirement) => (
                        <div key={requirement.key} className="flex items-center space-x-2">
                          <svg 
                            className={`w-3 h-3 ${requirement.test ? 'text-green-500' : 'text-gray-400'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            {requirement.test ? (
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            ) : (
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                          </svg>
                          <span className={`text-xs ${requirement.test ? 'text-green-600' : 'text-gray-500'}`}>
                            {requirement.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Forgot Password & Toggle Links */}
              <motion.div 
                className="flex items-center justify-between text-sm"
                variants={itemVariants}
              >
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  {currentState === "Login" ? "Create account" : "Sign in instead"}
                </button>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-modern btn-primary w-full py-4 text-base font-semibold"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {currentState === "Login" ? "Sign In" : "Create Account"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <motion.div 
            className="relative my-6"
            variants={itemVariants}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div 
            className="space-y-3"
            variants={itemVariants}
          >
            <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 text-gray-700 font-medium shadow-sm hover:shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 text-gray-700 font-medium shadow-sm hover:shadow-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className="text-gray-600 text-sm">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;