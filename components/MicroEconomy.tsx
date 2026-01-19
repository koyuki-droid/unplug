"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useAccount } from "wagmi";

export function MicroEconomy() {
  const { address } = useAccount();
  const [balance, setBalance] = useState("0");
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch balance and agreements from blockchain
    if (address) {
      setBalance("0");
      setAgreements([]);
    }
  }, [address]);

  const withdraw = async () => {
    // TODO: Implement withdrawal
    console.log("Withdrawing balance");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Micro-Economy</h2>
        <p className="text-slate-600">
          Monetize your data by granting time-limited access to AI companies. Get paid automatically, permissions auto-expire.
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Total Earned</h3>
            <p className="text-3xl font-bold text-slate-900">{balance} ETH</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-full">
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <button
          onClick={withdraw}
          disabled={parseFloat(balance) === 0}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Withdraw Balance
        </button>
      </div>

      {/* Active Agreements */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Agreements</h3>
        {agreements.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-2">No active agreements</p>
            <p className="text-sm text-slate-500">
              Grant "AI Access" permissions to AI companies to start earning
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {agreements.map((agreement) => (
              <AgreementCard key={agreement.id} agreement={agreement} />
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-slate-900 mb-3">How Micro-Economy Works</h3>
        <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
          <li>Grant "AI Access" permission to an AI company with payment terms</li>
          <li>Set duration and payment per time interval (e.g., hourly, daily)</li>
          <li>AI company pays automatically during the access period</li>
          <li>Permission auto-expires when time is up</li>
          <li>Withdraw your earnings anytime</li>
        </ol>
      </div>
    </div>
  );
}

function AgreementCard({ agreement }: { agreement: any }) {
  const isActive = agreement.isActive && agreement.endTime > Date.now() / 1000;
  const isExpired = agreement.endTime < Date.now() / 1000;

  return (
    <div className={`p-4 rounded-lg border ${
      isExpired ? "bg-slate-50 border-slate-200" : "bg-green-50 border-green-200"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-slate-900">Record #{agreement.recordId}</h4>
            {isActive && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                Active
              </span>
            )}
            {isExpired && (
              <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full">
                Expired
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 font-mono">
            Payer: {agreement.payer.slice(0, 6)}...{agreement.payer.slice(-4)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-600 mb-1">Total Amount</p>
          <p className="font-semibold text-slate-900">{agreement.totalAmount} ETH</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Paid So Far</p>
          <p className="font-semibold text-green-600">{agreement.paidAmount} ETH</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Payment Rate</p>
          <p className="font-semibold text-slate-900">{agreement.paymentPerInterval} ETH / interval</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">
            {isExpired ? "Expired On" : "Expires On"}
          </p>
          <p className="font-semibold text-slate-900">
            {new Date(agreement.endTime * 1000).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

