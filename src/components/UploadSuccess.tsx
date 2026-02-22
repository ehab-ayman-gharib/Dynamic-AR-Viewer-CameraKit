'use client';

import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface UploadSuccessProps {
    modelId: string;
    onReset: () => void;
}

export function UploadSuccess({ modelId, onReset }: UploadSuccessProps) {
    const [copied, setCopied] = useState(false);

    // URL to the external AR Viewer app
    const viewerUrl = `https://camera-kit-test.vercel.app/?modelId=${modelId}`;

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
        <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Upload Successful!</h2>
            <p className="text-white/60 text-center mb-8">
                Your 3D model is ready. Scan the QR code or share the link below to view it in AR.
            </p>

            <div className="bg-white p-4 rounded-xl mb-8 shadow-inner">
                <QRCodeSVG
                    value={viewerUrl}
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                />
            </div>

            <div className="w-full space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        readOnly
                        value={viewerUrl}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white text-sm pr-12 focus:outline-none focus:border-white/20"
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
                        title="Copy to clipboard"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>

                {copied && (
                    <p className="text-green-400 text-xs text-center font-medium animate-in fade-in slide-in-from-top-2">
                        Copied to clipboard!
                    </p>
                )}

                <div className="flex gap-3">
                    <a
                        href={viewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open Viewer
                    </a>
                    <button
                        onClick={onReset}
                        className="flex-1 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        Upload Another
                    </button>
                </div>
            </div>
        </div>
    );
}
