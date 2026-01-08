export default function MessageBubble({ sender, message }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-2xl shadow 
          ${isUser ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
        style={{ maxWidth: "70%", whiteSpace: "pre-wrap" }}
      >
        {message}
      </div>
    </div>
  );
}
