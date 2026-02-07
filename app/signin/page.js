'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      router.push('/swipe'); // redirect to swipe page after login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#BF5700]">
      <div className="bg-white p-6 rounded-xl w-80">
        <h1 className="text-2xl font-bold mb-4">UTunes Sign In</h1>
        <input
          type="email"
          placeholder="UT Email"
          className="border w-full p-2 mb-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-[#BF5700] text-white w-full p-2 rounded mb-2"
          onClick={handleSignIn}
        >
          Sign In
        </button>
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <span
            className="text-[#BF5700] cursor-pointer font-bold"
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}