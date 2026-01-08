import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import MessageBubble from "../components/MessageBubble";

export default function CharacterChat() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const character = state?.character;

  if (!character) {
    navigate("/");
    return null;
  }

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("chat/", {
        message: input,
        character: character.name,
      });
      const botMsg = { sender: "bot", message: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: "⚠️ Error: could not connect to AI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Character gradient
  const themeColors = {
    orange: "#FF8700",
    blue: "#1E90FF",
    gray: "#6c757d",
    green: "#2ecc71",
    red: "#e74c3c",
    teal: "#1abc9c",
    purple: "#9b59b6",
    maroon: "#800000",
  };

  const bgColor = themeColors[character.theme] || "#FF8700";

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${bgColor}bb, #fff8e5)`,
      }}
    >
      {/* Background image */}
      <img
        src={character.img}
        alt={character.name}
        className="absolute inset-0 w-full h-full object-contain opacity-20"
      />

      {/* Chat Area */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="text-center text-black mt-10">
              <h3 className="text-xl font-semibold">
                💬 Start chatting with {character.name}!
              </h3>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} message={msg.message} />
          ))}
          <div ref={endRef}></div>
        </div>

        {/* Input Box */}
        <form
          onSubmit={sendMessage}
          className="p-4 flex gap-3 backdrop-blur-md border-t"
          style={{
            borderColor: bgColor,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            disabled={loading}
            rows={1}
            style={{color : bgColor}}
            placeholder={`Talk to ${character.name}...`}
            className="flex-1 p-3 rounded-2xl border resize-none focus:outline-none shadow-sm"
          />

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: bgColor }}
            className="px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
