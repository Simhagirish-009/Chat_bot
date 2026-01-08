import { useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Brand */}
      <div
        className="text-2xl font-bold flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        AI ChatBot 🤖
      </div>

      {/* Auth Navigation */}
      {!isAuth ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition"
          >
            Register
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-10">
          <button
            onClick={() => navigate("/chat")}
            className="hover:text-blue-400 transition"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/characters")}
            className="hover:text-blue-400 transition"
          >
            Chat with Characters
          </button>

          <button
            onClick={() => navigate("/history")}
            className="hover:text-blue-400 transition"
          >
            History
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
