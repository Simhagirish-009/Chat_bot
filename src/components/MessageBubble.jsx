import { motion } from "framer-motion";

export default function MessageBubble({ sender, message }) {
  const isUser = sender === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`d-flex ${
        isUser ? "justify-content-end" : "justify-content-start"
      } mb-2`}
    >
      <div
        className={`p-2 rounded-3 shadow-sm ${
          isUser ? "bg-primary text-white" : "bg-secondary text-light"
        }`}
        style={{ maxWidth: "70%" }}
      >
        {message}
      </div>
    </motion.div>
  );
}
