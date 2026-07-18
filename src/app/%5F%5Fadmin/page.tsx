import { Suspense } from 'react';

import { AdminPage } from '~/components/AdminPage/AdminPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPage />
    </Suspense>
  );
}
