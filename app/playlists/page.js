import Image from 'next/image';
import TopNav from '@/components/TopNav';
import PageWrapper from '@/components/PageWrapper';
import styles from './playlists.module.css';

const SPOTS = [
  { name: 'PCL Power Hours', link: 'https://open.spotify.com/playlist/3aBgULqlOzZQiTmhZI6OSO?si=3f111fa6c51244a7&pt=27dd448fb4d50dee89f2c52259997c87', image: '/pp.png' },
  { name: 'GDC Grind Mode', link: 'https://open.spotify.com/playlist/1LeaEE38lVCEJjziV9G3aW?si=f6c0b76deb324226&pt=21389b53a1edfd9b6b2e960bfd87de98', image: '/gdc.png' },
  { name: 'UT Tower Sunset', link: 'https://open.spotify.com/playlist/1AVEZzd60RoihpC3Q1KKZm?si=2460f4ce913e40d5&pt=388fe040be874310ce65934577124f9a', image: '/tt.png' },
  { name: 'Up & Atom Vibes', link: 'https://open.spotify.com/playlist/08qp62BlEsBTlIj0UZTuZc?si=b5d400aabf934db3&pt=a66db7eeea8a8128bde0d4d79308b82d', image: '/aa.png' },
];

export default function PlaylistsPage() {
  return (
    <PageWrapper>
      <TopNav active="Playlists" />

      <div className={styles.spacer}></div>
      
      <div className={styles.playlistsGrid}>
        {SPOTS.map(s => (
          <a
            key={s.name}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.playlistCard}
          >
            <Image
              src={s.image}
              alt={s.name}
              width={450}
              height={300}
              className={styles.playlistImage}
            />
            <h3 className={styles.playlistName}>{s.name}</h3>
          </a>
        ))}
      </div>
    </PageWrapper>
  );
}