'use client';

import Image from 'next/image';
import TopNav from '@/components/TopNav';
import { useRouter } from 'next/navigation';
import styles from './events.module.css';

export default function EventsPage() {
  const router = useRouter();

  const cards = [
    { id: '1', logo: '/cactuscafe.png', alt: 'Cactus Cafe' },
    { id: '2', logo: '/moody.png', alt: 'Moody Center' },
    { id: '3', logo: '/mozarts.png', alt: "Mozart's" },
  ];

  return (
    <>
      <TopNav active="Events" />

      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* Header */}
          <div className={styles.header}>
            <Image
              src="/eventsnearyou.png"
              alt="Events Near You"
              width={1000}
              height={300}
              className={styles.headerImage}
            />
          </div>

          {/* Cards */}
          <div className={styles.cardsContainer}>
            <div className={styles.cardsGrid}>
              {cards.map((c, index) => {
                const isLast = index === cards.length - 1;

                return (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/events/chat/${c.id}`)}
                    className={`${styles.card} ${isLast ? styles.cardLast : ''}`}
                  >
                    <div className={styles.cardContent}>
                      <Image
                        src={c.logo}
                        alt={c.alt}
                        width={450}
                        height={300}
                        className={styles.cardLogo}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}