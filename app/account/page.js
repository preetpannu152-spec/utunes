'use client';

import TopNav from '@/components/TopNav';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // demo user details (replace with Firestore data later)
  const userDetails = {
    genres: ['Pop', 'Hip-Hop', 'Jazz'],
    lookingFor: 'New music recommendations',
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (!u) {
        router.push('/account');
      } else {
        setUser(u);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) return null;

  return (
    <>
      <TopNav active="Account" />

      <div className="relative min-h-screen bg-white text-black overflow-hidden">
        {/* Left vinyl background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20">
          <Image
            src="/record.png"
            alt="vinyl"
            width={400}
            height={400}
            className="animate-spin-slow"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-xl mx-auto pt-16 px-6 text-center">
          {/* Logo */}
          <Image
            src="/account.png"
            alt="UTunes Logo"
            width={300}
            height={150}
            className="mx-auto mb-10"
          />

          
          {/* User info */}
          <div className="space-y-3 mb-8 text-left">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Username:</span>{' '}
              {user.username || 'UTunes User'}
            </p>
            <p>
              <span className="font-semibold">Favorite Genres:</span>{' '}
              {user.genres?.join(', ') || userDetails.genres?.join(', ')}
            </p>
            <p>
              <span className="font-semibold">Looking For:</span> {user.lookingFor || userDetails.lookingFor}
            </p>
          </div>

          {/* This Month 🎧 clickable */}
          <div
            onClick={() => router.push('/rewind')}
            className="bg-gray-100 rounded-2xl p-6 mb-10 text-left cursor-pointer hover:bg-gray-200 transition"
          >
            <h2 className="font-bold text-xl mb-2">This Month 🎧</h2>
            <p className="text-gray-600">Click to view your monthly rewind</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <a
              href="https://open.spotify.com"
              target="_blank"
              className="bg-spotify text-black px-6 py-3 rounded-xl font-bold"
            >
              Open Spotify
            </a>

            {/* Fixed Log out button */}
            <button
              onClick={async () => {
                await signOut(auth);
                router.push('/signup');
              }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
