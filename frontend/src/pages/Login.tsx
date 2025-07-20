import { FormEvent, useState, useEffect, useRef } from "react";
import { useShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { usePerformanceMode } from "../hooks/usePerformanceMode";
import PasswordRecovery from "../components/PasswordRecovery";
import {
  UserIcon,
  EmailIcon,
  LockIcon,
  EyeIcon,
  CheckIcon,
  ExclamationIcon,
  ShieldIcon,
  GoogleIcon,
  FacebookIcon,
  ValidationIcon
} from "../components/icons";

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
  const [showPasswordRecovery, setShowPasswordRecovery] = useState<boolean>(false);
  const [isSocialLoading, setIsSocialLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  // Performance optimizations
  const { isLowPerformance, reducedAnimations, particleCount } = usePerformanceMode();
  
  // Accessibility refs
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  // Field validation states
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const { loginUser, registerUser, isLoggedIn } = useShopContext();
  const navigate = useNavigate();

  // Page load animation with performance optimization
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), reducedAnimations ? 50 : 100);
    return () => clearTimeout(timer);
  }, [reducedAnimations]);

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

  // Password recovery handler
  const handlePasswordRecovery = async (recoveryEmail: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        console.error('Password recovery failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Password recovery error:', error);
      return false;
    }
  };

  // Biometric authentication handler
  const handleBiometricAuth = async () => {
    try {
      if ('credentials' in navigator) {
        const credential = await (navigator as any).credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            rpId: window.location.hostname,
            userVerification: 'preferred'
          }
        });
        
        if (credential) {
          // Handle successful biometric authentication
          console.log('Biometric authentication successful');
          // TODO: Implement actual biometric login
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setError('Biometric authentication not available or failed');
    }
  };

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
        
        // Handle remember me functionality
        if (success && rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          // Note: In a real app, you'd want to store this securely
          // and implement proper token-based remember me
        } else if (!rememberMe) {
          localStorage.removeItem('rememberedEmail');
        }
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

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && currentState === "Login") {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [currentState]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      role="main"
      aria-label="Login and registration form"
    >
      {/* Enhanced Background Elements with Performance Optimization */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
      {!reducedAnimations && (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </>
      )}
      
      <div className={`w-full max-w-md lg:max-w-lg xl:max-w-xl relative z-10 transition-all duration-700 ease-out ${
        isPageLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        {/* Enhanced Header Section with Improved Visual Hierarchy */}
        <div className={`text-center mb-10 lg:mb-12 xl:mb-16 transition-all duration-500 ease-out ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Enhanced Logo with Better Proportions and Prominence */}
          <div className={`inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl lg:rounded-4xl shadow-2xl lg:shadow-3xl mb-8 lg:mb-10 xl:mb-12 transition-all duration-300 hover:scale-110 hover:shadow-3xl hover:rotate-3 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 ${
            isPageLoaded && !reducedAnimations ? 'animate-bounce-gentle' : ''
          }`} style={{ animationDelay: '1s' }}>
            <UserIcon 
              size="xl" 
              className="text-white transition-transform duration-300 hover:rotate-12" 
              aria-hidden="true"
            />
          </div>
          
          {/* Enhanced Typography with Clearer Visual Hierarchy */}
          <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 lg:mb-8 xl:mb-10 leading-tight tracking-tight transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.4s' }}>
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          
          <p className={`text-lg lg:text-xl xl:text-2xl text-gray-600 font-semibold leading-relaxed max-w-lg mx-auto transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.6s' }}>
            {currentState === "Login" 
              ? "Sign in to your account to continue shopping" 
              : "Join us and start your shopping journey"
            }
          </p>
        </div>

        {/* Enhanced Form Card with Better Spacing and Layout */}
        <div className={`bg-white/95 backdrop-blur-md rounded-3xl lg:rounded-4xl shadow-2xl lg:shadow-3xl p-8 lg:p-10 xl:p-12 transition-all duration-500 ease-out ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } hover:shadow-3xl hover:-translate-y-1 hover:shadow-blue-100/50 border border-white/30 relative overflow-hidden`}>
          {/* Subtle background pattern for visual interest */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/20 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <form 
              ref={formRef}
              onSubmit={onSubmitHandler} 
              className="space-y-8 lg:space-y-10 xl:space-y-12"
              aria-label={`${currentState} form`}
            >
              {/* Enhanced Error Message with Better Visibility and Spacing */}
              {error && (
                <div 
                  className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-900 px-6 py-4 rounded-2xl text-base font-bold animate-fade-in relative overflow-hidden shadow-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center space-x-4 relative z-10">
                    <ExclamationIcon 
                      size="lg" 
                      className="text-red-600 flex-shrink-0 animate-pulse" 
                      aria-hidden="true"
                    />
                    <span>{error}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-200/30 via-red-100/40 to-red-200/30 animate-pulse-slow"></div>
                </div>
              )}

              {/* Enhanced Success Message with Better Spacing */}
              {success && (
                <div 
                  className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 text-green-900 px-6 py-4 rounded-2xl text-base font-bold animate-bounce-gentle relative overflow-hidden shadow-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center space-x-4 relative z-10">
                    <CheckIcon 
                      size="lg" 
                      className="text-green-600 flex-shrink-0 animate-pulse" 
                      aria-hidden="true"
                    />
                    <span>{success}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 via-emerald-100/40 to-green-200/30 animate-pulse-slow"></div>
                </div>
              )}

              {/* Loading Skeleton with Better Spacing */}
              {isFormSubmitting && !isLoading && (
                <div className="space-y-8 animate-pulse" aria-hidden="true">
                  <div className="h-4 bg-gray-200 rounded-xl animate-shimmer"></div>
                  <div className="h-16 bg-gray-200 rounded-xl animate-shimmer"></div>
                  <div className="h-16 bg-gray-200 rounded-xl animate-shimmer"></div>
                  <div className="h-16 bg-gray-200 rounded-xl animate-shimmer"></div>
                </div>
              )}

              {/* Enhanced Name Field - Only for Sign Up with Better Spacing */}
              {currentState === "Sign Up" && !isFormSubmitting && (
                <div className={`space-y-4 transition-all duration-500 ease-out ${
                  currentState === "Sign Up" ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
                }`}>
                  <label htmlFor="name" className="block text-base lg:text-lg xl:text-xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-700">
                    Full Name
                  </label>
                  <div className="relative group">
                    <input
                      id="name"
                      type="text"
                      className={`w-full pl-14 pr-4 py-4 lg:py-5 xl:py-6 text-base lg:text-lg xl:text-xl border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 group-hover:border-blue-400 group-hover:shadow-lg group-hover:bg-white/90 ${
                        fieldErrors.name 
                          ? 'border-red-400 focus:ring-red-500/20 animate-shake' 
                          : name.length > 0 && !fieldErrors.name 
                            ? 'border-green-400 focus:ring-green-500/20'
                            : 'border-gray-300 focus:ring-blue-500/20'
                      } ${focusedField === 'name' ? 'ring-4 ring-blue-500/20 shadow-xl bg-white' : ''}`}
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      required
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      aria-invalid={!!fieldErrors.name}
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                      <UserIcon 
                        size="xl" 
                        className="text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600" 
                        aria-hidden="true"
                      />
                    </div>
                    {/* Validation indicator */}
                    {name.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-5 flex items-center animate-fade-in" aria-hidden="true">
                        {fieldErrors.name ? (
                          <ExclamationIcon 
                            size="xl" 
                            className="text-red-600 animate-pulse"
                          />
                        ) : (
                          <CheckIcon 
                            size="xl" 
                            className="text-green-600 animate-bounce-gentle"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {fieldErrors.name && (
                    <div id="name-error" className="text-red-700 text-sm lg:text-base xl:text-lg font-bold mt-3 animate-fade-in flex items-center space-x-3" role="alert">
                      <ExclamationIcon 
                        size="md" 
                        className="text-red-600 animate-pulse" 
                        aria-hidden="true"
                      />
                      <span>{fieldErrors.name}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Email Field with Better Spacing */}
              {!isFormSubmitting && (
                <div className="space-y-4">
                  <label htmlFor="email" className="block text-base lg:text-lg xl:text-xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      ref={emailInputRef}
                      id="email"
                      type="email"
                      className={`w-full pl-14 pr-4 py-4 lg:py-5 xl:py-6 text-base lg:text-lg xl:text-xl border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 group-hover:border-blue-400 group-hover:shadow-lg group-hover:bg-white/90 ${
                        fieldErrors.email 
                          ? 'border-red-400 focus:ring-red-500/20 animate-shake' 
                          : email.length > 0 && !fieldErrors.email 
                            ? 'border-green-400 focus:ring-green-500/20'
                            : 'border-gray-300 focus:ring-blue-500/20'
                      } ${focusedField === 'email' ? 'ring-4 ring-blue-500/20 shadow-xl bg-white' : ''}`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      required
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      aria-invalid={!!fieldErrors.email}
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                      <EmailIcon 
                        size="xl" 
                        className="text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600" 
                        aria-hidden="true"
                      />
                    </div>
                    {/* Validation indicator */}
                    {email.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-5 flex items-center animate-fade-in" aria-hidden="true">
                        {fieldErrors.email ? (
                          <ExclamationIcon 
                            size="xl" 
                            className="text-red-600 animate-pulse"
                          />
                        ) : (
                          <CheckIcon 
                            size="xl" 
                            className="text-green-600 animate-bounce-gentle"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <div id="email-error" className="text-red-700 text-sm lg:text-base xl:text-lg font-bold mt-3 animate-fade-in flex items-center space-x-3" role="alert">
                      <ExclamationIcon 
                        size="md" 
                        className="text-red-600 animate-pulse" 
                        aria-hidden="true"
                      />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Password Field with Better Spacing */}
              {!isFormSubmitting && (
                <div className="space-y-4">
                  <label htmlFor="password" className="block text-base lg:text-lg xl:text-xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-700">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      ref={passwordInputRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-14 pr-16 py-4 lg:py-5 xl:py-6 text-base lg:text-lg xl:text-xl border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 group-hover:border-blue-400 group-hover:shadow-lg group-hover:bg-white/90 ${
                        fieldErrors.password 
                          ? 'border-red-400 focus:ring-red-500/20 animate-shake' 
                          : password.length > 0 && !fieldErrors.password 
                            ? 'border-green-400 focus:ring-green-500/20'
                            : 'border-gray-300 focus:ring-blue-500/20'
                      } ${focusedField === 'password' ? 'ring-4 ring-blue-500/20 shadow-xl bg-white' : ''}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      required
                      minLength={8}
                      aria-describedby={fieldErrors.password ? "password-error" : undefined}
                      aria-invalid={!!fieldErrors.password}
                    />
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
                      <LockIcon 
                        size="xl" 
                        className="text-gray-500 transition-colors duration-200 group-focus-within:text-blue-600" 
                        aria-hidden="true"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-5 flex items-center hover:bg-gray-50/80 rounded-r-2xl transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-inner"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <EyeIcon 
                        size="xl" 
                        className="text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-12" 
                        isVisible={!showPassword}
                        aria-hidden="true"
                      />
                    </button>
                    {/* Validation indicator - positioned to the left of password toggle */}
                    {password.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-16 flex items-center animate-fade-in" aria-hidden="true">
                        {fieldErrors.password ? (
                          <ExclamationIcon 
                            size="xl" 
                            className="text-red-600 animate-pulse"
                          />
                        ) : (
                          <CheckIcon 
                            size="xl" 
                            className="text-green-600 animate-bounce-gentle"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Password error message with better spacing */}
                  {fieldErrors.password && (
                    <div id="password-error" className="text-red-700 text-sm lg:text-base xl:text-lg font-bold mt-3 animate-fade-in flex items-center space-x-3" role="alert">
                      <ExclamationIcon 
                        size="md" 
                        className="text-red-600 animate-pulse" 
                        aria-hidden="true"
                      />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                  
                  {/* Enhanced Password Requirements - Only show for Sign Up with better spacing */}
                  {currentState === "Sign Up" && password && !isFormSubmitting && (
                    <div className={`mt-6 p-6 bg-gradient-to-br from-gray-50/90 to-blue-50/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 transition-all duration-500 ease-out animate-slide-up hover:shadow-lg hover:border-blue-200 hover:from-blue-50/95 hover:to-indigo-50/95`}>
                      <p className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-6">Password requirements:</p>
                      <div className="space-y-4">
                        {[
                          { key: 'minLength', label: 'At least 8 characters', test: password.length >= 8 },
                          { key: 'hasUpperCase', label: 'One uppercase letter', test: /[A-Z]/.test(password) },
                          { key: 'hasLowerCase', label: 'One lowercase letter', test: /[a-z]/.test(password) },
                          { key: 'hasNumbers', label: 'One number', test: /\d/.test(password) },
                          { key: 'hasSpecialChar', label: 'One special character (@$!%*?&)', test: /[@$!%*?&]/.test(password) }
                        ].map((requirement, index) => (
                          <div key={requirement.key} className={`flex items-center space-x-4 transition-all duration-300 ease-out hover:scale-105 ${
                            requirement.test ? 'animate-fade-in' : ''
                          }`} style={{ animationDelay: `${index * 100}ms` }}>
                            <ValidationIcon 
                              size="md" 
                              className={`transition-all duration-300 ${requirement.test ? 'text-green-600 scale-110' : 'text-gray-500'}`}
                              isValid={requirement.test}
                            />
                            <span className={`text-base lg:text-lg transition-all duration-300 ${requirement.test ? 'text-green-800 font-bold' : 'text-gray-700 font-semibold'}`}>
                              {requirement.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Remember Me Checkbox - Only for Login with better spacing */}
              {currentState === "Login" && !isFormSubmitting && (
                <div className="flex items-center space-x-4">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="text-base lg:text-lg text-gray-700 font-semibold">
                    Remember me
                  </label>
                </div>
              )}

              {/* Biometric Authentication - Only for Login with better spacing */}
              {currentState === "Login" && !isFormSubmitting && (
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  className="w-full py-4 lg:py-5 xl:py-6 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-4 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-base lg:text-lg"
                  aria-label="Sign in with biometric authentication"
                >
                  <ShieldIcon 
                    size="lg" 
                    className="text-white" 
                    aria-hidden="true"
                  />
                  <span>Sign in with Biometrics</span>
                </button>
              )}

              {/* Enhanced Forgot Password & Toggle Links with better spacing */}
              {!isFormSubmitting && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 text-base lg:text-lg xl:text-xl">
                  <button
                    type="button"
                    onClick={() => setShowPasswordRecovery(true)}
                    className="text-blue-700 hover:text-blue-800 font-bold transition-all duration-200 hover:underline text-left hover:scale-105 active:scale-95 hover:bg-blue-50/80 px-4 py-3 rounded-xl hover:shadow-md"
                    aria-label="Forgot password? Click to reset"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
                    className="text-blue-700 hover:text-blue-800 font-bold transition-all duration-200 hover:underline text-left sm:text-right hover:scale-105 active:scale-95 hover:bg-blue-50/80 px-4 py-3 rounded-xl hover:shadow-md"
                    aria-label={`Switch to ${currentState === "Login" ? "Sign Up" : "Login"} mode`}
                  >
                    {currentState === "Login" ? "Create account" : "Sign in instead"}
                  </button>
                </div>
              )}

              {/* Enhanced Submit Button with better spacing and prominence */}
              <div className="pt-8 lg:pt-10 xl:pt-12">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full py-5 lg:py-6 xl:py-7 px-8 text-white text-lg lg:text-xl xl:text-2xl font-black rounded-2xl shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 transform relative overflow-hidden ${
                    isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 cursor-not-allowed opacity-75'
                      : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:shadow-3xl hover:scale-105 active:scale-95 focus:ring-blue-500/50'
                  }`}
                  style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                  aria-describedby={isLoading ? "loading-status" : undefined}
                >
                  {/* Subtle glow effect */}
                  {!isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-blue-500/20 to-indigo-400/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-4 relative z-10">
                      <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 border-3 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                      <span className="font-bold animate-pulse">
                        {currentState === "Login" ? "Signing in..." : "Creating account..."}
                      </span>
                    </div>
                  ) : (
                    <span className="font-black relative z-10">
                      {currentState === "Login" ? "Sign In" : "Create Account"}
                    </span>
                  )}
                </button>
                {isLoading && (
                  <div id="loading-status" className="sr-only" aria-live="polite">
                    {currentState === "Login" ? "Signing in..." : "Creating account..."}
                  </div>
                )}
              </div>
            </form>

            {/* Enhanced Divider with better spacing */}
            {!isFormSubmitting && (
              <div className="relative my-10 lg:my-12 xl:my-16">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200/60"></div>
                </div>
                <div className="relative flex justify-center text-base lg:text-lg xl:text-xl">
                  <span className="px-6 bg-white/95 backdrop-blur-sm text-gray-600 font-bold">Or continue with</span>
                </div>
              </div>
            )}

            {/* Enhanced Social Login Buttons with better spacing */}
            {!isFormSubmitting && (
              <div className="space-y-5 lg:space-y-6 xl:space-y-8">
                <button 
                  className="w-full py-4 lg:py-5 xl:py-6 px-6 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl hover:bg-white hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-4 text-gray-800 font-bold shadow-lg hover:shadow-xl text-base lg:text-lg xl:text-xl hover:scale-105 active:scale-95 transform group"
                  disabled={isSocialLoading}
                >
                  {isSocialLoading ? (
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <GoogleIcon 
                        size="xl" 
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
                
                <button className="w-full py-4 lg:py-5 xl:py-6 px-6 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl hover:bg-white hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-4 text-gray-800 font-bold shadow-lg hover:shadow-xl text-base lg:text-lg xl:text-xl hover:scale-105 active:scale-95 transform group">
                  <FacebookIcon 
                    size="xl" 
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>Continue with Facebook</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Footer with better spacing */}
        <div className={`text-center mt-10 lg:mt-12 xl:mt-16 transition-all duration-500 ease-out ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed font-semibold">
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
      
      {/* Optimized Floating Particles with Performance Considerations */}
      {!reducedAnimations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(particleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-200/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      
      {/* Password Recovery Modal */}
      <PasswordRecovery
        isOpen={showPasswordRecovery}
        onClose={() => setShowPasswordRecovery(false)}
        onRecoveryRequest={handlePasswordRecovery}
      />
    </div>
  );
};

export default Login;