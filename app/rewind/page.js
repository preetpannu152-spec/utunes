import TopNav from '@/components/TopNav';
import PageWrapper from '@/components/PageWrapper';

export default function Rewind() {
  return (
    <>
      <TopNav active="Rewind" />
        <div className="p-10 text-center">
          <h1 className="text-4xl font-bold">Your Music Rewind 🔁</h1>
          <p className="opacity-70 mt-4">Here's what your semester sounded like</p>
        </div>

        <div className="grid grid-cols-2 gap-6 p-10 max-w-6xl">

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">Minutes listened: 24,827</h1>
            <p className="opacity-70 mt-4">Top 3% of UT listeners. That's {Math.round(24827 / 60)} hours of pure music! </p>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">Most played song: Pink + White</h1>
            <p className="opacity-70 mt-4">Frank Ocean · 347 plays</p>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">Top Genre: Pop</h1>
            <p className="opacity-70 mt-4">You and 1,247 other Longhorns</p>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">Top Match: Bob</h1>
            <p className="opacity-70 mt-4">94% match. You two have incredibly similar taste!</p>
          </div>
        </div>
    </>
    
  );
}
