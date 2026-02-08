import Image from 'next/image';
import TopNav from '@/components/TopNav';
import PageWrapper from '@/components/PageWrapper';

const SPOTS = [
  { name: 'PCL Power Hours', link: 'https://open.spotify.com/playlist/3aBgULqlOzZQiTmhZI6OSO?si=3f111fa6c51244a7&pt=27dd448fb4d50dee89f2c52259997c87', image: '/pcl.png' },
  { name: 'GDC Grind Mode', link: 'https://open.spotify.com/playlist/1LeaEE38lVCEJjziV9G3aW?si=f6c0b76deb324226&pt=21389b53a1edfd9b6b2e960bfd87de98', image: '/gdc.png' },
  { name: 'UT Tower Sunset', link: 'https://open.spotify.com/playlist/1AVEZzd60RoihpC3Q1KKZm?si=2460f4ce913e40d5&pt=388fe040be874310ce65934577124f9a', image: '/tower.png' },
  { name: 'Up & Atom Vibes', link: 'https://open.spotify.com/playlist/08qp62BlEsBTlIj0UZTuZc?si=b5d400aabf934db3&pt=a66db7eeea8a8128bde0d4d79308b82d', image: '/uaa.png' },
];

export default function PlaylistsPage() {
  return (
    <PageWrapper>
      <TopNav active="Playlists" />

      {/* pushed down */}
      <br></br>
      <div className="grid grid-cols-2 gap-6 px-10 pt-20">
        {SPOTS.map(s => (
          <a
            key={s.name}
            href={s.link}
            target="_blank"
            className="bg-white p-4 rounded-xl text-center hover:shadow-lg transition flex flex-col items-center"
          >
            {/* 200x200 images */}
            <Image
              src={s.image}
              alt={s.name}
              width={450}
              height={300}
              className="mb-3 rounded object-cover"
            />
            <h3 className="font-bold">{s.name}</h3>
          </a>
        ))}
      </div>
    </PageWrapper>
  );
}
