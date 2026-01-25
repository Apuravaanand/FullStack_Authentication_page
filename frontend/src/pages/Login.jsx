import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser(form);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      navigate("/dashboard");
    } catch (err) {
      // show real backend error if exists
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setMessage(errorMsg);
      console.error("Login Error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-md mx-auto bg-white rounded shadow space-y-4 mt-10"
    >
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      {message && <p className="text-red-500 text-center mt-2">{message}</p>}


      {/* Optional: Register Link */}
      <p className="text-center mt-2 text-sm">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => navigate("/")}
        >
          Register
        </button>
      </p>
    </form>
  );
}
