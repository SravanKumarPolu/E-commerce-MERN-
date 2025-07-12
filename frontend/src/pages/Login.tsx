import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState<string>("Login");
  const [loading, setLoading] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const { login, register, requestPasswordReset, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors(prev => ({
        ...prev,
        [e.target.name]: []
      }));
    }
  };

  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value);
  };

  const handleValidationError = (errorData: any) => {
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMap: Record<string, string[]> = {};
      errorData.errors.forEach((error: any) => {
        if (!errorMap[error.field]) {
          errorMap[error.field] = [];
        }
        errorMap[error.field].push(error.message);
      });
      setValidationErrors(errorMap);
    } else {
      setValidationErrors({});
    }
  };

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setValidationErrors({});
    
    try {
      let success = false;
      
      if (currentState === 'Sign Up') {
        success = await register(formData.name, formData.email, formData.password);
      } else {
        success = await login(formData.email, formData.password);
      }
      
      if (success) {
        navigate('/');
      }
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        handleValidationError(error.response.data);
      } else {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await requestPasswordReset(resetEmail);
      if (success) {
        setShowForgotPassword(false);
        setResetEmail("");
        toast.success('Password reset instructions sent to your email');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors[field] ? validationErrors[field][0] : null;
  };

  if (showForgotPassword) {
    return (
      <div className="flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-16 gap-5 text-gray-800 font-inter">
        <div className="inline-flex items-center gap-2 mb-3">
          <h1 className="text-3xl font-bold tracking-wide text-gray-900">Reset Password</h1>
          <hr className="border-none h-[2px] w-8 bg-gray-800" />
        </div>
        
        <form onSubmit={handleForgotPassword} className="w-full">
          <div className="mb-4">
            <label htmlFor="resetEmail" className="sr-only">Email</label>
            <input
              id="resetEmail"
              name="resetEmail"
              value={resetEmail}
              onChange={handleResetEmailChange}
              type="email"
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full font-medium px-6 py-3 rounded-md text-white transition duration-300 text-sm shadow-md bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 mb-4"
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
          
          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="w-full font-medium px-6 py-3 rounded-md text-gray-900 transition duration-300 text-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-16 gap-5 text-gray-800 font-inter"
      aria-label={`${currentState} Form`}
    >
      <div className="inline-flex items-center gap-2 mb-3">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">{currentState}</h1>
        <hr className="border-none h-[2px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <div className="w-full">
          <label htmlFor="name" className="sr-only">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Name"
            required
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 text-sm ${
              getFieldError('name') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {getFieldError('name') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('name')}</p>
          )}
        </div>
      )}

      <div className="w-full">
        <label htmlFor="email" className="sr-only">Email</label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          required
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 text-sm ${
            getFieldError('email') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {getFieldError('email') && (
          <p className="text-red-500 text-xs mt-1">{getFieldError('email')}</p>
        )}
      </div>

      <div className="w-full">
        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          required
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 text-sm ${
            getFieldError('password') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {getFieldError('password') && (
          <p className="text-red-500 text-xs mt-1">{getFieldError('password')}</p>
        )}
        {currentState === "Sign Up" && (
          <p className="text-gray-600 text-xs mt-1">
            Password must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        )}
      </div>

      <div className="w-full flex justify-between text-xs text-gray-600">
        <p 
          onClick={() => setShowForgotPassword(true)}
          className="cursor-pointer hover:underline"
        >
          Forgot your password?
        </p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer hover:underline text-indigo-600"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer hover:underline text-indigo-600"
          >
            Login Here
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 font-medium px-6 py-3 w-full rounded-md text-white transition duration-300 text-sm shadow-md bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        aria-label="Submit Button"
      >
        {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;