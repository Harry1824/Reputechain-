import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useWeb3 } from '../../hooks/useWeb3';

const navLinks = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Verify', href: '#verify' },
  { label: 'Profile', href: '#profile' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useData();
  const navigate = useNavigate();
  const { address, connect, isConnecting } = useWeb3();

  const handleLogout = () => {
    localStorage.removeItem('reputechain_token');
    navigate('/login');
  };

  const handleConnect = async () => {
    const connectedAddress = await connect();
    if (connectedAddress && user) {
      const token = localStorage.getItem('reputechain_token');
      if (token) {
        try {
          await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ walletAddress: connectedAddress })
          });
        } catch (err) {
          console.error('Failed to sync wallet address', err);
        }
      }
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-neon-purple/5' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/20 group-hover:bg-primary/30 transition-colors">
            <Zap className="h-4 w-4 text-neon-purple" />
          </div>
          <span className="font-display text-lg font-bold neon-text">ReputeChain</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              {l.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-3/4 transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={address ? undefined : handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors bg-secondary/50 px-4 py-2 rounded-lg"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting..." : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
          </button>
          
          {user && (
            <span className="text-sm font-semibold text-foreground border-l border-border/50 pl-4">
              {user?.name?.toLowerCase() === 'hariom' ? 'Hariom Kumar' : user?.name}
            </span>
          )}
          <button onClick={handleLogout} className="glow-button flex items-center gap-2 text-sm !px-5 !py-2.5 ml-2">
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-foreground p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/30 px-6 pb-5 overflow-hidden"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="block py-3 text-sm text-muted-foreground hover:text-foreground border-b border-border/10"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </motion.a>
            ))}
            <button 
              onClick={address ? undefined : handleConnect}
              disabled={isConnecting}
              className="mt-6 flex items-center justify-center gap-2 text-sm w-full bg-secondary/50 py-3 rounded-lg text-white"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? "Connecting..." : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
            </button>
            <button onClick={handleLogout} className="glow-button mt-4 flex items-center gap-2 text-sm w-full justify-center !py-2.5">
               Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
