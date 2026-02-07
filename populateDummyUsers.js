// ES module syntax - works with "type": "module" in package.json

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// -------------------
// 1️⃣ Replace these with your Firebase config
// -------------------
const firebaseConfig = {
  apiKey: "AIzaSyCzoaLwmECSjb_xq8e-EnVFx4jonSXMnUw",
  authDomain: "utunes.firebaseapp.com",
  projectId: "utunes",
  storageBucket: "utunes.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "G-T7TTHSBXDT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------
// 2️⃣ Dummy UT users
// -------------------
const dummyUsers = [
  { uid: 'user1', username: 'Alex', year: 'Sophomore', major: 'CS' },
  { uid: 'user2', username: 'Jamie', year: 'Junior', major: 'EE' },
  { uid: 'user3', username: 'Taylor', year: 'Senior', major: 'Biology' }
];

const artistsPool = ["Taylor Swift","Kendrick Lamar","Dua Lipa","Drake","Billie Eilish","BTS"];
const songsPool = ["Anti-Hero","God's Plan","Bad Guy","Dynamite","Stay","Blinding Lights","Levitating"];

// -------------------
// 3️⃣ Populate Firestore
// -------------------
async function populate() {
  for (let user of dummyUsers) {
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
      ...user,
      spotifyStats: dummySpotifyStats
    });

    console.log(`Added ${user.username}`);
  }
  console.log('✅ Dummy users added successfully!');
}

populate().catch(console.error);