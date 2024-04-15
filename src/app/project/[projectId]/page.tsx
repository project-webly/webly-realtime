'use client';

import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams<{ projectId: string }>();
  return <>{params?.projectId}</>;
}
