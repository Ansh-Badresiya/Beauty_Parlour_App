import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
            <img
              src="logo.png"
              alt="Krisha Beauty Parlour Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="font-display text-2xl font-bold text-gray-800">
            Admin Login
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Krisha Beauty Parlour
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-7 shadow-xl space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@krishabeauty.com"
              required
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none text-base bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none text-base bg-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              <><Lock className="w-5 h-5" /> Login</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Only authorised admin can access this panel.
        </p>
      </div>
    </div>
  );
}
