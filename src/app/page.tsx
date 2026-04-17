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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col items-center justify-center p-4 selection:bg-blue-200 overflow-hidden relative">
      {/* Background Decor Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-300/30 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-300/30 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-5xl">
        <div className="mb-10 text-center relative">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/60 border border-white shadow-sm backdrop-blur-md">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-sm font-semibold tracking-wide uppercase">
              Immersive Assets
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-800 leading-tight">
            Dynamic AR CDN
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Upload your 3D models securely and instantly generate a WebAR experience powered by CameraKit.
          </p>
        </div>

        {successModelId ? (
          <UploadSuccess
            modelId={successModelId}
            onReset={() => setSuccessModelId(null)}
          />
        ) : (
          <div className="w-full max-w-2xl bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ease-out flex flex-col items-center justify-center min-h-[300px] group
                ${isHovering
                  ? 'border-blue-500 bg-blue-50'
                  : file
                    ? 'border-emerald-500/50 bg-emerald-50/50'
                    : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-white/60'
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
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5 shadow-sm border border-emerald-200">
                    <FileBox className="w-10 h-10 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-semibold text-slate-800 mb-2">{file.name}</p>
                  <p className="text-sm text-slate-500 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="text-sm text-blue-600 mt-6 group-hover:underline font-medium">Click or drag to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <Upload className="w-10 h-10 text-blue-500" />
                  </div>
                  <p className="text-2xl font-semibold text-slate-700 mb-3">
                    Drag & Drop your model
                  </p>
                  <p className="text-base text-slate-500">
                    We exclusively support <strong className="text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">.glb</strong> files
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2 shadow-sm">
                <FileWarning className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`py-3.5 px-8 rounded-xl font-bold flex items-center gap-2 transition-all duration-300
                  ${!file || isUploading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed hidden'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1'
                  }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading Model...
                  </>
                ) : (
                  'Upload & Generate AR Link'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="z-10 mt-16 text-center text-sm font-medium text-slate-500 bg-white/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/50 shadow-sm">
        <p>Enterprise WebAR Network • Zero App Downloads Required</p>
      </footer>
    </main>
  );
}
