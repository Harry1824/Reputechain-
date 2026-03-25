import { motion } from 'framer-motion';
import { Github, Linkedin, Code2, ArrowUpRight, CheckCircle2, Activity, GitPullRequest, Star, MessageSquare, Award, Users } from 'lucide-react';
import { UserPlus, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { useData } from '../../context/DataContext';

export default function PlatformIntegrations() {
  const { user, reputation, refreshData } = useData();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [linkingPlatform, setLinkingPlatform] = useState<string | null>(null);
  const [linkingValue, setLinkingValue] = useState('');

  if (!user) return null;

  const handleConnect = async (platformId: string, inputValue: string) => {
    setConnecting(platformId);
    try {
      const token = localStorage.getItem('reputechain_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (platformId === 'github') {
        await fetch('/api/user/connect/github', {
          method: 'POST',
          headers,
          body: JSON.stringify({ githubUsername: inputValue })
        });
      } else {
        const payload = {
          [platformId === 'linkedin' ? 'linkedinProfile' : 'stackoverflowProfile']: inputValue
        };
        await fetch('/api/user/profile', {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload)
        });
      }
      await refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(null);
    }
  };

  const getImpact = (key: string) => {
    return reputation?.breakDown?.[key]?.score || 0;
  };

  const platforms = [
    {
      id: "github",
      name: 'GitHub',
      icon: Github,
      connected: !!user.githubUsername,
      url: user.githubUsername ? `https://github.com/${user.githubUsername}` : '#',
      description: 'Code contributions & open source',
      stats: [
        { label: 'Contributions', value: '2', icon: Activity },
        { label: 'Stars Earned', value: '1', icon: Star },
        { label: 'Active Repos', value: '1', icon: GitPullRequest },
      ],
      color: 'hsl(265 90% 65%)',
      impact: getImpact('github'),
    },
    {
      id: "linkedin",
      name: 'LinkedIn',
      icon: Linkedin,
      connected: !!user.linkedinProfile,
      url: user.linkedinProfile || '#',
      description: 'Professional network & endorsements',
      stats: [
        { label: 'Endorsements', value: '5', icon: Award },
        { label: 'Connections', value: '2000', icon: Users },
        { label: 'Recommendations', value: '15', icon: MessageSquare },
      ],
      color: 'hsl(220 90% 60%)',
      impact: getImpact('linkedin'),
    },
    {
      id: "stackoverflow",
      name: 'Stack Overflow',
      icon: Code2,
      connected: !!user.stackoverflowProfile,
      url: user.stackoverflowProfile || '#',
      description: 'Technical expertise & answers',
      stats: [
        { label: 'Reputation', value: '24', icon: Star },
        { label: 'Best Answers', value: '15', icon: MessageSquare },
        { label: 'Gold Badges', value: '5', icon: Award },
      ],
      color: 'hsl(190 95% 60%)',
      impact: getImpact('stackoverflow'),
    },
  ];

  function TiltCard({ children, className, color, href }: { children: React.ReactNode; className?: string; color: string; href?: string }) {
    const [style, setStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMove = (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setStyle({ transform: `perspective(1000px) rotateY(${(x - 0.5) * 10}deg) rotateX(${-(y - 0.5) * 10}deg)` });
      setGlowPos({ x: x * 100, y: y * 100 });
    };

    const Component = href ? 'a' : 'div';

    return (
      <Component
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noreferrer" : undefined}
        className={`relative block cursor-pointer group/card ${className}`}
        style={{ ...style, transition: 'transform 0.15s ease-out' }}
        onMouseMove={handleMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
          setGlowPos({ x: 50, y: 50 });
          setIsHovered(false);
        }}
      >
        <div
          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${color}18, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
        {children}
      </Component>
    );
  }

  return (
    <section id="integrations" className="py-28 relative">
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-[150px]"
        style={{ background: 'hsl(220 90% 50% / 0.04)' }} />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neon-blue/80 font-display">Connected Sources</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-3 neon-text">
            Platform Integrations
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            Your reputation is built from verified data across multiple platforms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group"
            >
              <TiltCard className="h-full" color={p.color} href={p.connected && p.url !== '#' ? p.url : undefined}>
                <div className="glass-card !p-0 h-full overflow-hidden">
                  {/* Header */}
                  <div className="p-5 pb-4" style={{ borderBottom: `1px solid ${p.color}20` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${p.color}12` }}>
                          <p.icon className="h-5 w-5" style={{ color: p.color }} />
                        </div>
                        <div>
                          <h3 className="font-display text-sm font-semibold text-foreground">{p.name}</h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            {p.connected ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" style={{ color: p.color }} />
                                <span className="text-[10px] text-muted-foreground">Connected</span>
                              </>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/50">Not Connected</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {p.connected ? (
                        p.url !== '#' && (
                          <div className="block p-2 rounded-full bg-white/5 group-hover/card:bg-white/10 transition-colors">
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover/card:text-foreground/80 transition-colors" />
                          </div>
                        )
                      ) : (
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="relative z-20">
                          {connecting === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : linkingPlatform === p.id ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                value={linkingValue}
                                onChange={(e) => setLinkingValue(e.target.value)}
                                placeholder="Username/URL"
                                className="bg-background/50 border border-border/50 text-[10px] px-2 py-1 rounded w-24 text-foreground outline-none focus:border-neon-blue/50"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && linkingValue) {
                                    handleConnect(p.id, linkingValue);
                                    setLinkingPlatform(null);
                                    setLinkingValue('');
                                  }
                                }}
                              />
                              <button 
                                onClick={() => {
                                  if (linkingValue) {
                                    handleConnect(p.id, linkingValue);
                                    setLinkingPlatform(null);
                                    setLinkingValue('');
                                  } else {
                                    setLinkingPlatform(null);
                                  }
                                }}
                                className="bg-neon-blue/20 text-neon-blue p-1 rounded"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setLinkingPlatform(p.id);
                                setLinkingValue('');
                              }}
                              className="flex items-center gap-1 text-[10px] text-neon-blue/80 hover:text-neon-blue transition-colors px-2 py-1 rounded bg-neon-blue/10"
                            >
                              <UserPlus className="h-3 w-3" /> Connect
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{p.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="p-5 space-y-3">
                    {p.stats.map((s) => (
                      <div key={s.label} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <s.icon className="h-3 w-3 text-muted-foreground/50" />
                          <span className="text-xs text-muted-foreground">{s.label}</span>
                        </div>
                        <span className="font-display text-sm font-bold text-foreground">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Impact Bar */}
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">Impact Score</span>
                      <span className="text-[10px] font-display font-bold" style={{ color: p.color }}>{p.impact}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: p.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.impact}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
