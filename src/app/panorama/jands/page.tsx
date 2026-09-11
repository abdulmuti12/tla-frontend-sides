'use client';

import { useEffect, useState } from 'react';
import PanoramaViewer from '~/components/PanoramaViewer/PanoramaViewer';
import { fetchPanoramaData } from '~/api_helpers/fetchPanoramaData';

export default function JandsPanoramaPage() {
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/panorama/jands')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((raw) => {
        const items = Array.isArray(raw.data) ? raw.data : [];
        setScenes(items);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80, color: '#999', background: '#1a1a2e', minHeight: '100vh' }}>
        Memuat...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 80, color: '#e94560', background: '#1a1a2e', minHeight: '100vh' }}>
        {error}
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 80, color: '#999', background: '#1a1a2e', minHeight: '100vh' }}>
        No panorama images found.
      </div>
    );
  }

  return <PanoramaViewer scenes={scenes} />;
}
