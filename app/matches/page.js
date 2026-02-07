'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return router.push('/signin');

      // Fetch all matches involving current user
      const q1 = query(collection(db, 'matches'), where('user1', '==', currentUser.uid));
      const q2 = query(collection(db, 'matches'), where('user2', '==', currentUser.uid));

      const snap1 = await getDocs(q1);
      const snap2 = await getDocs(q2);

      const allMatches = [...snap1.docs, ...snap2.docs].map(doc => ({ id: doc.id, ...doc.data() }));
      setMatches(allMatches);

      // Fetch all user info
      const uids = allMatches.flatMap(m => [m.user1, m.user2]);
      const map = {};
      for (let uid of [...new Set(uids)]) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) map[uid] = userDoc.data();
      }
      setUsersMap(map);
    };

    fetchMatches();
  }, [router]);

  if (matches.length === 0)
    return <div className="flex items-center justify-center h-screen text-white bg-[#BF5700]">No matches yet 😢</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#BF5700] px-4">
      <h1 className="text-3xl text-white font-bold mb-6">Your Matches</h1>
      <div className="w-full max-w-md flex flex-col gap-4">
        {matches.map(match => {
          const otherUid = match.user1 === auth.currentUser.uid ? match.user2 : match.user1;
          const otherUser = usersMap[otherUid];

          return (
            <Link key={match.id} href={`/chat/${match.id}`} className="bg-white text-black rounded-xl p-4 shadow-lg">
              <div className="font-bold">{otherUser?.username}</div>
              <div className="text-sm">{otherUser?.year} • {otherUser?.major}</div>
              <div className="mt-2 text-sm">
                Top Artists: {otherUser?.spotifyStats.topArtists.join(', ')} <br/>
                Current Song: {otherUser?.spotifyStats.currentSong} <br/>
                Top Track: {otherUser?.spotifyStats.monthlyWrap.topTrack}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}