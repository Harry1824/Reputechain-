import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { toast } from 'sonner';

export const useWeb3 = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      
      // Check if already connected
      web3Provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAddress(accounts[0].address);
        }
      });

      // Handle account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
        } else {
          setAddress(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      const msg = "Please install MetaMask to connect your wallet.";
      setError(msg);
      toast.error(msg);
      return null;
    }

    try {
      setIsConnecting(true);
      setError(null);
      // Explicitly request connection
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAddress = accounts[0];
      setAddress(currentAddress);
      setIsConnecting(false);
      toast.success("Wallet connected!");
      return currentAddress;
    } catch (err: any) {
      setIsConnecting(false);
      const msg = err.message || "Failed to connect to wallet";
      setError(msg);
      toast.error(msg);
      return null;
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return { provider, address, isConnecting, error, connect, disconnect };
};
