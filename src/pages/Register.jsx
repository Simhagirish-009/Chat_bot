import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

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

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("register/", form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.password ||
          err.response?.data?.detail ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center body">
      <Card className="w-full max-w-md bg-slate-950/70  border-slate-800 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-indigo-200 text-3xl font-extrabold">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-400">
            Register to start chatting with Bittu AI
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              required
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <Input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />

            <Input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              required
              onChange={(e) => setForm({ ...form, password2: e.target.value })}
            />

            <Button type="submit" size="lg" className="w-full bg-blue-900 hover:bg-blue-500">
              Register
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
