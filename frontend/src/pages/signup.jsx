
import React, { useState } from 'react';
import { endpoints, apiFetch } from '../config/api';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(
        endpoints.register,
        {
          method: 'POST',
          body: JSON.stringify({ email, password })
        }
      );
      localStorage.setItem('token', res.token);
      if (onSignup) onSignup();
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
      <Card className="w-full max-w-md shadow-2xl border border-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-sm p-2">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-900 p-3 rounded-xl shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">DocuMind</h1>
          <p className="text-sm text-slate-500 mt-2">Create your account to get started.</p>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              {/* Full name field removed as backend does not require it */}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  type="email"
                  placeholder="Email address"
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            {error && <div className="text-red-500 text-center text-sm font-medium bg-red-50 p-2 rounded-md">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2 pb-6">
            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-md" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-slate-900 font-semibold hover:underline decoration-slate-300 underline-offset-4 transition-all">Sign in</a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
