import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    
    const res = await API.post("/user/register", form);

    toast.success(res.data.message);

    navigate("/login");
  } catch (error) {
    console.log(error.response);
    const message =
      error.response?.data?.message || "Registration Failed";

    toast.error(message);
  }
};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
  <div className="flex justify-center items-center h-screen">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-80"
    >
      <h2 className="text-2xl font-bold text-center mb-4">
        Register
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full border rounded p-2 mb-3"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border rounded p-2 mb-3"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full border rounded p-2 mb-3"
      />

      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleChange}
        className="w-full border rounded p-2 mb-3"
      />

      <select
        name="role"
        onChange={handleChange}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="user">User</option>
        <option value="pharmacy">Pharmacy</option>
      </select>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>
    </form>
  </div>
);
}

export default Register;