import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import ChatPage from "./ChatPage";
import Notebook from "./Notebook";
import { FaHome, FaBook } from "react-icons/fa";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-gray-100">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            {/* Chat page can accept a sessionId query param */}
            <Route path="/" element={<ChatPageWrapper />} />
            <Route path="/notebook" element={<NotebookPageWrapper />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

/* Sidebar component */
function Sidebar() {
  return (
    <div className="w-1/5 bg-gray-800 text-white p-6 flex flex-col items-center h-screen">
      <div className="mb-8">
        <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
      </div>

      <nav className="flex flex-col gap-3 w-full">
        <NavLink to="/" icon={FaHome} label="Chat" />
        <NavLink to="/notebook" icon={FaBook} label="Notebooks" />
      </nav>

      <div className="mt-auto flex items-center gap-3 px-4 py-3 w-full bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
        <img src="/default-user.png" alt="User" className="w-10 h-10 rounded-full object-cover" />
        <span className="text-white font-medium">John Doe</span>
      </div>
    </div>
  );
}

/* Sidebar link helper */
function NavLink({ to, icon: Icon, label }) {
  return (
    <a
      href={to}
      className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-gray-700 transition-colors"
    >
      <Icon size={20} /> {label}
    </a>
  );
}

/* Wrapper for ChatPage to read sessionId from query */
function ChatPageWrapper() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("chat") || "new";

  return <ChatPage initialSessionId={sessionId} />;
}

/* Wrapper for Notebook to handle navigation */
function NotebookPageWrapper() {
  const navigate = useNavigate();

  return (
    <Notebook
      onOpenChat={(sessionId) => navigate("/?chat=" + sessionId)}
      onNewChat={(sessionId) => navigate("/?chat=" + sessionId)}
    />
  );
}


