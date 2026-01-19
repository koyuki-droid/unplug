"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { FileText, Upload, Share2, DollarSign, Clock, Plus } from "lucide-react";
import { DataRecords } from "./DataRecords";
import { UploadFile } from "./UploadFile";
import { GrantPermission } from "./GrantPermission";
import { MicroEconomy } from "./MicroEconomy";
import { ActivePermissions } from "./ActivePermissions";

type Tab = "records" | "upload" | "permissions" | "economy";

export function Dashboard() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("records");

  const tabs = [
    { id: "records" as Tab, label: "My Records", icon: <FileText className="w-5 h-5" /> },
    { id: "upload" as Tab, label: "Upload", icon: <Upload className="w-5 h-5" /> },
    { id: "permissions" as Tab, label: "Permissions", icon: <Share2 className="w-5 h-5" /> },
    { id: "economy" as Tab, label: "Micro Economy", icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Records"
          value="0"
          icon={<FileText className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Active Permissions"
          value="0"
          icon={<Share2 className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Total Earned"
          value="0 ETH"
          icon={<DollarSign className="w-6 h-6" />}
          color="yellow"
        />
        <StatCard
          title="Pending Expiry"
          value="0"
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="glass rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        <div className="border-b border-white/20 bg-white/10">
          <nav className="flex flex-wrap gap-2 px-6 py-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                      : "text-slate-700 hover:bg-white/20 hover:text-slate-900"
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === "records" && <DataRecords />}
          {activeTab === "upload" && <UploadFile />}
          {activeTab === "permissions" && (
            <div className="space-y-6">
              <GrantPermission />
              <div className="mt-8 pt-8 border-t border-slate-200">
                <ActivePermissions />
              </div>
            </div>
          )}
          {activeTab === "economy" && <MicroEconomy />}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "orange";
}) {
  const colorConfigs = {
    blue: {
      bg: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100 text-blue-600",
      glow: "shadow-blue-500/50",
    },
    green: {
      bg: "from-green-500 to-emerald-500",
      iconBg: "bg-green-100 text-green-600",
      glow: "shadow-green-500/50",
    },
    yellow: {
      bg: "from-yellow-500 to-orange-500",
      iconBg: "bg-yellow-100 text-yellow-600",
      glow: "shadow-yellow-500/50",
    },
    orange: {
      bg: "from-orange-500 to-red-500",
      iconBg: "bg-orange-100 text-orange-600",
      glow: "shadow-orange-500/50",
    },
  };

  const config = colorConfigs[color];

  return (
    <div className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden border border-white/30">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${config.iconBg} shadow-lg transform group-hover:rotate-12 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

