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
  
  const { loginUser, registerUser, isLoggedIn } = useShopContext();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let success = false;
      
      if (currentState === "Login") {
        success = await loginUser(email, password);
      } else {
        success = await registerUser(name, email, password);
      }

      if (success) {
        navigate('/'); // Redirect to home page after successful login/signup
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-2xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      
      {currentState === "Login" ? null : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer text-gray-600 hover:text-gray-800">
          Forgot your password?
        </p>
        {currentState === "Login" ? (
          <p 
            onClick={() => setCurrentState("Sign Up")} 
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            Create account
          </p>
        ) : (
          <p 
            onClick={() => setCurrentState("Login")} 
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            Login Here
          </p>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="font-workSans px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {isLoading ? "Please wait..." : (currentState === "Login" ? "Sign In" : "Sign Up")}
      </button>
      
      <div className="text-center text-sm text-gray-600 mt-4">
        {currentState === "Login" ? (
          <p>
            New to our store? 
            <button 
              type="button"
              onClick={() => setCurrentState("Sign Up")}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              Create an account
            </button>
          </p>
        ) : (
          <p>
            Already have an account? 
            <button 
              type="button"
              onClick={() => setCurrentState("Login")}
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              Sign in here
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;