'use client';

import TopNav from '@/components/TopNav';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './account.module.css';

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
        router.push('/signup');
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
      <div className={styles.pageContainer}>
        {/* Left vinyl background */}
        <div className={styles.vinylBackground}></div>

        {/* Main content */}
        <div className={styles.mainContent}>
          {/* Logo */}
          <Image
            src="/acc.png"
            alt="UTunes Logo"
            width={300}
            height={150}
            className={styles.logo}
          />

          {/* User info */}
          <div className={styles.userInfo}>
            <p >
              <span>Email:</span> {user.email}
            </p>
            <p>
              <span>Username:</span>{' '}
              {user.username || 'beatvo'}
            </p>
            <p>
              <span>Favorite Genres:</span>{' '}
              {user.genres?.join(', ') || userDetails.genres?.join(', ')}
            </p>
            <p>
              <span>Looking For:</span> {user.lookingFor || userDetails.lookingFor}
            </p>
          </div>

          {/* This Month 🎧 clickable */}
          <div
            onClick={() => router.push('/rewind')}
            className={styles.rewindCard}
          >
            <h2 className={styles.rewindTitle}>This Month 🎧</h2>
            <p className={styles.rewindDescription}>Click to view your monthly rewind</p>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <a href="https://open.spotify.com" className={styles.spotifyButton}>
              Open Spotify
            </a>

            <div className={styles.spacer}></div>

            {/* Log out button */}
            <button
              onClick={async () => {
                await signOut(auth);
                router.push('/signup');
              }}
              className={styles.logoutButton}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}