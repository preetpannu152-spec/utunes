'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function SpotifyCallback() {
  const router = useRouter();

  useEffect(() => {
    const fetchSpotifyData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) return;

      // Exchange code for access token
      const response = await fetch('/api/spotifyToken?code=' + code);
      const data = await response.json();
      const accessToken = data.access_token;

      // Fetch top artists
      const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists', {
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      const topArtistsData = await topArtistsRes.json();

      // Fetch currently playing song
      const currentRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      const currentData = await currentRes.json();

      // Fetch top tracks (monthly wrap)
      const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      const topTracksData = await topTracksRes.json();

      // Save stats in Firestore
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          spotifyStats: {
            topArtists: topArtistsData.items.map(a => a.name),
            currentSong: currentData?.item?.name || 'N/A',
            monthlyWrap: {
              totalMinutes: topTracksData.items.length * 3, // rough example
              topGenre: topArtistsData.items[0]?.genres[0] || 'N/A'
            }
          }
        });
      }

      alert('Spotify stats saved!');
      router.push('/swipe');
    };

    fetchSpotifyData();
  }, [router]);

  return <div className="flex items-center justify-center h-screen bg-[#BF5700] text-white">Linking Spotify...</div>;
}