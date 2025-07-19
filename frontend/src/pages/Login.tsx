import { FormEvent, useState } from "react";
import { useShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const [currentState, setCurrentState] = useState<string>("Login");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");
  
  // Field validation states
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const { loginUser, registerUser, isLoggedIn } = useShopContext();
  const navigate = useNavigate();

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-1000 ease-out ${
      isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-700 ease-out delay-200 ${
        isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* Header Section */}
        <div className={`text-center mb-4 sm:mb-6 lg:mb-8 transition-all duration-500 ease-out delay-300 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 lg:mb-6 shadow-lg sm:shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl ${
            isPageLoaded ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '1s', animationDuration: '2s' }}>
            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white transition-transform duration-300 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight tracking-tight transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.4s' }}>
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          
          <p className={`text-sm sm:text-base lg:text-lg text-gray-800 font-medium leading-relaxed max-w-sm mx-auto transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.6s' }}>
            {currentState === "Login" 
              ? "Sign in to your account to continue shopping" 
              : "Join us and start your shopping journey"
            }
          </p>
        </div>

        {/* Form Card */}
        <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-5 lg:p-6 xl:p-8 transition-all duration-500 ease-out delay-400 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } hover:shadow-2xl`}>
          <form onSubmit={onSubmitHandler} className="space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-900 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium animate-shake">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-900 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium animate-bounce">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Name Field - Only for Sign Up */}
            {currentState === "Sign Up" && (
              <div className={`space-y-1.5 sm:space-y-2 transition-all duration-500 ease-out ${
                currentState === "Sign Up" ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
              }`}>
                <label className="block text-sm sm:text-base font-semibold text-gray-900 transition-colors duration-200">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 bg-white text-gray-900 placeholder-gray-600 group-hover:border-blue-400 ${
                      fieldErrors.name 
                        ? 'border-red-400 focus:ring-red-500 animate-shake' 
                        : name.length > 0 && !fieldErrors.name 
                          ? 'border-green-400 focus:ring-green-500'
                          : 'border-gray-400 focus:ring-blue-600'
                    } ${focusedField === 'name' ? 'ring-2 ring-blue-600 ring-opacity-50' : ''}`}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600 transition-colors duration-200 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  {/* Validation indicator */}
                  {name.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center animate-fadeIn">
                      {fieldErrors.name ? (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.name && (
                  <div className="text-red-700 text-xs sm:text-sm font-medium mt-1 animate-fadeIn">
                    {fieldErrors.name}
                  </div>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 transition-colors duration-200">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 bg-white text-gray-900 placeholder-gray-600 group-hover:border-blue-400 ${
                    fieldErrors.email 
                      ? 'border-red-400 focus:ring-red-500 animate-shake' 
                      : email.length > 0 && !fieldErrors.email 
                        ? 'border-green-400 focus:ring-green-500'
                        : 'border-gray-400 focus:ring-blue-600'
                  } ${focusedField === 'email' ? 'ring-2 ring-blue-600 ring-opacity-50' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600 transition-colors duration-200 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                {/* Validation indicator */}
                {email.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center animate-fadeIn">
                    {fieldErrors.email ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {fieldErrors.email && (
                <div className="text-red-700 text-xs sm:text-sm font-medium mt-1 animate-fadeIn">
                  {fieldErrors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 transition-colors duration-200">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 bg-white text-gray-900 placeholder-gray-600 group-hover:border-blue-400 ${
                    fieldErrors.password 
                      ? 'border-red-400 focus:ring-red-500 animate-shake' 
                      : password.length > 0 && !fieldErrors.password 
                        ? 'border-green-400 focus:ring-green-500'
                        : 'border-gray-400 focus:ring-blue-600'
                  } ${focusedField === 'password' ? 'ring-2 ring-blue-600 ring-opacity-50' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  required
                  minLength={8}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600 transition-colors duration-200 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg sm:rounded-r-xl transition-all duration-200 hover:scale-110 active:scale-95"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
                {/* Validation indicator - positioned to the left of password toggle */}
                {password.length > 0 && (
                  <div className="absolute inset-y-0 right-0 pr-10 sm:pr-12 flex items-center animate-fadeIn">
                    {fieldErrors.password ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              
              {/* Password error message */}
              {fieldErrors.password && (
                <div className="text-red-700 text-xs sm:text-sm font-medium mt-1 animate-fadeIn">
                  {fieldErrors.password}
                </div>
              )}
              
              {/* Password Requirements - Only show for Sign Up */}
              {currentState === "Sign Up" && password && (
                <div className={`mt-2 sm:mt-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 transition-all duration-500 ease-out animate-slideDown`}>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Password requirements:</p>
                  <div className="space-y-1.5 sm:space-y-2">
                    {[
                      { key: 'minLength', label: 'At least 8 characters', test: password.length >= 8 },
                      { key: 'hasUpperCase', label: 'One uppercase letter', test: /[A-Z]/.test(password) },
                      { key: 'hasLowerCase', label: 'One lowercase letter', test: /[a-z]/.test(password) },
                      { key: 'hasNumbers', label: 'One number', test: /\d/.test(password) },
                      { key: 'hasSpecialChar', label: 'One special character (@$!%*?&)', test: /[@$!%*?&]/.test(password) }
                    ].map((requirement, index) => (
                      <div key={requirement.key} className={`flex items-center space-x-2 sm:space-x-3 transition-all duration-300 ease-out ${
                        requirement.test ? 'animate-fadeIn' : ''
                      }`} style={{ animationDelay: `${index * 100}ms` }}>
                        <svg 
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${requirement.test ? 'text-green-600 scale-110' : 'text-gray-500'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          {requirement.test ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span className={`text-xs sm:text-sm transition-all duration-300 ${requirement.test ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                          {requirement.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Forgot Password & Toggle Links */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs sm:text-sm lg:text-base">
              <button
                type="button"
                className="text-blue-700 hover:text-blue-800 font-semibold transition-all duration-200 hover:underline text-left hover:scale-105 active:scale-95"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
                className="text-blue-700 hover:text-blue-800 font-semibold transition-all duration-200 hover:underline text-left sm:text-right hover:scale-105 active:scale-95"
              >
                {currentState === "Login" ? "Create account" : "Sign in instead"}
              </button>
            </div>

            {/* Submit Button - GUARANTEED VISIBLE */}
            <div className="pt-2 sm:pt-3 lg:pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 sm:py-4 lg:py-5 px-4 sm:px-6 bg-blue-700 hover:bg-blue-800 text-white text-sm sm:text-base lg:text-lg font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transform"
                style={{ display: 'block', visibility: 'visible', opacity: 1 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold animate-pulse">
                      {currentState === "Login" ? "Signing in..." : "Creating account..."}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold">
                    {currentState === "Login" ? "Sign In" : "Create Account"}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-6 lg:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm lg:text-base">
              <span className="px-3 sm:px-4 bg-white text-gray-700 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <button className="w-full py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-gray-800 font-semibold shadow-sm hover:shadow-md text-sm sm:text-base lg:text-lg hover:scale-105 active:scale-95 transform group">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button className="w-full py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-gray-800 font-semibold shadow-sm hover:shadow-md text-sm sm:text-base lg:text-lg hover:scale-105 active:scale-95 transform group">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-4 sm:mt-6 lg:mt-8 transition-all duration-500 ease-out delay-500 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-xs sm:text-sm lg:text-base text-gray-800 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-700 hover:text-blue-800 font-semibold transition-all duration-200 hover:underline hover:scale-105">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-700 hover:text-blue-800 font-semibold transition-all duration-200 hover:underline hover:scale-105">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;