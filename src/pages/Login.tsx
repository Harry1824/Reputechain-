import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      let data: any = {};
      try { data = await res.json(); } catch { if (!res.ok) throw new Error('Server unreachable'); }
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
      
      setResendTimer(60);
      toast.success('OTP resent successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isForgotPassword) {
        if (!otpSent) {
          const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          let data: any = {};
          try { data = await res.json(); } catch { if (!res.ok) throw new Error('Server unreachable'); }
          if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
          setOtpSent(true);
          setResendTimer(60);
        } else {
          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
          });
          let data: any = {};
          try { data = await res.json(); } catch { if (!res.ok) throw new Error('Server unreachable'); }
          if (!res.ok) throw new Error(data.message || 'Failed to reset password');
          
          setIsForgotPassword(false);
          setOtpSent(false);
          setOtp('');
          setNewPassword('');
          setIsLogin(true);
        }
      } else {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const bodyPayload = isLogin ? { email, password } : { name, email, password };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });
        
        let data: any = {};
        try { data = await res.json(); } catch { if (!res.ok) throw new Error('Server unreachable'); }
        if (!res.ok) {
          throw new Error(data.message || data.error || 'Failed to authenticate');
        }

        localStorage.setItem('reputechain_token', data.tokens.access.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: 'hsl(265 90% 65%)' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 relative z-10 mx-4"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold neon-text mb-2">
            {isForgotPassword 
              ? (otpSent ? 'Verify OTP' : 'Reset Password') 
              : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isForgotPassword 
              ? (otpSent ? 'Enter the 6-digit code sent to your email' : 'We will send an OTP via email to reset your password')
              : (isLogin ? 'Sign in to your ReputeChain dashboard' : 'Start your decentralized reputation journey')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isForgotPassword && !isLogin && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          {(!isForgotPassword || (isForgotPassword && !otpSent)) && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                placeholder="hariom@example.com"
              />
            </div>
          )}

          {isForgotPassword && otpSent && (
            <>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">6-Digit OTP</label>
                <input 
                  type="text" 
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all tracking-widest"
                  placeholder="123456"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">New Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="text-xs text-neon-purple hover:text-neon-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Tap to resend OTP'}
                </button>
              </div>
            </>
          )}

          {!isForgotPassword && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {!isForgotPassword && isLogin && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(true); setError(''); }}
                className="text-xs text-neon-purple hover:text-neon-purple/80 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-white text-black font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center font-display"
          >
            {loading ? 'Processing...' : (
              isForgotPassword 
                ? (otpSent ? 'Confirm Password Reset' : 'Send OTP') 
                : (isLogin ? 'Sign In' : 'Create Account')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              if (isForgotPassword) {
                setIsForgotPassword(false);
                setOtpSent(false);
              } else {
                setIsLogin(!isLogin);
              }
              setError('');
            }} 
            className="text-sm text-muted-foreground hover:text-white transition-colors"
          >
            {isForgotPassword 
              ? 'Back to Login' 
              : (isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
