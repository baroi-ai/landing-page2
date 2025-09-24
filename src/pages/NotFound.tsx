// src/pages/NotFound.tsx (or wherever you place this file)
import { useLocation, Link } from "react-router-dom"; // Import Link
import { useEffect } from "react";
import { Home } from "lucide-react"; // Optional: Add an icon to the link

/*
Ensure you have the following CSS class defined globally if you want the glow effect:
.glow-text {
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3),
               0 0 10px rgba(0, 190, 255, 0.4),
               0 0 15px rgba(0, 190, 255, 0.3);
  color: #ffffff; // Base color
}

Also ensure your dark background class (e.g., bg-dark-500) is defined in your Tailwind config.
*/

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the error to the console for debugging/monitoring
    console.error(`404 Not Found: Path "${location.pathname}" does not exist.`);
    // You could potentially send this to an error tracking service here
  }, [location.pathname]);

  return (
    // Use your primary dark background color
    <div className="min-h-screen flex items-center justify-center bg-dark-500 text-gray-100 px-4">
      <div className="text-center max-w-md w-full">
        {/* Large, prominent 404 heading with optional glow */}
        <h1 className="text-8xl md:text-9xl font-bold text-teal-500 mb-4 glow-text">
          404
        </h1>

        {/* Descriptive message with a softer color */}
        <p className="text-xl md:text-2xl text-gray-400 mb-8">
          Oops! Page Not Found
        </p>
        <p className="text-base text-gray-500 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Link back home using the cyan theme color */}
        <Link
          to="/" // Use Link for client-side routing
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-dark-500" // Added focus styles
        >
          <Home className="mr-2 h-5 w-5 " /> {/* Optional Icon */}
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
