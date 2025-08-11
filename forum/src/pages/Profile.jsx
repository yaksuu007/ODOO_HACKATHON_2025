import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null); // User data from backend
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, check if user is logged in
          fetch("http://localhost:5001/api/user", {
      credentials: "include", // send cookies
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not logged in");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err) => {
        setUser(null);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
              const res = await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        navigate("/login"); // Redirect to login page after logout
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      alert("Logout failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p>You are not logged in.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {user.profile_image ? (
        <img
          src={user.profile_image}
          alt={user.fullname}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center text-gray-600">
          No Image
        </div>
      )}
      <p>
        <strong>Name:</strong> {user.fullname}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.contact_number}
      </p>
      <p>
        <strong>Designation:</strong> {user.designation}
      </p>
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
