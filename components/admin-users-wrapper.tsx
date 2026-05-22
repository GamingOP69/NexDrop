'use client';

import dynamic from 'next/dynamic';

const AdminUsers = dynamic(() => import('./admin-users').then((m) => m.AdminUsers), { ssr: false });

export default function AdminUsersWrapper() {
  return <AdminUsers />;
}
