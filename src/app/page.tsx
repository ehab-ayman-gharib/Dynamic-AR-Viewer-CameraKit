'use client';

import { Upload, FileBox, FileWarning, Loader2 } from 'lucide-react';
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadSuccess } from '@/components/UploadSuccess';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModelId, setSuccessModelId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.name.toLowerCase().endsWith('.glb')) {
      setError('Only .glb files are allowed.');
      setFile(null);
      return;
    }

    // Optional: add size limit (e.g., 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size must be under 50MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setSuccessModelId(data.id);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Dynamic AR CDN
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Upload your 3D models securely and instantly generate a WebAR experience powered by CameraKit.
          </p>
        </div>

        {successModelId ? (
          <UploadSuccess
            modelId={successModelId}
            onReset={() => setSuccessModelId(null)}
          />
        ) : (
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl transition-all">

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ease-out flex flex-col items-center justify-center min-h-[300px] group
                ${isHovering
                  ? 'border-blue-500 bg-blue-500/10'
                  : file
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-white/20 bg-black/20 hover:border-white/40 hover:bg-white/5'
                }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".glb"
                className="hidden"
              />

              {file ? (
                <div className="animate-in zoom-in-95 duration-200 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <FileBox className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-xl font-medium text-white mb-2">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="text-xs text-blue-400 mt-6 group-hover:underline">Click or drag to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-xl font-medium text-white mb-2">
                    Drag & Drop your model
                  </p>
                  <p className="text-sm text-slate-400">
                    We exclusively support <strong className="text-white/80">.glb</strong> files
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2">
                <FileWarning className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`py-3 px-8 rounded-xl font-bold flex items-center gap-2 transition-all duration-200
                  ${!file || isUploading
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5'
                  }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Generate AR Link'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="z-10 mt-16 text-center text-sm text-slate-500">
        <p>Enterprise WebAR Network • Zero App Downloads Required</p>
      </footer>
    </main>
  );
}
