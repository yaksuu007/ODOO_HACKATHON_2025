import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    contact_number: "",
    designation: "player",
    profile_image: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setFormData({ ...formData, profile_image: files[0] }); // Save the file object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // We will send data differently if there's a file (multipart/form-data)
    const endpoint = isLogin ? "http://localhost:5000/api/login" : "http://localhost:5000/api/register";

    try {
      let response;
      if (formData.profile_image) {
        // Use FormData if image is included
        const formPayload = new FormData();
        formPayload.append("fullname", formData.fullname);
        formPayload.append("email", formData.email);
        formPayload.append("password", formData.password);
        formPayload.append("contact_number", formData.contact_number);
        formPayload.append("designation", formData.designation);
        formPayload.append("profile_image", formData.profile_image);

        response = await fetch(endpoint, {
          method: "POST",
          credentials: "include",
          body: formPayload,
        });
      } else {
        // Regular JSON for login or sign up without image
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      console.log(data.message);
      navigate("/profile");
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  onChange={handleChange}
                  value={formData.fullname}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  onChange={handleChange}
                  value={formData.contact_number}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="1234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="designation"
                      value="player"
                      checked={formData.designation === "player"}
                      onChange={handleChange}
                    />
                    Player
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="designation"
                      value="facilities"
                      checked={formData.designation === "facilities"}
                      onChange={handleChange}
                    />
                    Facility Owner
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
