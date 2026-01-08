import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import MessageBubble from "../components/MessageBubble";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const scrollToBottom = () =>
    endRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("chat/", { message: input });
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

  return (
    <div className="w-full h-[85vh] flex flex-col bg-gray-100">
      {/* Chat Box */}
      <div className="grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">👋 Start chatting with your AI assistant!</p>
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
        className="bg-white p-4 flex items-center gap-3 shadow-lg"
      >
        <textarea
          rows={1}
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="text-black grow resize-none px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-full text-white font-semibold transition
            ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
}
