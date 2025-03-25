function Login() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h1>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:shadow-sm hover:shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:shadow-sm hover:shadow-sm"

            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md cursor-pointer hover:bg-gray-800  hover:shadow-sm transition focus:shadow-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
