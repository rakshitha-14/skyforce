import React, { useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { UploadCloud, File, AlertCircle, CheckCircle2, X, RefreshCw } from 'lucide-react';

const FileUploadZone = ({ onUploadSuccess, allowedTypes = [], maxSizeBytes = 10 * 1024 * 1024 }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const cancelSourceRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds limit (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`);
      return false;
    }
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError('File type not supported');
      return false;
    }
    return true;
  };

  const uploadFile = async (file) => {
    setError('');
    setUploadedFile(null);
    setUploading(true);
    setProgress(0);

    // Create Cancel Token
    cancelSourceRef.current = axios.CancelToken.source();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosInstance.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        cancelToken: cancelSourceRef.current.token,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      setUploadedFile(res.data);
      setUploading(false);
      if (onUploadSuccess) {
        onUploadSuccess(res.data); // Notify parent: { fileName, fileUrl, uploadedAt }
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        setError('Upload aborted by user');
      } else {
        setError(err.response?.data?.message || 'Upload failed');
      }
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        uploadFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        uploadFile(file);
      }
    }
  };

  const handleAbort = () => {
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel('Upload aborted');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? triggerFileSelect : undefined}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
          isDragActive 
            ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-900/10' 
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/10'
        } ${uploading ? 'pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 transition-all ${
            isDragActive ? 'text-blue-400 bg-blue-950 border-blue-800 scale-110' : 'group-hover:text-blue-500 group-hover:scale-105'
          }`}>
            <UploadCloud size={24} />
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-200">
              Drag & Drop file here, or <span className="text-blue-400 group-hover:underline">browse files</span>
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Maximum file size: {Math.round(maxSizeBytes / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      </div>

      {/* Progress Widget */}
      {uploading && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md space-y-3">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-blue-400 animate-spin" />
              <span className="font-bold text-slate-200">Uploading File...</span>
            </div>
            <span className="font-mono font-bold text-blue-400">{progress}%</span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAbort}
              className="flex items-center gap-1 bg-rose-650/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-400 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors cursor-pointer"
            >
              <X size={12} />
              Abort Upload
            </button>
          </div>
        </div>
      )}

      {/* Upload Success Alert */}
      {uploadedFile && (
        <div className="bg-emerald-950/25 border border-emerald-800/45 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-400">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
            <span className="font-bold truncate">{uploadedFile.fileName}</span>
          </div>
          <span className="text-[10px] text-emerald-500/70 font-semibold uppercase shrink-0">Ready</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-950/25 border border-rose-800/45 p-3 rounded-xl flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
