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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      role="main"
      aria-label="Login and registration form"
    >
      {/* Refined Background Elements with Elegant Color Palette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200/30 via-transparent to-transparent"></div>
      {!reducedAnimations && (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-slate-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-slate-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </>
      )}
      
      <div className={`w-full max-w-md lg:max-w-lg xl:max-w-xl relative z-10 transition-all duration-700 ease-out ${
        isPageLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        {/* Refined Header Section with Elegant Color Palette */}
        <div className={`text-center mb-8 lg:mb-10 xl:mb-12 transition-all duration-500 ease-out ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Refined Logo with Elegant Color Scheme */}
          <div className={`inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl mb-6 lg:mb-8 xl:mb-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-slate-800 hover:via-slate-900 hover:to-black ${
            isPageLoaded && !reducedAnimations ? 'animate-bounce-gentle' : ''
          }`} style={{ animationDelay: '1s' }}>
            <UserIcon 
              size="xl" 
              className="text-white transition-transform duration-300 hover:rotate-12" 
              aria-hidden="true"
            />
          </div>
          
          {/* Refined Typography with Elegant Color Palette */}
          <h1 className={`text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 mb-4 lg:mb-6 xl:mb-8 leading-tight tracking-tight transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.4s' }}>
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          
          <p className={`text-base lg:text-lg xl:text-xl text-slate-600 font-medium leading-relaxed max-w-md mx-auto transition-all duration-500 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ animationDelay: '0.6s' }}>
            {currentState === "Login" 
              ? "Sign in to your account to continue shopping" 
              : "Join us and start your shopping journey"
            }
          </p>
        </div>

        {/* Refined Form Card with Elegant Color Palette and Simplified Layout */}
        <div className={`bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl p-6 lg:p-8 xl:p-10 transition-all duration-500 ease-out ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } hover:shadow-2xl hover:-translate-y-1 border border-slate-200/50 relative overflow-hidden`}>
          {/* Subtle background pattern with elegant colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 via-transparent to-slate-100/20 opacity-60"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-200/40 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-slate-300/30 to-transparent rounded-full blur-lg"></div>
          
          <div className="relative z-10">
            <form 
              ref={formRef}
              onSubmit={onSubmitHandler} 
              className="space-y-6 lg:space-y-8"
              aria-label={`${currentState} form`}
            >
              {/* Refined Error Message with Elegant Color Palette */}
              {error && (
                <div 
                  className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in relative overflow-hidden shadow-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <ExclamationIcon 
                      size="md" 
                      className="text-red-600 flex-shrink-0" 
                      aria-hidden="true"
                    />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Refined Success Message with Elegant Color Palette */}
              {success && (
                <div 
                  className="bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in relative overflow-hidden shadow-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <CheckIcon 
                      size="md" 
                      className="text-emerald-600 flex-shrink-0" 
                      aria-hidden="true"
                    />
                    <span>{success}</span>
                  </div>
                </div>
              )}

              {/* Enhanced Loading Skeleton with Polished Animations */}
              {isFormSubmitting && !isLoading && (
                <div className="space-y-6" aria-hidden="true">
                  <div className="h-4 skeleton-line"></div>
                  <div className="skeleton-input"></div>
                  <div className="skeleton-input"></div>
                  <div className="skeleton-input"></div>
                </div>
              )}

              {/* Refined Name Field - Only for Sign Up with Simplified Design */}
              {currentState === "Sign Up" && !isFormSubmitting && (
                <div className={`space-y-3 transition-all duration-500 ease-out ${
                  currentState === "Sign Up" ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
                }`}>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative group">
                    <input
                      id="name"
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 lg:py-4 text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white text-slate-900 placeholder-slate-500 group-hover:border-slate-400 input-focus-enhanced ${
                        fieldErrors.name 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                          : name.length > 0 && !fieldErrors.name 
                            ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                            : ''
                      }`}
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      required
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      aria-invalid={!!fieldErrors.name}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon 
                        size="lg" 
                        className="text-slate-400 transition-colors duration-200 group-focus-within:text-slate-600" 
                        aria-hidden="true"
                      />
                    </div>
                    {/* Simplified validation indicator */}
                    {name.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center" aria-hidden="true">
                        {fieldErrors.name ? (
                          <ExclamationIcon 
                            size="md" 
                            className="text-red-500 error-cross"
                          />
                        ) : (
                          <CheckIcon 
                            size="md" 
                            className="text-emerald-500 success-checkmark"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {fieldErrors.name && (
                    <div id="name-error" className="text-red-600 text-sm mt-2 flex items-center space-x-2 validation-error" role="alert">
                      <ExclamationIcon 
                        size="sm" 
                        className="text-red-500" 
                        aria-hidden="true"
                      />
                      <span>{fieldErrors.name}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Refined Email Field with Simplified Design */}
              {!isFormSubmitting && (
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      ref={emailInputRef}
                      id="email"
                      type="email"
                      className={`w-full pl-12 pr-4 py-3 lg:py-4 text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white text-slate-900 placeholder-slate-500 group-hover:border-slate-400 input-focus-enhanced ${
                        fieldErrors.email 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                          : email.length > 0 && !fieldErrors.email 
                            ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                            : ''
                      }`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      required
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      aria-invalid={!!fieldErrors.email}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EmailIcon 
                        size="lg" 
                        className="text-slate-400 transition-colors duration-200 group-focus-within:text-slate-600" 
                        aria-hidden="true"
                      />
                    </div>
                    {/* Simplified validation indicator */}
                    {email.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center" aria-hidden="true">
                        {fieldErrors.email ? (
                          <ExclamationIcon 
                            size="md" 
                            className="text-red-500 error-cross"
                          />
                        ) : (
                          <CheckIcon 
                            size="md" 
                            className="text-emerald-500 success-checkmark"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <div id="email-error" className="text-red-600 text-sm mt-2 flex items-center space-x-2 validation-error" role="alert">
                      <ExclamationIcon 
                        size="sm" 
                        className="text-red-500" 
                        aria-hidden="true"
                      />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Refined Password Field with Simplified Design */}
              {!isFormSubmitting && (
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      ref={passwordInputRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-12 pr-12 py-3 lg:py-4 text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200 bg-white text-slate-900 placeholder-slate-500 group-hover:border-slate-400 input-focus-enhanced ${
                        fieldErrors.password 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                          : password.length > 0 && !fieldErrors.password 
                            ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                            : ''
                      }`}
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
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockIcon 
                        size="lg" 
                        className="text-slate-400 transition-colors duration-200 group-focus-within:text-slate-600" 
                        aria-hidden="true"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-50 rounded-r-xl transition-all duration-200 btn-press"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <EyeIcon 
                        size="lg" 
                        className="text-slate-400 hover:text-slate-600 transition-all duration-200" 
                        isVisible={!showPassword}
                        aria-hidden="true"
                      />
                    </button>
                    {/* Simplified validation indicator - positioned to the left of password toggle */}
                    {password.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-12 flex items-center" aria-hidden="true">
                        {fieldErrors.password ? (
                          <ExclamationIcon 
                            size="md" 
                            className="text-red-500 error-cross"
                          />
                        ) : (
                          <CheckIcon 
                            size="md" 
                            className="text-emerald-500 success-checkmark"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Simplified password error message */}
                  {fieldErrors.password && (
                    <div id="password-error" className="text-red-600 text-sm mt-2 flex items-center space-x-2 validation-error" role="alert">
                      <ExclamationIcon 
                        size="sm" 
                        className="text-red-500" 
                        aria-hidden="true"
                      />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                  
                  {/* Simplified Password Requirements - Only show for Sign Up */}
                  {currentState === "Sign Up" && password && !isFormSubmitting && (
                    <div className={`mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 transition-all duration-300 ease-out form-transition`}>
                      <p className="text-sm font-semibold text-slate-700 mb-3">Password requirements:</p>
                      <div className="space-y-2">
                        {[
                          { key: 'minLength', label: 'At least 8 characters', test: password.length >= 8 },
                          { key: 'hasUpperCase', label: 'One uppercase letter', test: /[A-Z]/.test(password) },
                          { key: 'hasLowerCase', label: 'One lowercase letter', test: /[a-z]/.test(password) },
                          { key: 'hasNumbers', label: 'One number', test: /\d/.test(password) },
                          { key: 'hasSpecialChar', label: 'One special character (@$!%*?&)', test: /[@$!%*?&]/.test(password) }
                        ].map((requirement, index) => (
                          <div key={requirement.key} className={`flex items-center space-x-3 transition-all duration-200 ${
                            requirement.test ? 'animate-fade-in validation-success' : ''
                          }`} style={{ animationDelay: `${index * 50}ms` }}>
                            <ValidationIcon 
                              size="sm" 
                              className={`transition-all duration-200 ${requirement.test ? 'text-emerald-500' : 'text-slate-400'}`}
                              isValid={requirement.test}
                            />
                            <span className={`text-sm transition-all duration-200 ${requirement.test ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>
                              {requirement.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Refined Remember Me Checkbox - Only for Login */}
              {currentState === "Login" && !isFormSubmitting && (
                <div className="flex items-center space-x-3">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                  />
                  <label htmlFor="remember-me" className="text-sm text-slate-700 font-medium">
                    Remember me
                  </label>
                </div>
              )}

              {/* Refined Biometric Authentication - Only for Login */}
              {currentState === "Login" && !isFormSubmitting && (
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  className="w-full py-3 lg:py-4 px-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-sm hover:shadow-md text-sm lg:text-base"
                  aria-label="Sign in with biometric authentication"
                >
                  <ShieldIcon 
                    size="md" 
                    className="text-white" 
                    aria-hidden="true"
                  />
                  <span>Sign in with Biometrics</span>
                </button>
              )}

              {/* Refined Forgot Password & Toggle Links */}
              {!isFormSubmitting && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-sm">
                  <button
                    type="button"
                    onClick={() => setShowPasswordRecovery(true)}
                    className="text-slate-600 hover:text-slate-800 font-medium transition-all duration-200 hover:underline text-left"
                    aria-label="Forgot password? Click to reset"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
                    className="text-slate-600 hover:text-slate-800 font-medium transition-all duration-200 hover:underline text-left sm:text-right"
                    aria-label={`Switch to ${currentState === "Login" ? "Sign Up" : "Login"} mode`}
                  >
                    {currentState === "Login" ? "Create account" : "Sign in instead"}
                  </button>
                </div>
              )}

              {/* Enhanced Submit Button with Polished Loading Animation */}
              <div className="pt-6 lg:pt-8">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full py-4 lg:py-5 px-6 text-white text-base lg:text-lg font-semibold rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform relative overflow-hidden btn-press ${
                    isLoading
                      ? 'bg-slate-500 cursor-not-allowed btn-loading'
                      : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 hover:shadow-md active:scale-98 focus:ring-slate-500'
                  }`}
                  style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                  aria-describedby={isLoading ? "loading-status" : undefined}
                >
                  {/* Enhanced Loading Background Animation */}
                  {isLoading && (
                    <div className="absolute inset-0 loading-authenticating"></div>
                  )}
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-4 relative z-10">
                      {/* Enhanced Spinner with Pulse Effect */}
                      <div className="loading-spinner-enhanced w-6 h-6 lg:w-7 lg:h-7 text-white"></div>
                      <span className="font-medium loading-text">
                        {currentState === "Login" ? "Signing in..." : "Creating account..."}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold relative z-10">
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

            {/* Refined Divider */}
            {!isFormSubmitting && (
              <div className="relative my-8 lg:my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>
            )}

            {/* Enhanced Social Login Buttons with Polished Loading States */}
            {!isFormSubmitting && (
              <div className="space-y-4">
                <button 
                  className="w-full py-3 lg:py-4 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-3 text-slate-700 font-medium shadow-sm hover:shadow-md text-sm lg:text-base relative overflow-hidden btn-press"
                  disabled={isSocialLoading}
                >
                  {/* Enhanced Loading Background for Social Buttons */}
                  {isSocialLoading && (
                    <div className="absolute inset-0 social-loading"></div>
                  )}
                  
                  {isSocialLoading ? (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      {/* Enhanced Social Loading Spinner */}
                      <div className="loading-spinner-enhanced w-5 h-5 text-slate-600"></div>
                      <span className="text-slate-600 font-medium loading-text">Connecting...</span>
                    </div>
                  ) : (
                    <>
                      <GoogleIcon 
                        size="lg" 
                        className="transition-transform duration-200"
                      />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
                
                <button className="w-full py-3 lg:py-4 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-3 text-slate-700 font-medium shadow-sm hover:shadow-md text-sm lg:text-base btn-press">
                  <FacebookIcon 
                    size="lg" 
                    className="transition-transform duration-200"
                  />
                  <span>Continue with Facebook</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Refined Footer */}
        <div className={`text-center mt-8 lg:mt-10 transition-all duration-500 ease-out ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            By continuing, you agree to our{" "}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-200 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-200 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
      
      {/* Refined Floating Particles with Elegant Colors */}
      {!reducedAnimations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(particleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-slate-300/40 rounded-full animate-float"
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