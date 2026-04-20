'use client';

import dynamic from 'next/dynamic';

const CameraKitWrapper = dynamic(
  () => import('../../components/CameraKitWrapper').then((mod) => mod.CameraKitWrapper),
  { ssr: false }
);

export default function ViewerPage() {
    return (
        <main className="w-screen h-screen overflow-hidden bg-black">
            <CameraKitWrapper />
        </main>
    );
}
