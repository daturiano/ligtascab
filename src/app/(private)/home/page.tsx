'use client';

import { signOut } from '@/features/authentication/actions/authentication';
import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <button onClick={() => signOut()}>Signout</button>
    </div>
  );
}
