"use client";

import { Shield, Lock, DollarSign, Clock, CheckCircle2 } from "lucide-react";

export function WelcomeScreen() {
  return (
    <div className="max-w-5xl mx-auto text-center py-12">
      <div className="mb-12 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          Your Data,
          <br />
          Your Control
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 mb-8 font-medium max-w-3xl mx-auto">
          Self-custody data vault powered by blockchain. Store medical records,
          personal files, and monetize your data on your terms.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <FeatureCard
          icon={<Lock className="w-8 h-8" />}
          title="Self-Custody"
          description="You own your data. No intermediaries, no big tech. Complete control over your personal information."
        />
        <FeatureCard
          icon={<Shield className="w-8 h-8" />}
          title="Medical Records"
          description="Store and share medical records securely. Grant hospitals temporary access that auto-expires."
        />
        <FeatureCard
          icon={<Clock className="w-8 h-8" />}
          title="Time-Limited Access"
          description="Grant permissions that automatically expire. Like MetaMask, but for your personal data."
        />
        <FeatureCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Micro-Economy"
          description="Get paid when AI companies use your data. Set permissions, get paid, auto-revoke access."
        />
      </div>

      <div className="glass rounded-3xl shadow-2xl p-10 border border-white/30 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Getting Started is Easy
        </h2>
        <div className="flex flex-col items-center space-y-6 text-left max-w-lg mx-auto">
          <Step number={1} text="Connect your wallet (MetaMask or similar)" />
          <Step number={2} text="Upload your medical records or files" />
          <Step number={3} text="Grant time-limited permissions to parties" />
          <Step number={4} text="Monetize your data with AI companies" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up hover:scale-105 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative">
        <div className="mb-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
          {title}
        </h3>
        <p className="text-slate-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center space-x-5 w-full group">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform">
        {number}
      </div>
      <p className="text-slate-800 text-lg font-medium group-hover:text-slate-900 transition-colors">{text}</p>
    </div>
  );
}

