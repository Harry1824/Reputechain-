import { motion } from 'framer-motion';
import { Copy, Download, Award, Star, Shield, ExternalLink, Verified, Globe, Github, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function PublicProfile() {
  const { user, reputation } = useData();
  const [copied, setCopied] = useState(false);

  const score = reputation?.score || 0;
  const tier = score >= 80 ? 'Elite' : score >= 50 ? 'Trusted' : 'Rising';
  
  const stats = [
    { label: 'Score', value: score.toString() },
    { label: 'Proofs', value: user?.walletAddress && score > 10 ? '1' : '0' },
    { label: 'Rank', value: score > 80 ? '#142' : score > 50 ? '#1,402' : '#10k+' },
  ];

  const badges = [];
  if (score >= 80) badges.push({ emoji: '🏆', label: 'Elite' });
  else if (score >= 50) badges.push({ emoji: '🌟', label: 'Trusted' });
  else badges.push({ emoji: '🌱', label: 'Rising' });

  if (user?.githubUsername) badges.push({ emoji: '💻', label: 'Builder' });
  if (user?.linkedinProfile) badges.push({ emoji: '👔', label: 'Pro' });

  if (badges.length < 3) badges.push({ emoji: '⚡', label: 'Active' });
  if (badges.length < 3) badges.push({ emoji: '🔥', label: 'Pioneer' });
  
  const displayBadges = badges.slice(0, 3);

  const handleCopy = () => {
    const profileUrl = user?.githubUsername ? `https://reputechain.io/u/${user.githubUsername}` : 'https://reputechain.io/profile';
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBadge = () => {
    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E1B2E"/>
            <stop offset="100%" stop-color="#0F0D15"/>
          </linearGradient>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8B5CF6"/>
            <stop offset="100%" stop-color="#3B82F6"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="316" height="116" rx="14" fill="url(#bg)" stroke="url(#borderGrad)" stroke-width="2"/>
        <text x="24" y="36" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#A78BFA" letter-spacing="2">REPUTECHAIN IDENTITY</text>
        <text x="24" y="68" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="#F8FAFC">${user?.name || 'Verified User'}</text>
        <text x="24" y="94" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="#10B981">${tier} Tier</text>
        
        <circle cx="260" cy="60" r="40" fill="#8B5CF6" fill-opacity="0.1" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="4 4"/>
        <text x="260" y="65" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#34D399" text-anchor="middle">${score}</text>
        <text x="260" y="85" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#9CA3AF" text-anchor="middle">SCORE</text>
      </svg>
    `;
    
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reputechain-badge-${user?.name?.replace(/\\s+/g, '_').toLowerCase() || 'user'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="profile" className="py-28 relative">
      <div className="absolute top-0 left-0 w-[400px] h-[300px] rounded-full blur-[120px]"
        style={{ background: 'hsl(220 90% 50% / 0.04)' }} />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neon-cyan/80 font-display">Identity</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-3 neon-text">
            Public Profile
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            Your verifiable on-chain identity — share it with the world
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 text-center relative overflow-hidden">
              {/* Header gradient */}
              <div className="absolute top-0 left-0 right-0 h-28" style={{
                background: 'linear-gradient(135deg, hsl(265 90% 65% / 0.12), hsl(220 90% 60% / 0.08), hsl(190 95% 60% / 0.05))',
              }} />

              {/* Avatar */}
              <div className="relative z-10 mt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center relative"
                  style={{ background: 'linear-gradient(135deg, hsl(265 90% 65%), hsl(220 90% 60%))' }}
                >
                  <span className="font-display text-2xl font-bold text-primary-foreground">HK</span>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2"
                    style={{ borderColor: 'hsl(240 15% 8%)' }}
                  >
                    <Verified className="h-3 w-3 text-primary-foreground" />
                  </div>
                </motion.div>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mt-4 mb-0.5 relative z-10">
                {user?.name?.toLowerCase() === 'hariom' ? 'Hariom Kumar' : user?.name || 'Hariom Kumar'}
              </h3>
              <p className="text-sm text-muted-foreground mb-1 relative z-10">Full-Stack Developer · Web3 Builder</p>
              <p className="text-[11px] text-muted-foreground/60 mb-4 relative z-10">
                {user?.walletAddress ? `${user.walletAddress.slice(0,6)}...${user.walletAddress.slice(-4)}` : 'No Wallet Connected'}
              </p>

              {/* Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 cursor-default relative z-10"
                style={{ background: 'hsl(265 90% 65% / 0.1)', border: '1px solid hsl(265 90% 65% / 0.2)' }}
              >
                <Award className="h-4 w-4 text-neon-purple" />
                <span className="text-xs font-display font-semibold neon-text">{tier} Reputation · {score}</span>
                <Star className="h-3 w-3 text-neon-purple" />
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
                {stats.map((s) => (
                  <div key={s.label} className="py-2.5 rounded-lg" style={{ background: 'hsl(240 15% 10% / 0.6)' }}>
                    <div className="font-display text-sm font-bold text-foreground">{s.value}</div>
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopy}
                  className="glow-button-outline flex-1 flex items-center justify-center gap-1.5 text-xs !py-2.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadBadge}
                  className="glow-button flex-1 flex items-center justify-center gap-1.5 text-xs !py-2.5"
                >
                  <Download className="h-3.5 w-3.5" /> Badge
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Connected Accounts */}
            <div className="glass-card !p-5">
              <h4 className="text-sm font-display font-semibold text-foreground mb-4">Connected Accounts</h4>
              {[
                { name: 'GitHub', icon: Github, handle: user?.githubUsername || 'Not connected', verified: !!user?.githubUsername },
                { name: 'LinkedIn', icon: Linkedin, handle: user?.linkedinProfile || 'Not connected', verified: !!user?.linkedinProfile },
                { name: 'Stack Overflow', icon: Globe, handle: user?.stackoverflowProfile || 'Not connected', verified: !!user?.stackoverflowProfile },
              ].map((acc, i) => (
                <motion.div
                  key={acc.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`flex items-center justify-between py-3 ${i < 2 ? 'border-b border-border/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <acc.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs font-medium text-foreground">{acc.name}</span>
                      <div className="text-[10px] text-muted-foreground">{acc.handle}</div>
                    </div>
                  </div>
                  {acc.verified && (
                    <div className="flex items-center gap-1">
                      <Verified className="h-3 w-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Verified</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Achievements */}
            <div className="glass-card !p-5">
              <h4 className="text-sm font-display font-semibold text-foreground mb-4">Achievements</h4>
              <div className="grid grid-cols-3 gap-2">
                {displayBadges.map((badge) => (
                  <motion.div
                    key={badge.label}
                    whileHover={{ scale: 1.08 }}
                    className="text-center py-3 rounded-lg cursor-default"
                    style={{ background: 'hsl(265 90% 65% / 0.06)', border: '1px solid hsl(265 90% 65% / 0.1)' }}
                  >
                    <div className="text-lg mb-1">{badge.emoji}</div>
                    <div className="text-[10px] text-muted-foreground">{badge.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
