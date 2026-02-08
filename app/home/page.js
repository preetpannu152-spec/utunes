import TopNav from '@/components/TopNav';

export default function Home() {
  return (
    <>
      <TopNav active="Home" />
      <div className="p-10 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to UTunes 🤘</h1>
        <p className="opacity-80">
          Swipe, share playlists, and meet fellow Longhorns through music.
        </p>
      </div>
    </>
  );
}
