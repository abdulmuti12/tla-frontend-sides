'use client';

import { useState, useEffect, useRef } from 'react';
import { ReactPhotoSphereViewer as PhotoSphereViewer } from 'react-photo-sphere-viewer';
import { PanoramaItem } from '~/api_helpers/fetchPanoramaData';

const MOBILE_BREAKPOINT = 768;

interface Props {
  scenes: PanoramaItem[];
}

export default function PanoramaViewer({ scenes }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < MOBILE_BREAKPOINT;
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (mobile !== isMobile.current) {
        isMobile.current = mobile;
        setLoading(true); // trigger re-check
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentScene = scenes[currentIndex] ?? scenes[0];
  // Pilih URL berdasarkan device — tanpa request tambahan
  const imageUrl = isMobile.current ? currentScene?.mobileUrl : currentScene?.desktopUrl;

  useEffect(() => {
    if (!imageUrl) return;
    setLoading(true);
    setError(null);
    const img = new Image();
    img.onload = () => setLoading(false);
    img.onerror = () => { setError('Gagal memuat gambar'); setLoading(false); };
    img.src = imageUrl;
  }, [imageUrl]);

  const switchScene = (index: number) => {
    setLoading(true);
    setError(null);
    setCurrentIndex(index);
  };

  if (!scenes || scenes.length === 0) {
    return (
      <div style={{ width: '100%', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
        <span style={{ color: '#999' }}>No scenes available</span>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' }}>
      {/* Viewer */}
      <div style={{ width: '100%', position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
        {error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', color: '#e94560', zIndex: 30, fontSize: 14 }}>
            {error}
          </div>
        )}
        <PhotoSphereViewer
          src={imageUrl || ''}
          height="70vh"
          width="100%"
          navbar={['autorotate', 'fullscreen']}
        />
        {loading && !error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', zIndex: 25 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#e94560', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <span style={{ color: '#fff', opacity: 0.7, fontSize: 14 }}>Memuat Virtual Tour...</span>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      {/* Scene Selector Pills */}
      {scenes.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20, maxWidth: 900 }}>
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => switchScene(idx)}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: 25,
                background: idx === currentIndex ? '#e94560' : 'rgba(255,255,255,0.15)',
                color: '#fff', cursor: 'pointer', fontSize: 13, transition: 'all 0.3s',
                whiteSpace: 'nowrap', backdropFilter: 'blur(10px)',
              }}
            >
              {scene.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
