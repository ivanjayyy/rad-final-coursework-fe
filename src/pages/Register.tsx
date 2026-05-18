import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../service/auth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  // useNavigate
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password || !conPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== conPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const data = await register(username, email, password);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={conPassword}
        onChange={(e) => setConPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
