import { useState } from 'react';
import { useWalletStore } from '@/store/wallet';
import { connectFreighter } from '@/lib/freighter';

export function useWallet() {
  const { address, connected, network, connect, disconnect } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const addr = await connectFreighter();
      // Defaults to testnet passphrase or string as configured
      connect(addr, 'testnet');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      disconnect();
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    address,
    connected,
    network,
    connectWallet,
    disconnectWallet,
    loading,
    error,
  };
}
