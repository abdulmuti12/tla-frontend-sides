'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { ReactPhotoSphereViewer as PhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { PanoramaItem, PanoramaConnection } from '~/api_helpers/fetchPanoramaData';

const MOBILE_BREAKPOINT = 768;

const LOREM_CONTENT = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`;

interface Props {
  scenes: PanoramaItem[];
}

export default function PanoramaViewer({ scenes }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const isMobile = useRef(false);
  const viewerRef = useRef<any>(null);
  const markersRef = useRef<Set<string>>(new Set());
  const modalId = useId();

  useEffect(() => {
    isMobile.current = window.innerWidth < MOBILE_BREAKPOINT;
    setLoading(true);
  }, []);

  useEffect(() => {
    if (!infoModalOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setInfoModalOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [infoModalOpen]);

  const currentScene = scenes[currentIndex] ?? scenes[0];
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

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    if (!markersPlugin) return;

    markersRef.current.forEach((id) => markersPlugin.removeMarker(id));
    markersRef.current.clear();

    currentScene.connections.forEach((conn: PanoramaConnection) => {
      const markerId = `conn-${conn.targetId}`;
      markersPlugin.addMarker({
        id: markerId,
        position: { yaw: conn.yaw, pitch: conn.pitch },
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNlOTQ1NjAiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8cG9seWdvbiBwb2ludHM9IjE1LDE1IDI1LDIwIDE1LDI1IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
        size: { width: 40, height: 40 },
        tooltip: { content: conn.label, position: 'top center' },
        scale: 1,
      });
      markersRef.current.add(markerId);
    });

    markersPlugin.addEventListener('select-marker', (e: any) => {
      const markerId = e.marker?.id;
      if (!markerId?.startsWith('conn-')) return;

      const targetId = markerId.replace('conn-', '');
      const targetConn = currentScene.connections.find((c) => c.targetId === targetId);
      if (!targetConn) return;

      const targetIndex = scenes.findIndex((s) => s.id === targetId);
      if (targetIndex === -1) return;

      const targetSceneData = scenes[targetIndex];
      const newImageUrl = isMobile.current ? targetSceneData?.mobileUrl : targetSceneData?.desktopUrl;
      if (!newImageUrl) return;

      const offsetYaw = targetConn.yaw + Math.PI;
      const offsetPitch = -targetConn.pitch;

      setLoading(true);
      setError(null);
      setCurrentIndex(targetIndex);

      viewer.setPanorama(newImageUrl, {
        position: { yaw: offsetYaw, pitch: offsetPitch },
        transition: { speed: 1500, rotation: true, effect: 'fade' },
      }).catch(() => setLoading(false));
    });
  }, [currentIndex, currentScene, scenes]);

  const switchScene = (index: number) => {
    setLoading(true);
    setError(null);
    setCurrentIndex(index);
  };

  if (!scenes || scenes.length === 0) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
        <span style={{ color: '#999' }}>No scenes available</span>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a2e', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Main Viewer */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', color: '#e94560', zIndex: 30, fontSize: 14 }}>
            {error}
          </div>
        )}
        <PhotoSphereViewer
          ref={viewerRef}
          src={imageUrl || ''}
          height="100%"
          width="100%"
          navbar={['autorotate', 'fullscreen']}
          plugins={[MarkersPlugin]}
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

        {/* Information Project Button */}
        <button
          onClick={() => setInfoModalOpen(true)}
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            padding: '6px 12px',
            borderRadius: 6,
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            zIndex: 20,
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(233,69,96,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; }}
        >
          Information Project
        </button>
      </div>

      {/* Bottom Room Navigation */}
      <div style={{
        background: 'rgba(10,10,20,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 16px',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        flexShrink: 0,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {scenes.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => switchScene(idx)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: idx === currentIndex ? '#e94560' : 'rgba(255,255,255,0.08)',
              color: idx === currentIndex ? '#fff' : '#aaa',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (idx !== currentIndex) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (idx !== currentIndex) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#aaa';
              }
            }}
          >
            {scene.name}
          </button>
        ))}
      </div>

      {/* Project Information Modal Overlay */}
      {infoModalOpen && createPortal(
        <div
          id={modalId}
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setInfoModalOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              width: '100%',
              maxWidth: 640,
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Informasi Project</span>
              <button
                onClick={() => setInfoModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#999', lineHeight: 1, padding: '4px 8px', borderRadius: 4 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <div
                style={{ color: '#333', lineHeight: 1.7, fontSize: 14 }}
                dangerouslySetInnerHTML={{ __html: LOREM_CONTENT }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
