'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function EventChatPage() {
  const router = useRouter();
  const { roomId } = useParams();

  const [messages, setMessages] = useState([
    { id: 1, user: 'alexis', text: 'who’s going tonight?' },
    { id: 2, user: 'jordan', text: 'me + 3 friends' },
    { id: 3, user: 'sammy', text: 'what time does it start?' },
    { id: 4, user: 'lee', text: 'doors at 7, music at 8' },
    { id: 5, user: 'mia', text: 'parking nearby?' },
  ]);

  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: 'you', text: input.trim() },
    ]);

    setInput('');
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4e8d0]">
      {/* Header */}
      <div className="bg-[#3d2817] text-amber-100 p-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/events')}
          className="px-3 py-1 bg-[#6b4a31] rounded font-bold"
        >
          ← Back
        </button>
        <div>
          <div className="font-bold tracking-wide">EVENT CHAT</div>
          <div className="text-xs opacity-70">Room #{roomId}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f9f3e8]">
        {messages.map((m) => (
          <div key={m.id}>
            <div className="text-xs font-bold opacity-60">@{m.user}</div>
            <div
              className={`inline-block px-4 py-2 rounded border shadow-sm max-w-[80%]
                ${m.user === 'you'
                  ? 'bg-[#d4a574] border-[#b8935f]'
                  : 'bg-[#e8d5b7] border-[#c4a975]'
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#3d2817] flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type message…"
          className="flex-1 px-4 py-2 rounded outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-[#8b6f47] text-white font-bold rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
