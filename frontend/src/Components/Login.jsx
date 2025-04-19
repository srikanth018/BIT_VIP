import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios"; // Install axios if not already installed
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after login
import womanImg from "../assets/woman-choosing-dates-calendar-appointment-booking.png";

export function Login() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      // Store the token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to the dashboard or another page
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
    }
  };

  return (
    
    <section className="grid grid-cols-1 md:grid-cols-2 h-screen items-center bg-teal-50">
        
      {/* Image */}
      <div className="flex justify-center p-8">
        <img src={womanImg} alt="Booking Illustration" className="max-w-full" />
      </div>

      {/* Form */}
      <div className="w-full max-w-lg mx-auto p-10 bg-white rounded-2xl shadow-[0_4px_6px_2px_rgba(14,165,233,0.4)] backdrop-blur-md border border-white">
  <div className="text-center mb-8">
    
    <h1 className="text-lg font-bold text-sky-500 mb-2">Welcome Back</h1>
    <div className="text-sky-600 text-3xl font-bold mb-2">
        BIT - Venue Information Portal
      </div>
    <p className="text-gray-400 text-sm">
      Sign in to access your account
    </p>
  </div>
  
  {error && (
    <div className="mb-6 p-3 bg-red-50/70 text-red-600 rounded-lg text-sm backdrop-blur-sm">
      {error}
    </div>
  )}
  
  <form className="space-y-6" onSubmit={handleSubmit}>
    {/* Email Field */}
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        Email Address
      </label>
      <div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  </div>
  <input
    id="email"
    type="email"
    name="email"
    placeholder="name@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
      className="block w-full pl-10 pr-10 py-3 text-gray-900 bg-white rounded-lg border border-sky-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-200 focus:outline-none transition"
  />
</div>


    </div>

{/* Password Field */}
<div>
  <div className="flex justify-between items-center mb-1.5">
    <label
      htmlFor="password"
      className="block text-sm font-medium text-gray-700"
    >
      Password
    </label>
    <a href="#" className="text-sm text-sky-600 hover:text-sky-500">
      Forgot password?
    </a>
  </div>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    </div>
    <input
      id="password"
      type={passwordShown ? "text" : "password"}
      name="password"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="block w-full pl-10 pr-10 py-3 text-gray-900 bg-white rounded-lg border border-sky-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-200 focus:outline-none transition"
    />
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
    >
      {passwordShown ? (
        <EyeSlashIcon className="h-5 w-5" />
      ) : (
        <EyeIcon className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

    {/* Remember Me & Submit */}
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
          Remember me
        </label>
      </div>
    </div>

    <button
      type="submit"
      className="w-full px-6 py-3.5 text-white bg-gradient-to-r from-sky-500/90 to-sky-600 rounded-lg hover:from-sky-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500/50 font-medium transition shadow-md"
    >
      Sign In
    </button>
  </form>

  <div className="mt-6 text-center">
    <p className="text-sm text-gray-600">
      Don't have an account?{' '}
      <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
        Sign up
      </a>
    </p>
  </div>
</div>
    </section>
  );
}

export default Login;
