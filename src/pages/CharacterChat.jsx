import { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import MessageBubble from "../components/MessageBubble";

export default function CharacterChat() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const character = state?.character;

  // If user navigates directly without selecting
  if (!character) {
    navigate("/");
    return null;
  }

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

  // 🎨 Character theme styling
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

  const styles = {
    wrapper: {
      position: "relative",
      height: "100vh",
      width: "100%",
      background: `linear-gradient(180deg, ${bgColor}aa, #fff8e5)`,
      overflow: "hidden",
    },
    chatArea: {
      position: "relative",
      zIndex: 2,
      height: "90%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    chatBox: {
      flexGrow: 1,
      overflowY: "auto",
      padding: "1.5rem",
    },
    inputArea: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderTop: `3px solid ${bgColor}`,
      backdropFilter: "blur(6px)",
    },
    bgImg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      opacity: 0.15,
      zIndex: 0,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.wrapper}
    >
      <img src={character.img} alt={character.name} style={styles.bgImg} />

      <Container fluid className="p-0" style={styles.chatArea}>
        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <div className="text-center text-dark mt-5">
              <h4>💬 Start chatting with {character.name}!</h4>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} message={msg.message} />
          ))}
          <div ref={endRef}></div>
        </div>

        <Form
          onSubmit={sendMessage}
          className="d-flex p-3 shadow-lg"
          style={styles.inputArea}
        >
          <Form.Control
            as="textarea"
            rows={1}
            placeholder={`Talk to ${character.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // stop newline
                sendMessage(e); // send the message
              }
            }}
            disabled={loading}
            className="px-3 py-2"
            style={{ borderRadius: "20px", resize: "none" }}
          />

          <Button
            type="submit"
            className="rounded-pill ms-2 px-4 fw-bold"
            style={{
              backgroundColor: bgColor,
              border: "none",
              color: "#fff",
            }}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Send"}
          </Button>
        </Form>
      </Container>
    </motion.div>
  );
}
