import React from 'react';
import { TxHistoryItem } from '@/types';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';

interface TxHistoryProps {
  history: TxHistoryItem[];
}

export function TxHistory({ history }: TxHistoryProps) {
  const getStellarExpertUrl = (hash: string) => {
    return `https://stellar.expert/explorer/testnet/tx/${hash}`;
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Transaction History</h3>
      {history.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-6">No transactions recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center bg-slate-950/45 border border-slate-900 rounded-xl p-4 transition-all hover:bg-slate-900/60"
            >
              <div className="flex items-center gap-3">
                {tx.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <div>
                  <span className="font-semibold text-white text-sm block">{tx.type}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(tx.timestamp * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {tx.amount && (
                  <span className="text-sm font-bold text-white block">
                    {tx.amount} {tx.token || 'USDC'}
                  </span>
                )}
                <a
                  href={getStellarExpertUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1 font-mono justify-end"
                >
                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
