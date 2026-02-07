'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const router = useRouter();

  const artistsPool = ["Taylor Swift","Kendrick Lamar","Dua Lipa","Drake","Billie Eilish","BTS"];
  const songsPool = ["Anti-Hero","God's Plan","Bad Guy","Dynamite","Stay","Blinding Lights","Levitating"];

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const dummySpotifyStats = {
        topArtists: [...Array(3)].map(() => artistsPool[Math.floor(Math.random()*artistsPool.length)]),
        currentSong: songsPool[Math.floor(Math.random()*songsPool.length)],
        monthlyWrap: {
          totalTracks: Math.floor(Math.random()*30 + 10),
          topTrack: songsPool[Math.floor(Math.random()*songsPool.length)]
        }
      };

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username,
        year,
        major,
        spotifyStats: dummySpotifyStats
      });

      alert('Account created successfully!');
      router.push('/swipe');

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#BF5700] p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Sign Up for UTunes</h1>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="p-2 mb-2 rounded text-black w-full max-w-md"/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="p-2 mb-2 rounded text-black w-full max-w-md"/>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="p-2 mb-2 rounded text-black w-full max-w-md"/>
      <input placeholder="Year" value={year} onChange={e=>setYear(e.target.value)} className="p-2 mb-2 rounded text-black w-full max-w-md"/>
      <input placeholder="Major" value={major} onChange={e=>setMajor(e.target.value)} className="p-2 mb-4 rounded text-black w-full max-w-md"/>
      <button onClick={handleSignUp} className="bg-white text-[#BF5700] p-2 rounded font-bold w-full max-w-md">Sign Up</button>
    </div>
  );
}