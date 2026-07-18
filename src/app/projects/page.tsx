import { Suspense } from 'react';

import NewsPage from '~/components/NewsPage/NewsPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsPage />
    </Suspense>
  );
}
