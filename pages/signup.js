// project/pages/signup.js
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function SignUp() {
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ✅ Check if username or email already exists in profiles table
    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .or(`username.eq.${formData.username},email.eq.${formData.email}`);

    if (checkError) {
      setMessage("Error checking existing users: " + checkError.message);
      return;
    }
    if (existing.length > 0) {
      setMessage("Username or Email already exists.");
      return;
    }

    // ✅ Sign up user with Supabase Auth (sends email verification)
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: crypto.randomUUID(), // temp password since we only need email verification
    });

    if (error) {
      setMessage("Error signing up: " + error.message);
      return;
    }

    // ✅ Insert into profiles table
    const { error: insertError } = await supabase.from("profiles").insert([
      { username: formData.username, email: formData.email },
    ]);

    if (insertError) {
      setMessage("Error saving profile: " + insertError.message);
      return;
    }

    setMessage("Sign-up successful! Check your email for verification.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-black text-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl mb-4 text-center">Sign Up</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Sign Up
        </button>
        {message && <p className="mt-3 text-center">{message}</p>}
      </form>
    </div>
  );
}
