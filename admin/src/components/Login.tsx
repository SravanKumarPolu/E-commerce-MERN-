import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useState } from "react";

interface LoginProps {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", { email, password });
      
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful! Welcome back.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-neutral-100 p-4 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 via-transparent to-neutral-100/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neutral-200/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Enhanced Card */}
        <div className="card-elevated p-10 backdrop-blur-sm">
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30 border border-primary-400/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-heading-1 font-bold gradient-text mb-3">
              Welcome Back
            </h1>
            <p className="text-body-large text-neutral-600 font-medium">
              Sign in to your admin dashboard
            </p>
          </div>

          {/* Enhanced Form */}
          <form className="space-y-8" onSubmit={onSubmitHandler}>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="input-modern"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="input-modern"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-modern btn-primary py-4 text-lg font-bold"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Enhanced Footer */}
          <div className="mt-10 pt-8 border-t border-neutral-200/60">
            <div className="text-center">
              <p className="text-caption text-neutral-500 font-semibold mb-3">
                Secure admin access for authorized personnel only
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-success-500 rounded-full"></div>
                  <span className="font-medium">Secure</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                  <span className="font-medium">Fast</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-warning-500 rounded-full"></div>
                  <span className="font-medium">Reliable</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
