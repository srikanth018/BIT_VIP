import { useState } from "react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import axios from "axios"; // Install axios if not already installed
import { useNavigate } from "react-router-dom"; // For navigation after login

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
        <section className="grid text-center h-screen items-center p-8 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Sign In</h1>
                <p className="text-gray-600 text-base mb-8">
                    Enter your email and password to sign in
                </p>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form className="space-y-6" onSubmit={handleSubmit}>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-2 text-gray-900 bg-gray-100 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
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
                </form>
            </div>
        </section>
    );
}

export default Login;