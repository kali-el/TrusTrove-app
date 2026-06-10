'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { usePool } from '@/hooks/usePool';
import { useWalletStore } from '@/store/wallet';
import { WalletConnect } from '@/components/shared/WalletConnect';
import { Button } from '@/components/ui/button';
import { TrendingUp, Coins, Unlock, Percent, Landmark, Wallet, ShieldAlert } from 'lucide-react';

export default function LPDashboard() {
  const { address, connected } = useWalletStore();
  const {
    stats,
    isStatsLoading,
    position,
    isPositionLoading,
    deposit,
    isDepositing,
    depositError,
    withdraw,
    isWithdrawing,
    withdrawError,
  } = usePool();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawShares, setWithdrawShares] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatUSDC = (amount: bigint | undefined) => {
    if (amount === undefined) return '$0.00';
    return (Number(amount) / 10_000_000).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amountNum = Number(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid deposit amount');
      return;
    }
    try {
      const amountStroops = BigInt(Math.floor(amountNum * 10_000_000));
      await deposit({ amount: amountStroops });
      setDepositAmount('');
    } catch (err: any) {
      setError(err.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const sharesNum = Number(withdrawShares);
    if (isNaN(sharesNum) || sharesNum <= 0) {
      setError('Please enter a valid shares amount to withdraw');
      return;
    }
    try {
      const sharesStroops = BigInt(Math.floor(sharesNum * 10_000_000));
      await withdraw({ shares: sharesStroops });
      setWithdrawShares('');
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
    }
  };

  if (!connected) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center text-center py-20 max-w-md mx-auto">
          <div className="bg-emerald-600/10 border border-emerald-500/20 p-4 rounded-3xl mb-6">
            <Landmark className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Connect Your Wallet</h1>
          <p className="text-slate-400 text-sm mb-8">
            Connect your Freighter wallet to access the Liquidity Pool Dashboard, deposit USDC, and earn yield.
          </p>
          <WalletConnect />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Liquidity Pool Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Deposit USDC to fund invoice discounts and earn trade finance yields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-blue-400">
              <Landmark className="w-5 h-5" />
              <span className="text-sm font-semibold">Total Deposits</span>
            </div>
            <span className="text-2xl font-extrabold text-white">
              {isStatsLoading ? '...' : formatUSDC(stats?.totalDeposits)}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Total pool size</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-indigo-400">
              <Unlock className="w-5 h-5" />
              <span className="text-sm font-semibold">Available Liquidity</span>
            </div>
            <span className="text-2xl font-extrabold text-white">
              {isStatsLoading ? '...' : formatUSDC(stats?.availableLiquidity)}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Unutilized USDC</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-emerald-400">
              <Percent className="w-5 h-5" />
              <span className="text-sm font-semibold">Utilization Rate</span>
            </div>
            <span className="text-2xl font-extrabold text-white">
              {isStatsLoading ? '...' : `${((stats?.utilizationRateBps || 0) / 100).toFixed(2)}%`}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Percentage deployed</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-purple-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">Active Invoices</span>
            </div>
            <span className="text-2xl font-extrabold text-white">
              {isStatsLoading ? '...' : stats?.activeInvoiceCount || 0}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Currently financing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-lg">Your Pool Position</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block">Current Balance</span>
                  <span className="text-2xl font-extrabold text-white">
                    {isPositionLoading ? '...' : formatUSDC(position?.usdcValue)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4">
                  <div>
                    <span className="text-xs text-slate-400 block">LP Shares</span>
                    <span className="font-bold text-white text-sm">
                      {isPositionLoading ? '...' : (Number(position?.shares || 0n) / 10_000_000).toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Total Yield Earned</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {isPositionLoading ? '...' : formatUSDC(position?.yieldEarned)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/20 border border-slate-800/50 p-4 rounded-2xl text-xs text-slate-400 space-y-2">
              <h4 className="font-bold text-slate-300">Important Information</h4>
              <p>
                Liquidity provider deposits are utilized to fund qualified trade invoices at a discount. Yield is paid directly to your balance upon buyer invoice repayment.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" /> Deposit USDC
              </h3>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">USDC Amount to Deposit</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={isDepositing}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isDepositing}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl py-2.5 transition-all duration-300"
                >
                  {isDepositing ? 'Depositing...' : 'Deposit Funds'}
                </Button>
              </form>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Unlock className="w-5 h-5 text-indigo-400" /> Withdraw Liquidity
              </h3>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">LP Shares to Redeem</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="10.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={withdrawShares}
                    onChange={(e) => setWithdrawShares(e.target.value)}
                    disabled={isWithdrawing}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isWithdrawing}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl py-2.5 transition-all duration-300"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Redeem Shares'}
                </Button>
              </form>
            </div>

            {(error || depositError || withdrawError) && (
              <div className="md:col-span-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {error || depositError?.message || withdrawError?.message}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
