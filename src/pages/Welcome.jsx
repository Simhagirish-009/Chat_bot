import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold tracking-wide text-white">
          Bittu AI
        </Link>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-2xl bg-slate-950/70 backdrop-blur-xl border-slate-800 shadow-xl">
          <CardContent className="p-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Hi There!
              <br />
              <span className="text-indigo-400">Nenu Mee Bittu</span>
            </h1>

            <p className="text-slate-300 text-lg mb-8">
              Your intelligent AI companion is ready to chat.
              <br className="hidden md:block" />
              Register now to get started.
            </p>

            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/login">Login</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Welcome;
