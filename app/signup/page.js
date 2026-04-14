'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [genres, setGenres] = useState([]);
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(''); // ✅ popup message

  const allGenres = ['Pop', 'Hip-Hop', 'Indie', 'Rock', 'EDM', 'R&B', 'Jazz'];

  const toggleGenre = (g) => {
    setGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500); // disappears after 2.5s
  };

  // Sign Up
  const handleSignup = async () => {
    if (!email || !password || !year || !username) {
      alert('Fill all fields');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        graduationYear: year,
        genres,
        spotifyLinked,
        createdAt: new Date(),
      });

      showToast('Account created successfully! 🎉');
      setTimeout(() => router.push('/swipe'), 1000);

    } catch (error) {
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign In
  const handleSignin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Logged in successfully! 🎉');
      setTimeout(() => router.push('/swipe'), 1000);
    } catch (error) {
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.login}>
          <div className={styles.logo}>
            <img src="/logo.svg" className={styles.utune} alt="LOGO" />
            <img src="/mascot.svg" className={styles.mascot} alt="BEATVO" />
          </div>

          <div className={styles.logintext}>
            <h1 className={styles.title}>{isSignup ? 'SIGN UP' : 'LOGIN'}</h1>

            {isSignup && (
              <>
                <p className={styles.body}>USERNAME</p>
                <input
                  className={styles.box}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </>
            )}

            <p className={styles.body}>EMAIL</p>
            <input
              className={styles.box}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p className={styles.body}>PASSWORD</p>
            <input
              className={styles.box}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {isSignup && (
              <>
                <p className={styles.body}>GRADUATION YEAR</p>
                <select
                  className={styles.box}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {[2026, 2027, 2028, 2029, 2030].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <p className={styles.body}>GENRES</p>
                <div className={styles.genresContainer}>
                  {allGenres.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      className={`${styles.genreButton} ${
                        genres.includes(g) ? styles.genreSelected : ''
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div className={styles.spotifyCheckbox}>
                  <input
                    type="checkbox"
                    id="spotify"
                    checked={spotifyLinked}
                    onChange={() => setSpotifyLinked(!spotifyLinked)}
                  />
                  <label htmlFor="spotify" className={styles.body}>
                    Link Spotify
                  </label>
                </div>
              </>
            )}

            <div className={styles.button}>
              {isSignup ? (
                <>
                  <button 
                    type="button"
                    className={styles.buttonStyle}
                    onClick={handleSignup}
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                  <button 
                    type="button"
                    className={styles.buttonStyle}
                    onClick={() => setIsSignup(false)}
                  >
                    Back to Login
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button"
                    className={styles.buttonStyle}
                    onClick={() => setIsSignup(true)}
                  >
                    Create Account
                  </button>
                  <button 
                    type="button"
                    className={styles.buttonStyle}
                    onClick={handleSignin}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <img src="/Record.svg" className={styles.record} alt="RECORD" />
      </div>

      {/* ✅ Bottom Navigation Bar */}
      <div className={styles.bottomNav}>
        <ul className={styles.navbar}>
          <li className={styles.navItem}>Home</li>
          <li className={styles.navItem}>Connect</li>
          <li className={styles.navItem}>Share</li>
          <li className={styles.navItem}>Events</li>
          <li className={styles.navItem}>Rewind</li>
        </ul>
      </div>

      {/* ✅ Toast Popup */}
      {toast && (
        <div className={styles.toast}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
