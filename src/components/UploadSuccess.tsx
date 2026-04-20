'use client';

import { CheckCircle2, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';



interface UploadSuccessProps {
    modelId: string;
    onReset: () => void;
}

export function UploadSuccess({ modelId, onReset }: UploadSuccessProps) {
    const [copied, setCopied] = useState(false);
    const [modelUrl, setModelUrl] = useState<string>('');

    const [viewerUrl, setViewerUrl] = useState<string>('');

    useEffect(() => {
        // The API serves the model at /api/models/${key}
        setModelUrl(`/api/models/${modelId}.glb`);
        setViewerUrl(`${window.location.origin}/viewer?modelID=${modelId}`);
    }, [modelId]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(viewerUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="w-full bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col lg:flex-row">

                {/* Left Side: 3D Model Viewer */}
                <div className="w-full lg:w-3/5 bg-slate-100/50 border-b lg:border-b-0 lg:border-r border-slate-200/60 p-6 flex flex-col min-h-[400px] lg:min-h-[500px] relative group">
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Preview
                    </div>
                    {modelUrl && (
                        <div className="flex-1 w-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/50 shadow-inner">
                            <model-viewer
                                src={modelUrl}
                                auto-rotate
                                camera-controls
                                shadow-intensity="1"
                                environment-image="neutral"
                                exposure="1"
                                className="w-full h-full absolute inset-0"
                                style={{ width: '100%', height: '100%' }}
                            ></model-viewer>
                        </div>
                    )}
                </div>

                {/* Right Side: Info & Actions */}
                <div className="w-full lg:w-2/5 p-8 lg:p-10 flex flex-col items-center justify-center bg-white/40">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">Upload Complete!</h2>
                    <p className="text-slate-500 text-center mb-8 font-medium">
                        Your 3D model is ready. Scan the QR code or share the link to view it in AR.
                    </p>

                    <div className="bg-white p-5 rounded-2xl mb-8 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 transform hover:scale-105 transition-transform duration-300">
                        <QRCodeSVG
                            value={viewerUrl || "https://dynamic-ar-viewer.app"}
                            size={180}
                            bgColor={"#ffffff"}
                            fgColor={"#0f172a"}
                            level={"H"}
                            includeMargin={false}
                        />
                    </div>

                    <div className="w-full space-y-5">
                        <div className="relative group">
                            <input
                                type="text"
                                readOnly
                                value={viewerUrl}
                                className="w-full bg-white border border-slate-300 rounded-xl py-3.5 px-4 text-slate-700 text-sm font-medium pr-14 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm group-hover:border-slate-400"
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-50 rounded-lg transition-colors text-slate-400 hover:text-blue-600"
                                title="Copy to clipboard"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>

                        {copied && (
                            <p className="text-emerald-600 text-sm text-center font-bold animate-in fade-in slide-in-from-top-2">
                                Link copied to clipboard!
                            </p>
                        )}

                        <div className="flex flex-col gap-3">
                            <a
                                href={viewerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Launch WebAR Viewer
                            </a>
                            <button
                                onClick={onReset}
                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Upload Another Model
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
