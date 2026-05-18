import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDetails, login } from "../service/auth";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const data = await login(username, password);

      if (data?.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        const responseData = await getMyDetails();
        const userData = responseData?.data;
        setUser(userData);

        alert("Login successful!");
        navigate("/home");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
