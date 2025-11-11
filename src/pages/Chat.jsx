import { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "../api/axios";
import MessageBubble from "../components/MessageBubble";
import "../styles/Chat.css"; // 👈 add a new CSS file

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="chat-wrapper"
    >
      <Container fluid className="d-flex flex-column vh-100 p-0 chat-container">
        {/* Chat Messages Area */}
        <div className="chat-box flex-grow-1 overflow-auto p-4">
          {messages.length === 0 && (
            <div className="text-center text-muted mt-5">
              <p className="lead">👋 Start chatting with your AI assistant!</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} message={msg.message} />
          ))}
          <div ref={endRef}></div>
        </div>

        {/* Input Area */}
        <Form
          onSubmit={sendMessage}
          className="chat-input d-flex p-3 bg-white shadow-sm"
        >
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="rounded-pill px-3 py-2"
          />
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill ms-2 px-4"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Send"}
          </Button>
        </Form>
      </Container>
    </motion.div>
  );
}
