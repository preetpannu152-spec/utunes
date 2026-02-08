'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Image from 'next/image';

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
      <div className="min-h-screen bg-gradient-to-br from-[#BF5700] to-[#D16A28] flex flex-col items-center justify-center text-white">
        <Image src="/bevologo.png" alt="Loading" width={200} height={200} className="mb-6 animate-pulse" />
        <h2 className="text-4xl font-bold">Loading...</h2>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#BF5700] to-[#D16A28] flex flex-col items-center justify-center text-white p-6">
        <div className="text-8xl mb-6">🎵</div>
        <h2 className="text-5xl font-bold mb-4">No matches yet</h2>
        <p className="text-2xl opacity-90 mb-10">Keep swiping!</p>
        <button
          onClick={() => router.push('/swipe')}
          className="bg-white text-[#BF5700] px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-gray-100"
        >
          Start Swiping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BF5700] to-[#D16A28] pb-28">
      <div className="p-8">
        <h1 className="text-6xl font-bold text-white text-center mb-12 mt-8">
          Your Matches 🎉
        </h1>

        <div className="max-w-3xl mx-auto space-y-6">
          {matches.map((match) => {
            const otherUid = match.user1 === auth.currentUser?.uid ? match.user2 : match.user1;
            const otherUser = usersMap[otherUid];

            if (!otherUser) return null;

            return (
              <div
                key={match.id}
                className="bg-white rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-[1.02] transition"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#BF5700] to-[#D16A28] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {otherUser.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {otherUser.username || otherUser.email}
                    </h3>
                    <p className="text-xl text-gray-600">{otherUser.year || 'UT Student'}</p>
                  </div>
                </div>

                {otherUser.genres && otherUser.genres.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {otherUser.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="bg-[#BF5700] text-white px-4 py-2 rounded-full text-lg"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <button className="w-full bg-[#005F86] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#00A9E0]">
                  💬 Start Chatting
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#BF5700] z-20 shadow-2xl">
        <div className="flex justify-around items-center h-24 max-w-3xl mx-auto px-6">
          {['Home', 'Connect', 'Share', 'Events', 'Rewind'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'Home') router.push('/');
                if (tab === 'Connect') router.push('/swipe');
                if (tab === 'Share') router.push('/playlists');
                if (tab === 'Events') router.push('/events');
                if (tab === 'Rewind') router.push('/rewind');
              }}
              className="text-base font-bold text-white/70 uppercase hover:text-white"
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}