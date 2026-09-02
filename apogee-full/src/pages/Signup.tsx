import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Animate from '@/components/Animate';
import { signup, setAuth } from '@/lib/api';

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signup({
        email,
        password,
        full_name: fullName,
        company: company || undefined,
      });
      setAuth(data.access_token, data.user);
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Animate delay={100} direction="up">
      <div className="w-full max-w-[400px]">
        <h1 className="text-white text-[28px] sm:text-[32px] font-[450] mb-2">Create your account</h1>
        <p className="text-white/55 text-[15px] mb-8">Start elevating your essential data</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 rounded-[12px] bg-red-500/15 border border-red-500/30 text-red-300 text-[13px]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/70 text-[13px] mb-1.5">Full name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[15px] focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/70 text-[13px] mb-1.5">Work email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[15px] focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/70 text-[13px] mb-1.5">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
              className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[15px] focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/70 text-[13px] mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[15px] focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-2 bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-white/50 text-[14px]">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Animate>
  );
}
