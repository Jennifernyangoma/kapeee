import { useEffect, useState } from 'react';

export default function Deals() {
  const [seconds, setSeconds] = useState(3600);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <section className="container-max my-10">
      <h1 className="text-2xl font-bold">Deals of the Day</h1>
      <p className="text-gray-600">
        Hurry! Offer ends in {`${h}h ${m}m ${s}s`}.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <img
            src="https://picsum.photos/800/400?random=200"
            className="w-full rounded-xl"
          />
          <h3 className="mt-4 text-lg font-semibold">Mega TV Bundle</h3>
          <p className="text-gray-600">Save big on the entertainment setup.</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold">$899</span>
            <span className="text-gray-400 line-through">$1199</span>
          </div>
          <button className="btn-primary mt-4 w-full">Grab Deal</button>
        </div>
        <div className="card p-6">
          <img
            src="https://picsum.photos/800/400?random=201"
            className="w-full rounded-xl"
          />
          <h3 className="mt-4 text-lg font-semibold">Creator Camera Kit</h3>
          <p className="text-gray-600">Lens + mic + bag included.</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold">$1,099</span>
            <span className="text-gray-400 line-through">$1,399</span>
          </div>
          <button className="btn-primary mt-4 w-full">Grab Deal</button>
        </div>
      </div>
    </section>
  );
}
