import { FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [currentState, setCurrentState] = useState<string>("Login");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { setToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', formData);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', formData);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
      alert(`Successfully ${currentState === "Login" ? "signed in" : "registered"}`);
    }
  };

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
        <>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </>
      )}

      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        placeholder="Email"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
      />

      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
        placeholder="Password"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
      />

      <div className="w-full flex justify-between text-xs text-gray-600">
        <p className="cursor-pointer hover:underline">Forgot your password?</p>
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
        className={`mt-4 font-medium px-6 py-3 w-full rounded-md text-white transition duration-300 text-sm shadow-md bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50`}
        aria-label="Submit Button"
      >
        {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;