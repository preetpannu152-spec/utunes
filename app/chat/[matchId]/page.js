'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function ChatPage() {
  const params = useParams();
  // Ensure this matches your folder name, e.g., /chat/[chatId]
  const chatId = params.chatId; 
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    // Direct reference to the document in the 'matches' collection
    const docRef = doc(db, 'matches', chatId);
    
    // Real-time listener to sync with Firestore
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Accessing the 'messages' array from your screenshot
        setMessages(data.messages || []);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      from: auth.currentUser.uid,
      text: newMessage,
      timestamp: new Date() // Firestore converts this to a Timestamp
    };

    try {
      const docRef = doc(db, 'matches', chatId);
      await updateDoc(docRef, {
        messages: arrayUnion(msg)
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#BF5700] p-4 text-white">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, i) => {
          const isMe = msg.from === auth.currentUser?.uid;
          return (
            <div 
              key={i} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-3 rounded-xl max-w-[75%] ${
                isMe ? 'bg-white text-black' : 'bg-gray-800 text-white'
              }`}>
                <p className="text-sm font-bold opacity-50 mb-1">
                  {isMe ? 'You' : 'Match'}
                </p>
                {/* This pulls the 'text' field from your Firestore objects */}
                <p>{msg.text}</p> 
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Send a message..."
          className="flex-1 p-3 rounded-full text-black outline-none"
        />
        <button 
          onClick={sendMessage} 
          className="bg-white text-[#BF5700] px-6 rounded-full font-bold hover:bg-gray-200 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}