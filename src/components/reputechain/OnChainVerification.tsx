import { motion } from 'framer-motion';
import { Shield, ExternalLink, Lock, Clock, Hash, CheckCircle2, Fingerprint, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

const verificationData = [
  { icon: Shield, label: 'Reputation Score', value: '847 / 1000', highlight: true },
  { icon: Clock, label: 'Timestamp', value: '2026-03-19 · 12:00 UTC', highlight: false },
  { icon: Hash, label: 'Block Number', value: '#18,294,721', highlight: false },
  { icon: Lock, label: 'TX Hash', value: '0x7a3b…f9e2d1c4b8a6', highlight: false },
  { icon: Fingerprint, label: 'Proof Hash', value: 'Qm8k…x7n9p3', highlight: false },
];

const networkStats = [
  { label: 'Confirmations', value: '142' },
  { label: 'Network', value: 'Ethereum Local' },
];

export default function OnChainVerification() {
  const { user, reputation } = useData();
  const [attestation, setAttestation] = useState<any>(null);

  useEffect(() => {
    if (user?.walletAddress) {
      const token = localStorage.getItem('reputechain_token');
      fetch(`/api/reputation/attestation/${user.walletAddress}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(async (res) => {
        try { return await res.json(); } catch { return null; }
      })
      .then(data => {
        if (data && data.data && !data.data.notice) {
          setAttestation(data.data);
        }
      })
      .catch(console.error);
    }
  }, [user, reputation]);

  const timestamp = attestation ? new Date(attestation.timestamp * 1000).toLocaleString() : 'Not Anchored';
  const score = attestation ? `${attestation.score} / 100` : 'N/A';
  const hash = attestation ? `${attestation.ipfsHash.slice(0, 8)}...${attestation.ipfsHash.slice(-6)}` : 'N/A';

  const verificationData = [
    { icon: Shield, label: 'Reputation Score', value: score, highlight: true },
    { icon: Clock, label: 'Timestamp', value: timestamp, highlight: false },
    { icon: Fingerprint, label: 'IPFS Hash', value: hash, highlight: false },
    { icon: Lock, label: 'Issuer', value: attestation?.issuer ? `${attestation.issuer.slice(0,6)}...` : 'N/A', highlight: false },
  ];

  return (
    <section id="verify" className="py-28 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px]"
        style={{ background: 'hsl(265 90% 50% / 0.05)' }} />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neon-purple/80 font-display">Blockchain Proof</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-3 neon-text">
            On-Chain Verification
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            Immutable, transparent proof of your reputation stored on Ethereum
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Main Verification Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative"
          >
            {/* Animated border */}
            <div className="absolute -inset-px rounded-xl overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from 0deg, hsl(265 90% 65%), hsl(220 90% 60%), hsl(190 95% 60%), hsl(265 90% 65%))',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <div className="glass-card !border-0 relative p-6 sm:p-8">
              {/* Status */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${attestation ? 'bg-emerald-400' : 'bg-yellow-400'}`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className={`text-xs ${attestation ? 'text-emerald-400' : 'text-yellow-400'} font-display uppercase tracking-wider`}>
                    {attestation ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${attestation ? 'text-emerald-400' : 'text-yellow-400'}`} />
                  Ethereum Local
                </div>
              </div>

              <div className="space-y-0">
                {verificationData.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className={`flex items-center justify-between py-3.5 ${i < verificationData.length - 1 ? 'border-b border-border/20' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground/50" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className={`text-sm font-mono ${item.highlight ? 'font-display text-lg font-bold neon-text' : 'text-foreground/80'}`}>
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (attestation?.ipfsHash) {
                    if (attestation.ipfsHash.startsWith('QmFallback')) {
                      toast.info("Simulation Mode: You don't have Pinata API keys in your .env file, so this is a simulated local hash. Add Pinata keys to upload real data to IPFS!", { duration: 6000 });
                    } else {
                      window.open(`https://ipfs.io/ipfs/${attestation.ipfsHash}`, '_blank');
                    }
                  } else {
                    toast.error("No on-chain proof found. Please anchor your score first!");
                  }
                }}
                className="glow-button w-full mt-6 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Verify on Blockchain
              </motion.button>
            </div>
          </motion.div>

          {/* Side Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Network Status */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card !p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4 text-neon-blue" />
                <h3 className="text-sm font-display font-semibold text-foreground">Network Status</h3>
              </div>
              <div className="space-y-3">
                {networkStats.map((s) => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <span className="text-xs font-display font-bold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Verification History */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card !p-5"
            >
              <h3 className="text-sm font-display font-semibold text-foreground mb-4">Recent Proofs</h3>
              {[
                { score: 847, date: 'Mar 19', status: 'confirmed' },
                { score: 824, date: 'Mar 12', status: 'confirmed' },
                { score: 810, date: 'Mar 5', status: 'confirmed' },
              ].map((proof, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`flex items-center justify-between py-2.5 ${i < 2 ? 'border-b border-border/20' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-muted-foreground">{proof.date}</span>
                  </div>
                  <span className="text-xs font-display font-bold text-foreground">{proof.score}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
