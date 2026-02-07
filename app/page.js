'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function SwipePage() {
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/signin'); // redirect if not logged in
    }
  }, [router]);

  // ... rest of your swipe code
}