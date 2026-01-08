import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("history/");
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteChat = async (chatId) => {
    setDeleting(chatId);
    try {
      await axios.delete(`history/${chatId}/`);
      setHistory((prev) => prev.filter((c) => c.id !== chatId));
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeleting(null);
    }
  };

  const deleteAllChats = async () => {
    setDeletingAll(true);
    try {
      await axios.delete("history/delete_all/");
      setHistory([]);
    } catch (err) {
      console.error("Delete ALL error", err);
    } finally {
      setDeletingAll(false);
    }
  };

  // Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          📜 Chat History
        </h3>

        {history.length > 0 && (
          <button
            onClick={deleteAllChats}
            disabled={deletingAll}
            className={`px-4 py-2 rounded-lg text-white transition ${
              deletingAll
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deletingAll ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {/* No History */}
      {history.length === 0 ? (
        <p className="text-gray-500 text-center">No chat history found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-start border border-gray-200"
            >
              <div>
                <strong className="text-lg font-semibold">
                  💬 {item.character}
                </strong>
                <br />
                <span className="text-gray-500 text-sm">
                  {new Date(item.timestamp).toLocaleString()}
                </span>

                <p className="mt-2 text-gray-800">{item.message}</p>
              </div>

              <button
                onClick={() => deleteChat(item.id)}
                disabled={deleting === item.id}
                className={`px-3 py-1 rounded-md text-white text-sm transition ${
                  deleting === item.id
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting === item.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
