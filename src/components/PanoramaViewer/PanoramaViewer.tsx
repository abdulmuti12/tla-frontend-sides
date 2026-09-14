'use client';

import { useState, useEffect, useRef } from 'react';
import { ReactPhotoSphereViewer as PhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { PanoramaItem, PanoramaConnection } from '~/api_helpers/fetchPanoramaData';

const MOBILE_BREAKPOINT = 768;

interface Props {
  scenes: PanoramaItem[];
}

export default function PanoramaViewer({ scenes }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useRef(false);
  const viewerRef = useRef<any>(null);
  const markersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    isMobile.current = window.innerWidth < MOBILE_BREAKPOINT;
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (mobile !== isMobile.current) {
        isMobile.current = mobile;
        setShowSidebar(!mobile);
        setLoading(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    // Clear existing markers
    markersRef.current.forEach((id) => markersPlugin.removeMarker(id));
    markersRef.current.clear();

    // Add new markers for connections
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

    // Handle marker clicks
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
    if (isMobile.current) setShowSidebar(false);
  };

  if (!scenes || scenes.length === 0) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
        <span style={{ color: '#999' }}>No scenes available</span>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a2e', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      {/* Main Viewer */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
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
          style={{ flex: 1 }}
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

        {/* Current Room Label */}
        <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 8, color: '#fff', fontSize: 14, zIndex: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
          {currentScene?.name}
        </div>

        {/* Toggle Sidebar Button (Mobile) */}
        {isMobile.current && showSidebar && (
          <button
            onClick={() => setShowSidebar(false)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 12px', cursor: 'pointer', zIndex: 20, fontSize: 12 }}
          >
            ✕ Tutup
          </button>
        )}
      </div>

      {/* Sidebar - Room Navigation */}
      {scenes.length > 1 && (
        <div style={{
          width: showSidebar ? '280px' : '0px',
          minWidth: showSidebar ? '280px' : '0px',
          background: 'rgba(10,10,20,0.95)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Sidebar Header */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: '#fff', margin: 0, fontSize: 16 }}>Navigasi Ruangan</h3>
            <p style={{ color: '#999', margin: '4px 0 0', fontSize: 12 }}>Pilih ruangan untuk dikunjungi</p>
          </div>

          {/* Room List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => switchScene(idx)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: 8,
                  border: 'none',
                  borderRadius: 8,
                  background: idx === currentIndex ? '#e94560' : 'rgba(255,255,255,0.08)',
                  color: idx === currentIndex ? '#fff' : '#ccc',
                  cursor: 'pointer',
                  fontSize: 14,
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  borderLeft: idx === currentIndex ? '3px solid #e94560' : '3px solid transparent',
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
                    e.currentTarget.style.color = '#ccc';
                  }
                }}
              >
                <div style={{ fontWeight: 500 }}>{scene.name}</div>
                {scene.connections.length > 0 && (
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                    {scene.connections.map(c => c.label).join(' · ')}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 11, color: '#666' }}>
            Klik hotspot di panorama untuk berpindah ruangan
          </div>
        </div>
      )}

      {/* Toggle Sidebar Button (Desktop) */}
      {!isMobile.current && scenes.length > 1 && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            position: 'absolute',
            top: 16,
            right: showSidebar ? '296px' : 16,
            background: 'rgba(0,0,0,0.6)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            padding: '8px 12px',
            cursor: 'pointer',
            zIndex: 20,
            fontSize: 12,
            transition: 'right 0.3s ease',
          }}
        >
          {showSidebar ? '← Tutup Panel' : '▶ Panel Ruangan'}
        </button>
      )}
    </div>
  );
}
