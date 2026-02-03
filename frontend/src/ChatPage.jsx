import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeAddClasses from "rehype-add-classes";
import "highlight.js/styles/github-dark.css";
import { FiPaperclip, FiFileText } from "react-icons/fi";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // On page load, if there's a chat UUID, fetch messages
  useEffect(() => {
    const chatParam = searchParams.get("chat");
    if (chatParam) {
      setSessionId(chatParam);
      fetchChat(chatParam);
    }
  }, [searchParams]);

  const fetchChat = async (chatId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/chat/${chatId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to fetch chat:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    // If new chat, generate UUID and update URL
    let newSessionId = sessionId;
    if (!sessionId) {
      newSessionId = uuidv4();
      setSessionId(newSessionId);
      navigate("/?chat=" + newSessionId);
    }

    const formData = new FormData();
    formData.append("text", input);
    if (file) formData.append("file", file);
    formData.append("session_id", newSessionId);

    const userMessage = {
      sender: "user",
      text: input,
      file: file || null,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFile(null);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: data.response || "",
        plot: data.plot || null,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6 h-screen">
      {/* Chat messages */}
      <div
        className="flex-1 overflow-y-auto space-y-4 p-2 flex flex-col justify-center"
        style={{ justifyContent: messages.length === 0 ? "center" : "flex-start" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-xl shadow-sm max-w-[70%] w-auto whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.sender === "bot" ? (
                <>
                  <ReactMarkdown
                    rehypePlugins={[
                      rehypeHighlight,
                      [
                        rehypeAddClasses,
                        {
                          table: "table-auto border-collapse border border-gray-500 w-full min-w-[400px] overflow-x-auto",
                          th: "border border-gray-500 px-4 py-2 text-left bg-gray-700 text-white font-semibold",
                          td: "border border-gray-500 px-4 py-2 text-left",
                          "tr:nth-child(even)": "bg-gray-800",
                          "tr:nth-child(odd)": "bg-gray-900",
                          code: "overflow-x-auto bg-gray-800 p-1 rounded",
                        },
                      ],
                    ]}
                    remarkPlugins={[remarkGfm]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  {msg.plot && (
                    <img
                      src={msg.plot}
                      alt="Generated chart"
                      className="mt-4 rounded-lg border border-gray-600 max-h-80 object-contain"
                    />
                  )}
                </>
              ) : (
                <>
                  <div>{msg.text}</div>
                  {msg.file && (
                    <div className="mt-2 flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md border border-gray-600 w-fit">
                      <FiFileText className="text-gray-300" />
                      <span className="text-gray-200 text-sm">{msg.file.name}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 italic animate-pulse">Analyst is thinking…</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section always at bottom */}
      <div className="mt-4 flex gap-2 items-center">
        <label className="flex items-center px-3 py-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <FiPaperclip size={20} className="text-gray-300" />
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected && selected.type === "text/csv") {
                setFile(selected);
              } else if (selected) {
                alert("Only CSV files are allowed.");
                e.target.value = null;
                setFile(null);
              }
            }}
          />
        </label>

        {file && (
          <span className="text-gray-300 text-sm flex items-center gap-2">
            {file.name}
            <button
              onClick={() => setFile(null)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </span>
        )}

        <input
          className="flex-1 p-3 border border-gray-600 rounded-xl shadow-inner bg-gray-700 text-gray-100 focus:outline-none"
          placeholder="Ask something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
}

