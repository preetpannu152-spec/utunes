'use client';

import TinderCard from 'react-tinder-card';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import TopNav from '@/components/TopNav';
import styles from './swipe.module.css';

export default function SwipePage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) router.push('/swipe');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    setUsers(
      snap.docs
        .map(d => d.data())
        .filter(u => u.uid !== auth.currentUser.uid)
    );
  };

  const swiped = async (dir, target) => {
    if (dir !== 'right') return;

    await addDoc(collection(db, 'swipes'), {
      from: auth.currentUser.uid,
      to: target.uid,
      direction: 'right',
    });

    const q = query(
      collection(db, 'swipes'),
      where('from', '==', target.uid),
      where('to', '==', auth.currentUser.uid),
      where('direction', '==', 'right')
    );

    const snap = await getDocs(q);
    if (!snap.empty) {
      await addDoc(collection(db, 'matches'), {
        user1: auth.currentUser.uid,
        user2: target.uid,
        matchedAt: new Date(),
      });
    }
  };

  return (
    <PageWrapper>
      <TopNav active="Connect" />

      <div className={styles.swipeContainer}>
        {users.length === 0 && (
          <p className={styles.noUsersText}>No users to swipe.</p>
        )}

        <div className={styles.cardContainer}>
          {users
            .slice(0)
            .reverse()
            .map((user, index) => {
              const offset = index * 9;
              return (
                <TinderCard
                  key={user.uid}
                  onSwipe={dir => swiped(dir, user)}
                  preventSwipe={['up', 'down']}
                >
                  <div
                    className={styles.card}
                    style={{ top: offset, zIndex: users.length - index }}
                  >
                    <div className={styles.cardBackground}>
                      {/* Profile Image - placeholder */}
                      <img
                        src="/placeholder-musician.svg"
                        alt={user.username}
                        className={styles.profileImage}
                      />

                      {/* Username */}
                      <h2 className={styles.username}>{user.username}</h2>

                      {/* Information Section */}
                      <div className={styles.infoSection}>
                        <p className={styles.userInfo}>
                          🎧 Currently:{' '}
                          {user.spotifyStats?.currentSong ||
                            user.monthlyStats?.currentlyPlaying ||
                            'Not listening'}
                        </p>

                        <p className={styles.userInfo}>
                          🔝 Top song:{' '}
                          {user.spotifyStats?.topSong ||
                            user.monthlyStats?.currentSong ||
                            'N/A'}
                        </p>

                        <p className={styles.userInfo}>
                          👤 Top artist:{' '}
                          {user.spotifyStats?.topArtist ||
                            user.monthlyStats?.topArtist ||
                            'N/A'}
                        </p>

                        <p className={styles.userInfo}>
                          ⏱️ Minutes:{' '}
                          {user.spotifyStats?.minutes ||
                            user.monthlyStats?.minutes ||
                            'N/A'}
                        </p>

                        <p className={styles.userInfo}>
                          🎵 Top genre:{' '}
                          {user.spotifyStats?.topGenre ||
                            user.monthlyStats?.topGenre ||
                            'N/A'}
                        </p>

                        <p className={styles.userInfo}>
                          💬 Looking for: {user.lookingFor || 'Not specified'}
                        </p>

                        {/* Genre Tags */}
                        <div className={styles.genreTags}>
                          {user.genres?.slice(0, 3).map((genre, i) => (
                            <span key={i} className={styles.genreTag}>
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TinderCard>
              );
            })}
        </div>
      </div>
    </PageWrapper>
  );
}
