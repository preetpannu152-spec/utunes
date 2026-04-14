import TopNav from '@/components/TopNav';
import PageWrapper from '@/components/PageWrapper';
import Image from 'next/image';
import styles from './rewind.module.css';

export default function Rewind() {
  return (
    <>
      <TopNav active="Rewind" />
      <PageWrapper>
        <div className={styles.logoContainer}>
          <Image
            src="/rewind.png"
            alt="UTunes Rewind"
            width={1000}
            height={300}
            className={styles.logo}
          />
        </div>

        <div className={styles.introSection}>
          <p className={styles.introText}>Here's what your semester sounded like 🔁</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h1 className={styles.statTitle}>Minutes listened: 24,827</h1>
            <p className={styles.statDescription}>
              Top 3% of UT listeners. That's {Math.round(24827 / 60)} hours of pure music!
            </p>
          </div>

          <div className={styles.statCard}>
            <h1 className={styles.statTitle}>Most played song: Pink + White</h1>
            <p className={styles.statDescription}>Frank Ocean · 347 plays</p>
          </div>

          <div className={styles.statCard}>
            <h1 className={styles.statTitle}>Top Genre: Pop</h1>
            <p className={styles.statDescription}>You and 1,247 other Longhorns</p>
          </div>

          <div className={styles.statCard}>
            <h1 className={styles.statTitle}>Top Match: Bob</h1>
            <p className={styles.statDescription}>
              94% match. You two have incredibly similar taste!
            </p>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}