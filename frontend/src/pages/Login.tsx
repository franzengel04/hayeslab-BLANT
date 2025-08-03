// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for standard email/password login
        console.log('Logging in with:', { email, password });
        alert(`Logging in with: ${email}`);
    };

    const handleGoogleLogin = () => {
        // Logic for Google Sign-In
        console.log('Initiating Google Sign-In...');
        alert('Signing in with Google...');
    };

    return (
        <div className="li-pageContainer">
            <div className="li-loginBox">
                <h2 className="li-title">Welcome Back</h2>
                <p className="li-subtitle">Sign in to continue</p>

                <button onClick={handleGoogleLogin} className="li-googleButton">
                    {/* A simple SVG for the Google icon */}
                    <svg className="li-googleIcon" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                </button>

                <div className="li-separator">
                    <span>OR</span>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="li-formGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="li-formGroup">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Link to="/forgot-password" className="li-forgotLink">Forgot password?</Link>

                    <button type="submit" className="li-submitButton">Sign In</button>
                </form>

                <p className="li-registerLink">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
