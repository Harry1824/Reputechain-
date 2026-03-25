import { createContext, useContext, useEffect, useState } from 'react';

type DataContextType = {
  user: any;
  reputation: any;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [reputation, setReputation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('reputechain_token');
      if (!token) throw new Error('No token found');

      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, repRes] = await Promise.all([
        fetch('/api/user/profile', { headers }),
        fetch('/api/reputation/calculate', { headers })
      ]);

      if (userRes.status === 401 || repRes.status === 401) {
        localStorage.removeItem('reputechain_token');
        window.location.href = '/login';
        return;
      }

      if (!userRes.ok || !repRes.ok) throw new Error('Failed to fetch data');

      let userData: any = {};
      let repData: any = {};
      try { userData = await userRes.json(); } catch {}
      try { repData = await repRes.json(); } catch {}

      setUser(userData?.user || null);
      setReputation(repData?.data || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ user, reputation, loading, error, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
