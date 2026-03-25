import { motion, useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Zap, Shield, Users, Target, Award, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

const categoryConfig = {
  github: { name: 'Code Quality', icon: Zap, color: 'hsl(265 90% 65%)' },
  linkedin: { name: 'Community Trust', icon: Users, color: 'hsl(220 90% 60%)' },
  stackoverflow: { name: 'Professional XP', icon: Target, color: 'hsl(190 95% 60%)' },
  upwork: { name: 'Delivery Reliability', icon: Shield, color: 'hsl(280 80% 60%)' },
};

const recentActivity = [
  { action: 'Score Analyzed', detail: 'GitHub Commits Verified', time: 'Just now', change: '+2' },
  { action: 'Identity Linked', detail: 'Wallet Address Auth', time: '1h ago', change: 'Auth' },
  { action: 'Community', detail: 'StackOverflow parsing', time: '1h ago', change: 'Scan' },
];

function AnimatedNumber({ target, inView, suffix = '' }: { target: number; inView: boolean; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, target]);
  return <span>{display}{suffix}</span>;
}

/* ── Radar Chart SVG ── */
function RadarChart({ inView, categories }: { inView: boolean, categories: any[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const levels = 4;
  const maxR = 75;

  const axes = categories.map((_, i) => {
    const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  });

  const gridPaths = Array.from({ length: levels }, (_, level) => {
    const r = ((level + 1) / levels) * maxR;
    const points = axes.map(a => `${cx + a.x * r},${cy + a.y * r}`).join(' ');
    return `M${points.split(' ').join('L')}Z`;
  });

  const dataPoints = categories.map((cat, i) => {
    const r = (cat.value / cat.max) * maxR; // Dynamic boundary scaling
    return `${cx + axes[i].x * r},${cy + axes[i].y * r}`;
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px] mx-auto">
      {/* Grid */}
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="hsl(240 15% 20%)" strokeWidth="0.5" opacity={0.5} />
      ))}
      {/* Axis lines */}
      {axes.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + a.x * maxR} y2={cy + a.y * maxR}
          stroke="hsl(240 15% 20%)" strokeWidth="0.5" opacity={0.3} />
      ))}
      {/* Radar scanning effect */}
      <motion.g
        style={{ transformOrigin: '100px 100px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <path d={`M 100 100 L 100 25 A 75 75 0 0 1 153 47 Z`} fill="url(#sweepGrad)" />
        <line x1="100" y1="100" x2="100" y2="25" stroke="hsl(265 90% 65%)" strokeWidth="1.5" opacity="0.5" />
      </motion.g>
      {/* Data polygon */}
      <motion.polygon
        points={dataPoints.join(' ')}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      />
      {/* Data points */}
      {dataPoints.map((pt, i) => {
        const [x, y] = pt.split(',').map(Number);
        return (
          <motion.circle key={i} cx={x} cy={y} r="3"
            fill={categories[i].color}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        );
      })}
      {/* Labels */}
      {categories.map((cat, i) => {
        const labelR = maxR + 18;
        const x = cx + axes[i].x * labelR;
        const y = cy + axes[i].y * labelR;
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fill="hsl(220 10% 55%)" fontSize="7" fontFamily="Space Grotesk, sans-serif">
            {cat.name}
          </text>
        );
      })}
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(265 90% 65%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(220 90% 60%)" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(265 90% 65%)" />
          <stop offset="100%" stopColor="hsl(190 95% 60%)" />
        </linearGradient>
        <linearGradient id="sweepGrad" x1="0.5" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="hsl(265 90% 65%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(265 90% 65%)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Main Score Ring ── */
function ScoreRing({ inView, score }: { inView: boolean, score: number }) {
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-56 h-56 mx-auto">
      <div className="absolute inset-0 rounded-full blur-2xl" style={{
        background: 'radial-gradient(circle, hsl(265 90% 65% / 0.15) 0%, transparent 70%)',
      }} />
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(240 15% 12%)" strokeWidth="5" />
        {Array.from({ length: 50 }).map((_, i) => {
          const angle = (i / 50) * Math.PI * 2 - Math.PI / 2;
          return (
            <line key={i}
              x1={100 + Math.cos(angle) * 80} y1={100 + Math.sin(angle) * 80}
              x2={100 + Math.cos(angle) * 83} y2={100 + Math.sin(angle) * 83}
              stroke="hsl(240 15% 22%)" strokeWidth="0.8"
            />
          );
        })}
        <motion.circle
          cx="100" cy="100" r="88" fill="none"
          stroke="url(#scoreGrad2)" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.circle
          cx="100" cy="100" r="88" fill="none"
          stroke="url(#scoreGrad2)" strokeWidth="14"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          opacity={0.12} filter="blur(8px)"
        />
        <defs>
          <linearGradient id="scoreGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(265 90% 65%)" />
            <stop offset="40%" stopColor="hsl(220 90% 60%)" />
            <stop offset="100%" stopColor="hsl(190 95% 60%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold neon-text">
          <AnimatedNumber target={score} inView={inView} />
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5">/ 100</span>
        <div className="flex items-center gap-1 mt-2">
          <Award className="h-3 w-3 text-neon-purple" />
          <span className="text-[10px] text-neon-purple/80 font-display tracking-wider uppercase">Verified</span>
        </div>
      </div>
    </div>
  );
}

export default function ReputationDashboard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { reputation, user, refreshData } = useData();
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [anchorTx, setAnchorTx] = useState<string | null>(null);

  const handleAnchor = async () => {
    setIsAnchoring(true);
    try {
      const token = localStorage.getItem('reputechain_token');
      const res = await fetch('/api/reputation/anchor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (res.ok && data.txHash) {
        setAnchorTx(data.txHash);
        toast.success(`Successfully anchored to blockchain!`);
        
        // Refresh global data to force OnChainVerification to catch the new attestation
        if (refreshData) {
          await refreshData();
        }
      } else {
        toast.error(data.message || 'Failed to anchor score');
      }
    } catch (err) {
      toast.error('Error anchoring score to blockchain');
    } finally {
      setIsAnchoring(false);
    }
  };

  if (!reputation) return null;

  const score = reputation.score || 0;
  
  const maxScores: Record<string, number> = { github: 40, linkedin: 30, upwork: 30, stackoverflow: 20 };

  const getGrade = (score: number, max: number) => {
    if (score === 0) return 'N/A';
    const pct = score / max;
    if (pct >= 0.9) return 'S';
    if (pct >= 0.8) return 'A+';
    if (pct >= 0.7) return 'A';
    if (pct >= 0.5) return 'B';
    if (pct >= 0.3) return 'C';
    return 'D';
  };

  // Transform breaksDown from backend dynamically mapping it
  const mappedCategories = Object.keys(categoryConfig).map(key => {
    const meta = categoryConfig[key as keyof typeof categoryConfig];
    const item = reputation.breakDown?.[key];
    const categoryScore = item ? item.score : 0;
    const categoryMax = maxScores[key] || 100;
    return {
      ...meta,
      value: categoryScore,
      max: categoryMax,
      tag: getGrade(categoryScore, categoryMax)
    };
  });

  return (
    <section id="dashboard" className="py-28 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[150px]"
        style={{ background: 'hsl(265 90% 50% / 0.05)' }} />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neon-purple/80 font-display">Analytics</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-3 neon-text">
            Reputation Dashboard
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            Real-time reputation metrics aggregated from verified on-chain and off-chain sources
          </p>
        </motion.div>

        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Top row: Score + Radar + Stats */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="glass-card !p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-display font-semibold text-foreground">Reputation Score</h3>
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>Real-time</span>
                </div>
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <ScoreRing inView={inView} score={score} />
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/20 text-center">
                {user?.walletAddress ? (
                  <button 
                    onClick={handleAnchor}
                    disabled={isAnchoring}
                    className="glow-button w-full flex items-center justify-center gap-2 text-sm !py-2.5"
                  >
                    <Zap className="h-4 w-4" /> 
                    {isAnchoring ? "Broadcasting TX..." : "Anchor Score on Blockchain"}
                  </button>
                ) : (
                  <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-md">
                    Connect wallet on home page to anchor score
                  </div>
                )}
                {anchorTx && (
                  <div className="mt-2 text-[10px] text-emerald-400 truncate">
                    TX: {anchorTx}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Radar Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="glass-card !p-6"
            >
              <h3 className="text-sm font-display font-semibold text-foreground mb-4">Skill Radar</h3>
              <RadarChart inView={inView} categories={mappedCategories} />
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card !p-6"
            >
              <h3 className="text-sm font-display font-semibold text-foreground mb-5">Categories</h3>
              <div className="space-y-4">
                {mappedCategories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                        <span className="text-xs text-muted-foreground">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-display font-bold px-1.5 py-0.5 rounded-md" 
                          style={{ background: `${cat.color}15`, color: cat.color }}>
                          {cat.tag}
                        </span>
                        <span className="font-display text-sm font-bold" style={{ color: cat.color }}>
                          <AnimatedNumber target={cat.value} inView={inView} suffix="%" />
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}66)` }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${cat.value}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card !p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-foreground">Recent Activity</h3>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center justify-between p-3 rounded-lg group cursor-default"
                  style={{ background: 'hsl(240 15% 10% / 0.5)', border: '1px solid hsl(240 15% 18% / 0.3)' }}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{item.action}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{item.detail}</div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">{item.time}</div>
                  </div>
                  <span className="text-xs font-display font-bold text-emerald-400 ml-2 flex-shrink-0">
                    {item.change}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
