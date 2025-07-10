import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
    <div>
      <h1 className="text-6xl font-bold text-gray-700 mb-2">404</h1>
      <p className="text-gray-500 text-lg mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
