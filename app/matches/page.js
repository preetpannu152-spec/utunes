'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import TopNav from '@/components/TopNav';
import Image from 'next/image';
import styles from './matches.module.css';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/signup');
        return;
      }

      try {
        const q1 = query(collection(db, 'matches'), where('user1', '==', currentUser.uid));
        const q2 = query(collection(db, 'matches'), where('user2', '==', currentUser.uid));
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const allMatches = [...snap1.docs, ...snap2.docs].map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setMatches(allMatches);

        const uids = allMatches.flatMap((m) => [m.user1, m.user2]);
        const uniqueUids = [...new Set(uids)];
        const map = {};

        for (let uid of uniqueUids) {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            map[uid] = userDoc.data();
          } else {
            map[uid] = {
              username: 'periperichickenpizza',
              email: 'dummy@example.com',
              year: 'UT Student',
              genres: ['Pop', 'Hip-Hop', 'Jazz']
            };
          }
        }

        setUsersMap(map);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Image 
          src="/bevologo.png" 
          alt="Loading" 
          width={200} 
          height={200} 
          className={styles.loadingLogo}
        />
        <h2 className={styles.loadingText}>Loading...</h2>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <TopNav active="Matches" />

      <div className={styles.contentContainer}>
        {matches.length === 0 ? (
          <div className={styles.noMatchesContainer}>
            <br />
            <h2></h2>
            <div className={styles.noMatchesIcon}>🎵</div>
            <h2 className={styles.noMatchesTitle}>No matches yet</h2>
            <p className={styles.noMatchesSubtitle}>Keep swiping!</p>
            <button
              onClick={() => router.push('/swipe')}
              className={styles.startSwipingButton}
            >
              Start Swiping
            </button>
          </div>
        ) : (
          
          matches.map((match) => {
            const otherUid = match.user1 === auth.currentUser?.uid ? match.user2 : match.user1;
            const otherUser = usersMap[otherUid];

            return (
              <div key={match.id} className={styles.matchCard}>
                <div className={styles.matchHeader}>
                  <div className={styles.avatar}>
                    {otherUser.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.username}>
                      {otherUser.username || 'periperichickenpizza'}
                    </h3>
                    <p className={styles.year}>{otherUser.year || 'UT Student'}</p>
                  </div>
                </div>

                {otherUser.genres && otherUser.genres.length > 0 && (
                  <div className={styles.genreTags}>
                    {otherUser.genres.slice(0, 3).map((genre) => (
                      <span key={genre} className={styles.genreTag}>
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => router.push(`/chat/${[match.user1, match.user2].sort().join('_')}`)}
                  className={styles.chatButton}
                >
                  💬 Start Chatting
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}