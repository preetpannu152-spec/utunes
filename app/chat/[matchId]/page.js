'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function ChatPage() {
  const params = useParams();
  const matchId = params.matchId;
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMatch = async () => {
      const docRef = doc(db, 'matches', matchId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setMatch(docSnap.data());
          setMessages(docSnap.data().messages || []);
        }
      });
      return unsubscribe;
    };

    fetchMatch();
  }, [matchId]);

  const sendMessage = async () => {
    if (!newMessage || !match) return;

    const msg = {
      from: auth.currentUser.uid,
      text: newMessage,
      timestamp: new Date()
    };

    const docRef = doc(db, 'matches', matchId);
    await updateDoc(docRef, {
      messages: arrayUnion(msg)
    });

    setNewMessage('');
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!match)
    return <div className="flex items-center justify-center h-screen bg-[#BF5700] text-white">Loading chat...</div>;

  const otherUid = match.user1 === auth.currentUser.uid ? match.user2 : match.user1;

  return (
    <div className="flex flex-col h-screen bg-[#BF5700] p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Chat with {otherUid}
      </h1>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 p-2 rounded ${msg.from === auth.currentUser.uid ? 'bg-white text-black self-end' : 'bg-gray-800'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded text-black"
        />
        <button onClick={sendMessage} className="bg-white text-[#BF5700] p-2 rounded font-bold">
          Send
        </button>
      </div>
    </div>
  );
}