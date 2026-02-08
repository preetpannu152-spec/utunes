'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import LoadingScreen from '@/components/LoadingScreen';

export default function SwipePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/signin');
        return;
      }
      setUser(currentUser);
      await loadUsers(currentUser.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadUsers = async (currentUid) => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const allUsers = usersSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.uid !== currentUid);
      
      console.log('Loaded users:', allUsers); // Debug
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSwipe = async (direction) => {
    const target = users[currentIndex];
    
    // FIX: Check if target and target.uid exist
    if (!target || !target.uid) {
      console.error('Invalid target user:', target);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    try {
      // Record the swipe
      await addDoc(collection(db, 'swipes'), {
        from: user.uid,
        to: target.uid,
        direction,
        timestamp: new Date()
      });

      // Check for mutual match
      if (direction === 'right') {
        const mutualQuery = query(
          collection(db, 'swipes'),
          where('from', '==', target.uid),
          where('to', '==', user.uid),
          where('direction', '==', 'right')
        );
        const mutualSnap = await getDocs(mutualQuery);

        if (!mutualSnap.empty) {
          // It's a match!
          await addDoc(collection(db, 'matches'), {
            user1: user.uid,
            user2: target.uid,
            createdAt: new Date(),
            messages: []
          });
          alert('🎉 It\'s a match!');
        }
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Error swiping:', error);
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const currentUser = users[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#005F86] via-[#00A9E0] to-[#87CEEB] relative overflow-hidden">
      {/* Vinyl Record Background - Left */}
      <div className="absolute left-0 top-1/4 -translate-x-1/2">
        <div className="w-96 h-96 rounded-full bg-black opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-gray-700"
              style={{ margin: `${i * 8}px`, opacity: 0.5 }}
            ></div>
          ))}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-[#BF5700] to-[#D16A28]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black"></div>
          </div>
        </div>
      </div>

      {/* Vinyl Record Background - Right */}
      <div className="absolute right-0 bottom-1/4 translate-x-1/2">
        <div className="w-80 h-80 rounded-full bg-black opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-gray-700"
              style={{ margin: `${i * 8}px`, opacity: 0.5 }}
            ></div>
          ))}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#005F86] to-[#00A9E0]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black"></div>
          </div>
        </div>
      </div>

      {/* Curved wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gray-900 rounded-t-[100%] z-0"></div>

      {/* Top Navigation */}
      <div className="relative z-10 p-6">
        <h1 className="text-5xl font-bold text-white text-center">
          <span className="text-white">UT</span>
          <span className="text-[#BF5700]">UNES</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 mt-12">
        {!currentUser ? (
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-6">You're all caught up! 🎧</h2>
            <p className="text-2xl">Check back later for more matches</p>
          </div>
        ) : (
          <>
            {/* Spotify-Style Music Player Card */}
            <div className="w-full max-w-md mb-12">
              {/* Phone/Player Frame */}
              <div className="bg-gradient-to-br from-gray-800 to-black rounded-[3rem] p-6 shadow-2xl">
                {/* Album Art / User Photo */}
                <div className="bg-gradient-to-br from-[#BF5700] to-[#D16A28] rounded-3xl aspect-square mb-6 overflow-hidden shadow-xl flex items-center justify-center">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-9xl text-white font-bold">
                      {currentUser.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>

                {/* Song Info Style */}
                <div className="mb-6">
                  <h2 className="text-white text-3xl font-bold mb-2">
                    {currentUser.username || 'UT Student'}
                  </h2>
                  <p className="text-gray-400 text-xl">
                    {currentUser.year || 'Longhorn'} • {currentUser.genres?.[0] || 'Music Lover'}
                  </p>
                </div>

                {/* Monthly Stats */}
                {currentUser.spotifyStats && (
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6">
                    <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-wider">
                      Monthly Wrap
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white text-base">
                        🎵 Top Artist: <span className="font-bold">{currentUser.spotifyStats.topArtists?.[0] || 'N/A'}</span>
                      </p>
                      <p className="text-white text-base">
                        🎧 Total Minutes: <span className="font-bold">{currentUser.spotifyStats.totalMinutes || '0'}</span>
                      </p>
                      <p className="text-white text-base">
                        🔥 Top Genre: <span className="font-bold">{currentUser.spotifyStats.topGenre || 'Pop'}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Music Player Controls */}
                <div className="flex items-center justify-center gap-10">
                  <button className="text-white text-4xl hover:scale-110 transition">
                    ⏮
                  </button>
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black text-4xl hover:scale-110 transition shadow-lg">
                    ❚❚
                  </button>
                  <button className="text-white text-4xl hover:scale-110 transition">
                    ⏭
                  </button>
                </div>
              </div>
            </div>

            {/* Swipe Buttons - Bigger and more spaced */}
            <div className="flex gap-12 mb-8">
              <button
                onClick={() => handleSwipe('left')}
                className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white text-5xl font-bold shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
              >
                ✕
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="w-24 h-24 rounded-full bg-green-500 hover:bg-green-600 text-white text-5xl font-bold shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
              >
                ♥
              </button>
            </div>

            {/* Genres Display */}
            {currentUser.genres && currentUser.genres.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center max-w-md">
                {currentUser.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-lg font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation - Bigger text */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#BF5700] z-20 shadow-2xl">
        <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-4">
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
              className={`text-sm font-bold uppercase tracking-wider transition ${
                tab === 'Connect'
                  ? 'text-white scale-110'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}