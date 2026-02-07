'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EventsPage() {
const [events, setEvents] = useState([]);

useEffect(() => {
const load = async () => {
const snap = await getDocs(collection(db, 'events'));
setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
};
load();
}, []);

const join = async (id) => {
await addDoc(collection(db, 'events', id, 'members'), { joinedAt: new Date() });
};

return (
<div className="p-6">
<h1 className="text-2xl font-bold mb-4">Austin Music Events</h1>
{events.map(e => (
<div key={e.id} className="border p-4 mb-2 rounded">
<h2 className="font-bold">{e.name}</h2>
<button className="bg-[#BF5700] text-white p-2 mt-2" onClick={() => join(e.id)}>Join</button>
</div>
))}
</div>
);
}