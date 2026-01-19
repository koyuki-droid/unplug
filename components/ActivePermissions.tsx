"use client";

import { useState, useEffect } from "react";
import { Share2, Clock, X, Calendar, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";

export function ActivePermissions() {
  const { address } = useAccount();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch permissions from blockchain
    setPermissions([]);
  }, [address]);

  const revokePermission = async (permissionId: string) => {
    // TODO: Implement permission revocation
    console.log("Revoking permission:", permissionId);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Permissions</h3>
        <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
          <Share2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">No active permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Permissions</h3>
      <div className="space-y-3">
        {permissions.map((perm) => {
          const isExpiringSoon = perm.expiryTime - Date.now() / 1000 < 24 * 60 * 60;
          const isExpired = perm.expiryTime < Date.now() / 1000;

          return (
            <div
              key={perm.id}
              className={`p-4 rounded-lg border ${
                isExpired
                  ? "bg-red-50 border-red-200"
                  : isExpiringSoon
                  ? "bg-orange-50 border-orange-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-slate-900">
                      Record #{perm.recordId}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      perm.permissionType === "read"
                        ? "bg-blue-100 text-blue-700"
                        : perm.permissionType === "ai_access"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {perm.permissionType}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span className="font-mono">
                        {perm.grantee.slice(0, 6)}...{perm.grantee.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Expires: {new Date(perm.expiryTime * 1000).toLocaleString()}
                      </span>
                      {isExpiringSoon && !isExpired && (
                        <span className="text-orange-600 font-medium">(Soon)</span>
                      )}
                      {isExpired && (
                        <span className="text-red-600 font-medium">(Expired)</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => revokePermission(perm.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Revoke permission"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

