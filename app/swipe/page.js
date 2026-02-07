'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from 'firebase/firestore';

const TABS = ['Swipe', 'Chats', 'Account', 'Events', 'Playlists'];

export default function SwipePage() {
  const user = auth.currentUser;

  const [tab, setTab] = useState('Swipe');
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [incomingLikes, setIncomingLikes] = useState([]);

  /* ---------------- LOAD USERS ---------------- */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(
        snap.docs
          .map(d => d.data())
          .filter(u => u.uid !== user.uid)
      );

      const matchSnap = await getDocs(
        query(collection(db, 'matches'), where('users', 'array-contains', user.uid))
      );
      setMatches(matchSnap.docs.map(d => d.data()));

      const likesSnap = await getDocs(
        query(
          collection(db, 'swipes'),
          where('to', '==', user.uid),
          where('direction', '==', 'right')
        )
      );
      setIncomingLikes(likesSnap.docs.map(d => d.data()));
    };

    load();
  }, [user]);

  /* ---------------- SWIPE ---------------- */
  const swipe = async direction => {
    const target = users[index];
    if (!target) return;

    await addDoc(collection(db, 'swipes'), {
      from: user.uid,
      to: target.uid,
      direction
    });

    if (direction === 'right') {
      const q = query(
        collection(db, 'swipes'),
        where('from', '==', target.uid),
        where('to', '==', user.uid),
        where('direction', '==', 'right')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await addDoc(collection(db, 'matches'), {
          users: [user.uid, target.uid],
          createdAt: new Date()
        });
      }
    }

    setIndex(i => i + 1);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#51423A] text-white p-4">
      {/* Tabs */}
      <div className="flex gap-3 mb-6 justify-center">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? 'bg-[#D16A28]' : 'bg-[#968C89]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ---------------- SWIPE TAB ---------------- */}
      {tab === 'Swipe' && (
        <>
          {!users[index] ? (
            <p className="text-center">You’re all caught up 🎧</p>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-[420px] bg-[#968C89] p-6 rounded-xl mb-6">
                <h2 className="text-xl font-bold">{users[index].email}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {users[index].genres?.map(g => (
                    <span
                      key={g}
                      className="bg-[#BBC5CD] text-black px-2 py-1 rounded text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-10">
                <button
                  onClick={() => swipe('left')}
                  className="bg-red-500 w-16 h-16 rounded-full text-3xl"
                >
                  ❌
                </button>
                <button
                  onClick={() => swipe('right')}
                  className="bg-green-500 w-16 h-16 rounded-full text-3xl"
                >
                  ✅
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---------------- CHATS TAB ---------------- */}
      {tab === 'Chats' && (
        <div>
          <h2 className="text-xl font-bold mb-3">Matches</h2>
          {matches.length === 0 && <p>No matches yet</p>}
          {matches.map((m, i) => (
            <div key={i} className="bg-[#968C89] p-3 mb-2 rounded">
              Match with{' '}
              {m.users.find(u => u !== user.uid)}
            </div>
          ))}

          <h2 className="text-xl font-bold mt-6 mb-3">Liked You</h2>
          {incomingLikes.map((l, i) => (
            <div key={i} className="bg-[#B34A26] p-3 mb-2 rounded">
              Someone liked you — review in Swipe
            </div>
          ))}
        </div>
      )}

      {/* ---------------- ACCOUNT TAB ---------------- */}
      {tab === 'Account' && (
        <div className="bg-[#968C89] p-6 rounded">
          <h2 className="text-xl font-bold mb-4">Account</h2>
          <p className="mb-2">Spotify: <b>Not linked</b></p>
          <button
            className="bg-[#D16A28] px-4 py-2 rounded mb-3"
            onClick={() => alert('Spotify linking coming soon')}
          >
            Link Spotify (Demo)
          </button>
          <br />
          <a
            href="https://spotify.com"
            target="_blank"
            className="underline"
          >
            Open Spotify
          </a>
        </div>
      )}

      {/* ---------------- EVENTS TAB ---------------- */}
      {tab === 'Events' && (
        <div>
          {['ACL 2026', 'Moody Amphitheater', 'Mozart’s'].map(e => (
            <div key={e} className="bg-[#968C89] p-3 mb-2 rounded">
              🎶 {e} group chat
            </div>
          ))}
        </div>
      )}

      {/* ---------------- PLAYLIST TAB ---------------- */}
      {tab === 'Playlists' && (
        <div>
          {['PCL', 'GDC', 'UT Tower'].map(p => (
            <div key={p} className="bg-[#968C89] p-3 mb-2 rounded">
              📍 {p} playlist
            </div>
          ))}
        </div>
      )}
    </div>
  );
}