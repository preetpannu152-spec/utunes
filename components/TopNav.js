'use client';
import { useRouter } from 'next/navigation';
import styles from "./TopNav.module.css";

export default function TopNav({ active }) {
  const router = useRouter();
  const tabs = [
    { label: 'Connect', path: '/swipe' },
    { label: 'Share', path: '/playlists' },
    { label: 'Events', path: '/events' },
    { label: 'Rewind', path: '/rewind' },
    { label: 'Account', path: '/account' },
  ];

  return (
    <div className={styles.topNav}>
      {tabs.map(t => (
        <button
          key={t.label}
          onClick={() => router.push(t.path)}
          className={`${styles.navButton} ${
            active === t.label ? styles.navButtonActive : ''
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
