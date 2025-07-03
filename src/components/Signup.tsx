import React, { useState } from 'react';
import { UserPlus, Mail, Lock, KeyRound } from 'lucide-react';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Simulate API call or registration logic
    console.log('Signup attempt:', { name, email, password });
    alert('Signup successful! (Simulated)');
    // In a real application, you would send this to a backend
    // and handle the response (e.g., redirect on success, show error on failure).
  };

  return (
    <section className="py-20 px-4 flex items-center justify-center min-h-screen">
      <div className="container mx-auto max-w-md relative z-10">
        <div className="bg-gradient-to-br from-[#1a237e]/70 to-[#00acc1]/40 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-white/10 shadow-xl">
          <div className="text-center mb-8">
            <UserPlus className="h-12 w-12 text-[#00acc1] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Join HireWise Today!
            </h2>
            <p className="text-gray-300">
              Create your free account and boost your job search.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#00acc1] focus:ring focus:ring-[#00acc1]/30 outline-none transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#00acc1] focus:ring focus:ring-[#00acc1]/30 outline-none transition-all"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#00acc1] focus:ring focus:ring-[#00acc1]/30 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#00acc1] focus:ring focus:ring-[#00acc1]/30 outline-none transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#00acc1] hover:bg-[#00acc1]/80 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <a href="#login" className="text-[#00acc1] hover:text-white transition-colors font-medium">
              Log In
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};