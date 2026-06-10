import React, { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { ShieldAlert, PlusCircle } from 'lucide-react';

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const { createInvoice, isCreating } = useInvoices();
  const [buyer, setBuyer] = useState('');
  const [faceValue, setFaceValue] = useState('');
  const [dueDays, setDueDays] = useState('30');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!buyer || buyer.length !== 56 || !buyer.startsWith('G')) {
      setError('Buyer must be a valid Stellar public key (56 characters, starting with G)');
      return;
    }

    const valueNum = Number(faceValue);
    if (isNaN(valueNum) || valueNum <= 0) {
      setError('Face value must be a positive number');
      return;
    }

    const days = parseInt(dueDays, 10);
    if (isNaN(days) || days <= 0) {
      setError('Due date must be at least 1 day in the future');
      return;
    }

    try {
      const faceValueStroops = BigInt(Math.floor(valueNum * 10_000_000)).toString();
      const dueDateTimestamp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;

      await createInvoice({
        buyer,
        faceValue: faceValueStroops,
        dueDate: dueDateTimestamp,
      });

      setBuyer('');
      setFaceValue('');
      setDueDays('30');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Create New Invoice</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Buyer Wallet Address</label>
          <input
            type="text"
            placeholder="G..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            disabled={isCreating}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Face Value (USDC)</label>
            <input
              type="number"
              step="0.01"
              placeholder="1,000.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={faceValue}
              onChange={(e) => setFaceValue(e.target.value)}
              disabled={isCreating}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Due In (Days)</label>
            <input
              type="number"
              placeholder="30"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={dueDays}
              onChange={(e) => setDueDays(e.target.value)}
              disabled={isCreating}
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-2.5 transition-all duration-300"
        >
          {isCreating ? 'Creating Invoice...' : 'Create Invoice'}
        </Button>
      </form>
    </div>
  );
}
