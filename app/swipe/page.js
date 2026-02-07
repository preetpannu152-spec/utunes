'use client';

import { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

export default function SwipePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/signin');
      } else {
        fetchUsers(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUsers = async (currentUid) => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.uid !== currentUid); // exclude current user
      setUsers(allUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const swiped = async (direction, targetUser) => {
    if (direction !== 'right') return;
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // record swipe
      await addDoc(collection(db, 'swipes'), {
        from: currentUser.uid,
        to: targetUser.uid,
        direction: 'right',
      });

      // check for match
      const q = query(
        collection(db, 'swipes'),
        where('from', '==', targetUser.uid),
        where('to', '==', currentUser.uid),
        where('direction', '==', 'right')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await addDoc(collection(db, 'matches'), {
          user1: currentUser.uid,
          user2: targetUser.uid,
          matchedAt: new Date(),
        });
        alert(`You matched with ${targetUser.username}!`);
      }
    } catch (err) {
      console.error('Error swiping:', err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white bg-[#BF5700]">
        Loading UTunes...
      </div>
    );

  if (!users.length)
    return (
      <div className="flex items-center justify-center h-screen text-white bg-[#BF5700] text-center">
        No other UT users found 😢
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#BF5700] px-4">
      <h1 className="text-3xl text-white font-bold mb-6">Swipe on UT Users 🎵</h1>
      <div className="w-full max-w-md h-[500px] relative">
        {users.map(user => (
          <TinderCard key={user.id} onSwipe={dir => swiped(dir, user)} className="absolute">
            <div className="bg-white text-black rounded-xl p-6 shadow-lg w-full h-[500px] flex flex-col justify-between">
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p><strong>Year:</strong> {user.year || 'N/A'}</p>
              <p><strong>Major:</strong> {user.major || 'N/A'}</p>
              <p><strong>Top Artists:</strong> {user.spotifyStats?.topArtists?.join(', ') || 'N/A'}</p>
              <p><strong>Current Song:</strong> {user.spotifyStats?.currentSong || 'N/A'}</p>
              <p><strong>Top Track This Month:</strong> {user.spotifyStats?.monthlyWrap?.[0]?.topTrack || 'N/A'}</p>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}