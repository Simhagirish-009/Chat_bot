import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { ToastContainer, toast } from "react-toastify";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      localStorage.clear();
      const res = await API.post("login/", form);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", res.data.username);

      // ✅ Success Toast
      toast.success("Login Successful !!!");

      // Small delay so toast is visible before navigation
     setTimeout(() => {
        navigate("/chat");
      }, 2000);
      
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen body flex items-center justify-center ">
      <Card className="w-full max-w-lg bg-slate-950/60  border-slate-800 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-indigo-50 text-3xl font-extrabold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Login to continue your AI journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              placeholder="Username"
              required
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <Input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button type="submit" size="lg" className="w-full bg-blue-900">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
      <ToastContainer/>
    </div>
  );
}

export default Login;
