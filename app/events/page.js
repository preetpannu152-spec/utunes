'use client';

import Image from 'next/image';
import TopNav from '@/components/TopNav';
import { useRouter } from 'next/navigation';

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

      <div className="min-h-screen bg-[#f3f0ea]">
        <div className="max-w-7xl mx-auto px-12 py-16">
          {/* Header */}
          <div className="mb-20 flex justify-center">
            <Image
              src="/eventsnearyou.png"
              alt="Events Near You"
              width={1000}
              height={180}
              priority
            />
          </div>

          {/* Cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-x-28 gap-y-20">
              {cards.map((c, index) => {
                const isLast = index === cards.length - 1;

                return (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/events/chat/${c.id}`)}
                    className={`w-[400px] bg-white rounded-md shadow-md cursor-pointer
                      transition-all hover:-translate-y-1 hover:shadow-xl
                      ${isLast ? 'col-span-2 justify-self-center -mt-10' : ''}
                    `}
                  >
                    <div className="px-10 py-14 flex justify-center">
                      <Image
                        src={c.logo}
                        alt={c.alt}
                        width={380}
                        height={220}
                        className="object-contain"
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
