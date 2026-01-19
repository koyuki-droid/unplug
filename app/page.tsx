"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Dashboard } from "@/components/Dashboard";
import { WelcomeScreen } from "@/components/WelcomeScreen";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <header className="glass sticky top-0 z-50 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-glow animate-pulse-glow">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl blur opacity-30"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Unplug
                </h1>
                <p className="text-xs text-slate-600">Your Data Vault</p>
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isConnected ? <Dashboard /> : <WelcomeScreen />}
      </div>
    </main>
  );
}

