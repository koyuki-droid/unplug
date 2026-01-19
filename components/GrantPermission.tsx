"use client";

import { useState } from "react";
import { Share2, Clock, Calendar, User, CheckCircle2 } from "lucide-react";
import { useAccount } from "wagmi";

export function GrantPermission() {
  const { address } = useAccount();
  const [grantee, setGrantee] = useState("");
  const [recordId, setRecordId] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [permissionType, setPermissionType] = useState("read");
  const [granting, setGranting] = useState(false);
  const [granted, setGranted] = useState(false);

  const handleGrant = async () => {
    if (!grantee || !recordId || !address) return;

    setGranting(true);
    try {
      // TODO: Implement permission granting with signature
      // 1. Create signature message
      // 2. Request user signature (MetaMask-style)
      // 3. Call permissionManager.grantPermission() with signature
      
      const expiryTime = Math.floor(Date.now() / 1000) + expiryDays * 24 * 60 * 60;
      
      console.log("Granting permission:", {
        grantee,
        recordId,
        expiryTime,
        permissionType,
      });
      
      // Simulate granting
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setGranted(true);
      setTimeout(() => {
        setGranted(false);
        setGrantee("");
        setRecordId("");
      }, 3000);
    } catch (error) {
      console.error("Grant permission error:", error);
      alert("Failed to grant permission. Please try again.");
    } finally {
      setGranting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Grant Permission</h2>
        <p className="text-slate-600">
          Give temporary access to your data. Permissions automatically expire and require your signature (like MetaMask).
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <div className="space-y-4">
          {/* Record ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Record ID
            </label>
            <input
              type="text"
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              placeholder="Enter record ID to grant access to"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Grantee Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={grantee}
              onChange={(e) => setGrantee(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              Address of hospital, clinic, or AI company
            </p>
          </div>

          {/* Permission Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Permission Type
            </label>
            <select
              value={permissionType}
              onChange={(e) => setPermissionType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="read">Read Only</option>
              <option value="write">Read & Write</option>
              <option value="ai_access">AI Access (Micro-Economy)</option>
            </select>
          </div>

          {/* Expiry Days */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Duration (Days)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                max="365"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value) || 7)}
                className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-slate-600">
                Permission expires on {new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>

          {granted && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">Permission granted successfully!</p>
            </div>
          )}

          <button
            onClick={handleGrant}
            disabled={!grantee || !recordId || granting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {granting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing & Granting...</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>Sign & Grant Permission</span>
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center">
            You will be prompted to sign with your wallet (MetaMask-style). This signature grants the permission.
          </p>
        </div>
      </div>
    </div>
  );
}

