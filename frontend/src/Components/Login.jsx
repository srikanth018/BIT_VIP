import { useState } from "react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

export function Login() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  return (
    <section className="grid text-center h-screen items-center p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Sign In</h1>
        <p className="text-gray-600 text-base mb-8">
          Enter your email and password to sign in
        </p>
        <form className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@mail.com"
              className="block w-full px-4 py-2 text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={passwordShown ? "text" : "password"}
                name="password"
                placeholder="********"
                className="block w-full px-4 py-2 text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisiblity}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {passwordShown ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {/* Sign-In Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          {/* Google Sign-In */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <img
              src="https://www.material-tailwind.com/logos/logo-google.png"
              alt="google"
              className="h-5 w-5"
            />
            Sign in with Google
          </button>
          {/* Registration Link */}
          <p className="text-center text-sm text-gray-600">
            Not registered?{" "}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Create an account
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
