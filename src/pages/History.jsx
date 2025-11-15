import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button, Spinner } from "react-bootstrap";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  // Fetch chat history for logged-in user
  const fetchHistory = async () => {
    try {
      const res = await axios.get("history/"); // backend returns only user's chats
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

  // DELETE ALL chat history
  const deleteAllChats = async () => {
    setDeletingAll(true);
    try {
      await axios.delete("history/delete_all/");
      setHistory([]); // Clear UI
    } catch (err) {
      console.error("Delete ALL error", err);
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📜 Chat History</h3>

        {history.length > 0 && (
          <Button
            variant="danger"
            onClick={deleteAllChats}
            disabled={deletingAll}
          >
            {deletingAll ? "Deleting..." : "Delete All"}
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-muted">No chat history found.</p>
      ) : (
        <div className="list-group">
          {history.map((item) => (
            <div
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>{item.character}</strong>
                <br />
                <span className="text-muted small">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <p className="mt-2 mb-1">{item.message}</p>
              </div>

              <Button
                variant="danger"
                size="sm"
                disabled={deleting === item.id}
                onClick={() => deleteChat(item.id)}
              >
                {deleting === item.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
