"use client";

import { useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { useAccount } from "wagmi";

export function UploadFile() {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState("medical_record");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !address) return;

    setUploading(true);
    try {
      // TODO: Implement IPFS upload and contract interaction
      // 1. Encrypt file
      // 2. Upload to IPFS
      // 3. Get IPFS hash
      // 4. Call contract.uploadData(ipfsHash, dataType)
      
      console.log("Uploading:", file.name, dataType);
      
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setUploaded(true);
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Upload New Record
        </h2>
        <p className="text-lg text-slate-700">
          Upload your medical records or personal files. All data is encrypted and stored on IPFS.
        </p>
      </div>

      <div className="glass rounded-2xl p-8 border-2 border-dashed border-white/40 shadow-xl">
        <div className="space-y-4">
          {/* File Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="medical_record">Medical Record</option>
              <option value="lab_result">Lab Result</option>
              <option value="prescription">Prescription</option>
              <option value="personal_file">Personal File</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select File
            </label>
            <div className="mt-1">
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-purple-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-purple-50/50 to-pink-50/50 hover:from-purple-100/50 hover:to-pink-100/50 transition-all duration-300 group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3 transform group-hover:scale-110 transition-transform shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="mb-2 text-base font-semibold text-slate-700">
                      <span className="text-purple-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-slate-600">PDF, DOCX, or images</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-5 bg-white/80 rounded-xl border border-purple-200 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all transform hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {uploaded && (
            <div className="flex items-center space-x-3 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <p className="text-base font-semibold text-green-800">File uploaded successfully!</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload to Vault</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

