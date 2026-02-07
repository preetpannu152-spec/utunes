'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [spotifyStats, setSpotifyStats] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().spotifyStats?.topArtists?.length > 0) {
          setSpotifyLinked(true);
          setSpotifyStats(userDoc.data().spotifyStats);
        }
      } else {
        router.push('/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Dummy function to simulate Spotify linking
  const linkSpotify = async () => {
    if (!user) return;

    // In reality, you'll call Spotify OAuth here
    const dummyStats = {
      topArtists: ['Taylor Swift', 'Drake', 'Billie Eilish'],
      currentSong: 'Blinding Lights - The Weeknd',
      monthlyWrap: {
        totalMinutes: 1234,
        topGenre: 'Pop'
      }
    };

    // Save to Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      spotifyStats: dummyStats
    });

    setSpotifyStats(dummyStats);
    setSpotifyLinked(true);
    alert('Spotify linked! You can now go to Matches.');
  };

  if (!user) return <div className="p-4 text-center">Loading UTunes...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#BF5700] text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}</h1>

      {!spotifyLinked ? (
        <>
          <p className="mb-4 text-center">Link your Spotify account to show your top artists and stats.</p>
          <button
            className="bg-white text-[#BF5700] p-3 rounded font-bold hover:bg-gray-200"
            onClick={linkSpotify}
          >
            Link Spotify
          </button>
        </>
      ) : (
        <>
          <div className="bg-white text-black p-4 rounded-xl w-full max-w-md mb-4 shadow-lg">
            <h2 className="text-xl font-bold mb-2">Spotify Stats</h2>
            <p><strong>Top Artists:</strong> {spotifyStats.topArtists.join(', ')}</p>
            <p><strong>Current Song:</strong> {spotifyStats.currentSong}</p>
            <p><strong>Monthly Wrap:</strong> {spotifyStats.monthlyWrap.totalMinutes} min, Top Genre: {spotifyStats.monthlyWrap.topGenre}</p>
          </div>

          <button
            className="bg-white text-[#BF5700] p-3 rounded font-bold hover:bg-gray-200"
            onClick={() => router.push('/swipe')}
          >
            Go to Matches
          </button>
        </>
      )}
    </div>
  );
}