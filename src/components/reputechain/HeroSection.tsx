import { motion } from 'framer-motion';
import { Wallet, User, ChevronDown, Sparkles, Shield, Globe } from 'lucide-react';
import FloatingScene from './FloatingScene';
import { useWeb3 } from '../../hooks/useWeb3';

const stats = [
  { label: 'Verified Users', value: '12,847', icon: Shield },
  { label: 'On-Chain Proofs', value: '1.2M+', icon: Sparkles },
  { label: 'Integrations', value: '15+', icon: Globe },
];

export default function HeroSection() {
  const { address, connect, isConnecting } = useWeb3();

  const handleConnect = async () => {
    const connectedAddress = await connect();
    if (connectedAddress) {
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloatingScene />

      {/* Layered glow overlays */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(265 90% 50% / 0.1) 0%, transparent 70%)',
      }} />
      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse 50% 50% at 70% 70%, hsl(220 90% 50% / 0.06) 0%, transparent 60%)',
      }} />
      <div className="absolute inset-0 z-[1]" style={{
        background: 'radial-gradient(ellipse 40% 40% at 20% 30%, hsl(190 95% 50% / 0.04) 0%, transparent 50%)',
      }} />

      {/* Hex grid pattern */}
      <div className="absolute inset-0 z-[1] opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(265 90% 65%) 1px, transparent 1px), linear-gradient(90deg, hsl(265 90% 65%) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 glass text-sm"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-neon-purple"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-muted-foreground text-xs font-display tracking-wide">
            Powered by Blockchain Technology
          </span>
          <Sparkles className="h-3 w-3 text-neon-purple/60" />
        </motion.div>

        {/* Title with staggered animation */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl sm:text-7xl lg:text-[6rem] font-bold tracking-tight mb-6 leading-[1.05]"
        >
          <span className="neon-text">Repute</span>
          <span className="text-foreground">Chain</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Own Your Digital Reputation —{' '}
          <span className="text-foreground/90">Decentralized</span>,{' '}
          <span className="text-foreground/90">Transparent</span>,{' '}
          <span className="text-foreground/90">On-Chain</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px hsl(265 90% 65% / 0.5)' }}
            whileTap={{ scale: 0.98 }}
            className="glow-button flex items-center justify-center gap-2 text-base !px-8 !py-3.5"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            <Wallet className="h-5 w-5" /> 
            {isConnecting ? "Connecting..." : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })}
            className="glow-button-outline flex items-center justify-center gap-2 text-base !px-8 !py-3.5"
          >
            <User className="h-5 w-5" /> View Profile
          </motion.button>
        </motion.div>

        {/* Stats with icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-14 mt-16"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="text-center group"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <s.icon className="h-4 w-4 text-neon-purple/60" />
                <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-muted-foreground/40 font-display tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-5 w-5 text-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
