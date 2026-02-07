'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const allGenres = ['Pop', 'Hip-Hop', 'Indie', 'Rock', 'EDM', 'R&B', 'Jazz'];

  const toggleGenre = g => {
    setGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const signup = async () => {
    if (!email || !password || !year) return alert('Fill all fields');

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email,
        year,
        genres,
        spotifyLinked: false,
        createdAt: serverTimestamp()
      });

      setSuccess('Account created successfully!');
      setTimeout(() => router.push('/swipe'), 1200);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#51423A] text-white">
      <div className="w-[350px] p-6 bg-[#968C89] rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Join UTunes 🎵</h1>

        <input
          className="w-full p-2 mb-2 text-black rounded"
          placeholder="UT Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-2 text-black rounded"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <select
          className="w-full p-2 mb-3 text-black rounded"
          onChange={e => setYear(e.target.value)}
        >
          <option value="">Graduation Year</option>
          {[2026, 2027, 2028, 2029, 2030].map(y => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <p className="text-sm mb-1">Genres</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {allGenres.map(g => (
            <button
              key={g}
              onClick={() => toggleGenre(g)}
              className={`px-2 py-1 rounded text-sm ${
                genres.includes(g) ? 'bg-[#D16A28]' : 'bg-[#BBC5CD] text-black'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <button
          onClick={signup}
          disabled={loading}
          className="w-full bg-[#B34A26] p-2 rounded font-bold"
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        {success && (
          <p className="mt-3 text-green-200 text-sm">{success}</p>
        )}
      </div>
    </div>
  );
}