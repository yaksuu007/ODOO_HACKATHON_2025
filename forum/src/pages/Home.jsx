import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home container mt-10 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Sports Venues Booking</h1>
      <p className="mb-6 text-lg">Find and book your favorite sports courts with ease.</p>
      <button
        className="btn px-6 py-3 text-xl"
        onClick={() => navigate("/auth")}
      >
        Get Started
      </button>
    </div>
  );
}
