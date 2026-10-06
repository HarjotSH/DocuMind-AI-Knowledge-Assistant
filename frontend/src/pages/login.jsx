
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
import { FiMail, FiLock } from 'react-icons/fi';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(
        endpoints.login,
        {
          method: 'POST',
          body: JSON.stringify({ email, password })
        }
      );
      localStorage.setItem('token', res.token);
      if (onLogin) onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Login failed');
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
          <p className="text-sm text-slate-500 mt-2">Welcome back. Please sign in to your account.</p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-4">
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
                  autoComplete="current-password"
                />
              </div>
            </div>
            {error && <div className="text-red-500 text-center text-sm font-medium bg-red-50 p-2 rounded-md">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2 pb-6">
            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-md" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <a href="/signup" className="text-slate-900 font-semibold hover:underline decoration-slate-300 underline-offset-4 transition-all">Sign up</a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
