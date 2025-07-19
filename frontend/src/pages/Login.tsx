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
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-1000 ease-out ${
      isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-700 ease-out delay-200 ${
        isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* Header Section */}
        <div className={`text-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12 transition-all duration-500 ease-out delay-300 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 lg:mb-8 shadow-xl sm:shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-3 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 ${
            isPageLoaded ? 'animate-bounce' : ''
          }`} style={{ animationDelay: '1s', animationDuration: '2s' }}>
            <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-white transition-transform duration-300 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 lg:mb-5 leading-tight tracking-tight transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.4s' }}>
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          
          <p className={`text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-700 font-medium leading-relaxed max-w-md mx-auto transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.6s' }}>
            {currentState === "Login" 
              ? "Sign in to your account to continue shopping" 
              : "Join us and start your shopping journey"
            }
          </p>
        </div>

        {/* Form Card */}
        <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 lg:p-10 xl:p-12 transition-all duration-500 ease-out delay-400 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } hover:shadow-2xl hover:-translate-y-2 hover:shadow-blue-100/50`}>
          <form onSubmit={onSubmitHandler} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-300 text-red-900 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold animate-shake relative overflow-hidden shadow-lg">
                <div className="flex items-center space-x-3 relative z-10">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
                {/* Enhanced background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-200/30 via-red-100/40 to-red-200/30 animate-pulse-slow"></div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-300 text-green-900 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold animate-bounce relative overflow-hidden shadow-lg">
                <div className="flex items-center space-x-3 relative z-10">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
                {/* Enhanced background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 via-emerald-100/40 to-green-200/30 animate-pulse-slow"></div>
              </div>
            )}

            {/* Loading Skeleton - Enhanced */}
            {isFormSubmitting && !isLoading && (
              <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded-xl animate-shimmer"></div>
                <div className="h-14 bg-gray-200 rounded-xl animate-shimmer"></div>
                <div className="h-14 bg-gray-200 rounded-xl animate-shimmer"></div>
                <div className="h-14 bg-gray-200 rounded-xl animate-shimmer"></div>
              </div>
            )}

            {/* Name Field - Only for Sign Up */}
            {currentState === "Sign Up" && !isFormSubmitting && (
              <div className={`space-y-2 sm:space-y-3 transition-all duration-500 ease-out ${
                currentState === "Sign Up" ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
              }`}>
                <label className="block text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-blue-700">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className={`w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 group-hover:border-blue-400 group-hover:shadow-lg ${
                      fieldErrors.name 
                        ? 'border-red-400 focus:ring-red-500/20 animate-shake' 
                        : name.length > 0 && !fieldErrors.name 
                          ? 'border-green-400 focus:ring-green-500/20'
                          : 'border-gray-300 focus:ring-blue-500/20'
                    } ${focusedField === 'name' ? 'ring-4 ring-blue-500/20 shadow-xl' : ''}`}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  {/* Validation indicator */}
                  {name.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center animate-fadeIn">
                      {fieldErrors.name ? (
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.name && (
                  <div className="text-red-700 text-sm sm:text-base font-semibold mt-2 animate-fadeIn flex items-center space-x-2">
                    <svg className="w-4 h-4 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{fieldErrors.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Email Field */}
            {!isFormSubmitting && (
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-blue-700">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    className={`w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 group-hover:border-blue-400 group-hover:shadow-lg ${
                      fieldErrors.email 
                        ? 'border-red-400 focus:ring-red-500/20 animate-shake' 
                        : email.length > 0 && !fieldErrors.email 
                          ? 'border-green-400 focus:ring-green-500/20'
                          : 'border-gray-300 focus:ring-blue-500/20'
                    } ${focusedField === 'email' ? 'ring-4 ring-blue-500/20 shadow-xl' : ''}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {/* Validation indicator */}
                  {email.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center animate-fadeIn">
                      {fieldErrors.email ? (
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <div className="text-red-700 text-sm sm:text-base font-semibold mt-2 animate-fadeIn flex items-center space-x-2">
                    <svg className="w-4 h-4 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{fieldErrors.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* Password Field */}
            {!isFormSubmitting && (
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-blue-700">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 group-hover:border-blue-400 group-hover:shadow-lg ${
                      fieldErrors.password 
                        ? 'border-red-400 focus:ring-red-500/20 animate-shake' 
                        : password.length > 0 && !fieldErrors.password 
                          ? 'border-green-400 focus:ring-green-500/20'
                          : 'border-gray-300 focus:ring-blue-500/20'
                    } ${focusedField === 'password' ? 'ring-4 ring-blue-500/20 shadow-xl' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    minLength={8}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl sm:rounded-r-2xl transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-inner"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                  {/* Validation indicator - positioned to the left of password toggle */}
                  {password.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-12 sm:pr-14 flex items-center animate-fadeIn">
                      {fieldErrors.password ? (
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Password error message */}
                {fieldErrors.password && (
                  <div className="text-red-700 text-sm sm:text-base font-semibold mt-2 animate-fadeIn flex items-center space-x-2">
                    <svg className="w-4 h-4 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{fieldErrors.password}</span>
                  </div>
                )}
                
                {/* Password Requirements - Only show for Sign Up */}
                {currentState === "Sign Up" && password && !isFormSubmitting && (
                  <div className={`mt-3 sm:mt-4 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border-2 border-gray-200 transition-all duration-500 ease-out animate-slideDown hover:shadow-lg hover:border-blue-200 hover:from-blue-50 hover:to-indigo-50`}>
                    <p className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Password requirements:</p>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { key: 'minLength', label: 'At least 8 characters', test: password.length >= 8 },
                        { key: 'hasUpperCase', label: 'One uppercase letter', test: /[A-Z]/.test(password) },
                        { key: 'hasLowerCase', label: 'One lowercase letter', test: /[a-z]/.test(password) },
                        { key: 'hasNumbers', label: 'One number', test: /\d/.test(password) },
                        { key: 'hasSpecialChar', label: 'One special character (@$!%*?&)', test: /[@$!%*?&]/.test(password) }
                      ].map((requirement, index) => (
                        <div key={requirement.key} className={`flex items-center space-x-3 sm:space-x-4 transition-all duration-300 ease-out hover:scale-105 ${
                          requirement.test ? 'animate-fadeIn' : ''
                        }`} style={{ animationDelay: `${index * 100}ms` }}>
                          <svg 
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${requirement.test ? 'text-green-600 scale-110' : 'text-gray-500'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            {requirement.test ? (
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            ) : (
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                          </svg>
                          <span className={`text-sm sm:text-base transition-all duration-300 ${requirement.test ? 'text-green-800 font-bold' : 'text-gray-700'}`}>
                            {requirement.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Forgot Password & Toggle Links */}
            {!isFormSubmitting && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-sm sm:text-base lg:text-lg">
                <button
                  type="button"
                  className="text-blue-700 hover:text-blue-800 font-bold transition-all duration-200 hover:underline text-left hover:scale-105 active:scale-95 hover:bg-blue-50 px-3 py-2 rounded-xl hover:shadow-md"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
                  className="text-blue-700 hover:text-blue-800 font-bold transition-all duration-200 hover:underline text-left sm:text-right hover:scale-105 active:scale-95 hover:bg-blue-50 px-3 py-2 rounded-xl hover:shadow-md"
                >
                  {currentState === "Login" ? "Create account" : "Sign in instead"}
                </button>
              </div>
            )}

            {/* Submit Button - Enhanced */}
            <div className="pt-4 sm:pt-5 lg:pt-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 sm:py-5 lg:py-6 px-6 sm:px-8 text-white text-base sm:text-lg lg:text-xl font-extrabold rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 transform ${
                  isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:shadow-2xl hover:scale-105 active:scale-95 focus:ring-blue-500/50'
                }`}
                style={{ display: 'block', visibility: 'visible', opacity: 1 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold animate-pulse">
                      {currentState === "Login" ? "Signing in..." : "Creating account..."}
                    </span>
                  </div>
                ) : (
                  <span className="font-extrabold">
                    {currentState === "Login" ? "Sign In" : "Create Account"}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          {!isFormSubmitting && (
            <div className="relative my-6 sm:my-8 lg:my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm sm:text-base lg:text-lg">
                <span className="px-4 sm:px-5 bg-white text-gray-600 font-bold">Or continue with</span>
              </div>
            </div>
          )}

          {/* Social Login Buttons */}
          {!isFormSubmitting && (
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <button className="w-full py-3 sm:py-4 lg:py-5 px-4 sm:px-5 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-3 sm:space-x-4 text-gray-800 font-bold shadow-lg hover:shadow-xl text-base sm:text-lg lg:text-xl hover:scale-105 active:scale-95 transform group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <button className="w-full py-3 sm:py-4 lg:py-5 px-4 sm:px-5 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-3 sm:space-x-4 text-gray-800 font-bold shadow-lg hover:shadow-xl text-base sm:text-lg lg:text-xl hover:scale-105 active:scale-95 transform group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`text-center mt-6 sm:mt-8 lg:mt-10 xl:mt-12 transition-all duration-500 ease-out delay-500 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-medium">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-700 hover:text-blue-800 font-bold transition-all duration-200 hover:underline hover:scale-105">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-700 hover:text-blue-800 font-bold transition-all duration-200 hover:underline hover:scale-105">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;