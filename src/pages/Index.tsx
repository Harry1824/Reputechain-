import Navbar from '@/components/reputechain/Navbar';
import HeroSection from '@/components/reputechain/HeroSection';
import ReputationDashboard from '@/components/reputechain/ReputationDashboard';
import PlatformIntegrations from '@/components/reputechain/PlatformIntegrations';
import OnChainVerification from '@/components/reputechain/OnChainVerification';
import PublicProfile from '@/components/reputechain/PublicProfile';
import ParticleField from '@/components/reputechain/ParticleField';
import { DataProvider, useData } from '@/context/DataContext';

const IndexContent = () => {
  const { loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-neon-blue font-display animate-pulse">Loading Web3 Assets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticleField />
      <Navbar />
      <HeroSection />

      {/* Divider */}
      <div className="relative h-px max-w-4xl mx-auto">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, transparent, hsl(265 90% 65% / 0.3), hsl(220 90% 60% / 0.3), transparent)',
        }} />
      </div>

      <ReputationDashboard />

      <div className="relative h-px max-w-4xl mx-auto">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, transparent, hsl(220 90% 60% / 0.2), transparent)',
        }} />
      </div>

      <PlatformIntegrations />

      <div className="relative h-px max-w-4xl mx-auto">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, transparent, hsl(265 90% 65% / 0.2), transparent)',
        }} />
      </div>

      <OnChainVerification />

      <div className="relative h-px max-w-4xl mx-auto">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, transparent, hsl(190 95% 60% / 0.2), transparent)',
        }} />
      </div>

      <PublicProfile />

      {/* Footer */}
      <footer className="py-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, hsl(265 90% 65% / 0.2), transparent)',
        }} />
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:flex-1">
              <span className="font-display text-sm font-bold neon-text">ReputeChain</span>
              <span className="text-xs text-muted-foreground">© 2026</span>
            </div>
            
            <div className="text-xs text-muted-foreground sm:flex-1 text-center font-medium">
              Made with <span className="text-red-500">❤️</span> by Hariom Kumar
            </div>

            <div className="flex gap-6 sm:flex-1 justify-center sm:justify-end">
              <a href="#" className="block text-sm text-white/50 hover:text-white transition-colors">Documentation</a>
              <a href="https://github.com/Harry1824" target="_blank" rel="noreferrer" className="block text-sm text-white/50 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="block text-sm text-white/50 hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Index = () => (
  <DataProvider>
    <IndexContent />
  </DataProvider>
);

export default Index;
