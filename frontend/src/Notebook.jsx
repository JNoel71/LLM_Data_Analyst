import { useState, useEffect } from "react";
import { FiFileText } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";

export default function Notebook({ onOpenChat, onNewChat }) {
  const [chats, setChats] = useState([]);

  // Load chat sessions from backend
  const fetchChats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/chats");
      const data = await res.json();
      setChats(data.chats || []);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleNewChat = () => {
    // Generate a new UUID for this chat
    const newSessionId = uuidv4();
    onNewChat(newSessionId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notebook</h1>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl shadow"
        >
          New Chat
        </button>
      </div>

      <div className="space-y-4">
        {chats.length === 0 && (
          <div className="text-gray-400 italic">No chats yet</div>
        )}

        {chats.map((chat) => (
          <div
            key={chat.session_id}
            onClick={() => onOpenChat(chat.session_id)}
            className="p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 cursor-pointer flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">{chat.title}</span>
              {chat.preview && chat.preview.includes("[Attached file:") && (
                <FiFileText className="text-gray-300" />
              )}
            </div>
            <p className="text-gray-300 text-sm truncate">
              {chat.preview}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


