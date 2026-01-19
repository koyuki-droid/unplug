"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Trash2, Calendar, User } from "lucide-react";
import { useAccount } from "wagmi";

export function DataRecords() {
  const { address } = useAccount();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: Fetch records from blockchain
  useEffect(() => {
    // This will be implemented with contract interactions
    setRecords([]);
  }, [address]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading records...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No records yet</h3>
        <p className="text-slate-600">Upload your first medical record or personal file to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Data Records</h2>
      <div className="grid gap-4">
        {records.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}

function RecordCard({ record }: { record: any }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 mb-1">{record.dataType || "Medical Record"}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(record.uploadTime * 1000).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{record.uploader?.slice(0, 6)}...{record.uploader?.slice(-4)}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-mono truncate">
              IPFS: {record.ipfsHash}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

