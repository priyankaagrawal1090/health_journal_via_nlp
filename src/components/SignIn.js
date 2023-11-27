import React, { useState } from "react";
import "../App.css";

export default function SignIn() {
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="auth-form">
        <h2>Sign in to Health Journal</h2>
        <form onSubmit={handleSubmit}>
          <label for="user">
            Username:
            <input
              value={User}
              onChange={(e) => setUser(e.target.value)}
              type="text"
            ></input>
          </label>
          <label for="password">
            Password:
            <input
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            ></input>
          </label>
        </form>
        <button onClick={handleSubmit}>Sign In</button>
      </div>
    </div>
  );
}
