import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddInventory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  medicineName: "",
  manufacturer: "",
  price: "",
  stockQuantity: "",
  category: "",
  expiryDate: "",
  isAvailable: true,
});



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/inventory/add", form);

      toast.success("Medicine added successfully");

      navigate("/pharmacy/dashboard"); // go back
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding medicine");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Add Medicine
        </h2>

        <input
          type="text"
          name="medicineName"
          placeholder="Medicine Name"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />
<input
  type="text"
  name="manufacturer"
  placeholder="Manufacturer"
  className="w-full mb-3 p-2 border rounded"
  onChange={handleChange}
/>

<input
  type="text"
  name="category"
  placeholder="Category (e.g. tablet)"
  className="w-full mb-3 p-2 border rounded"
  onChange={handleChange}
/>

<input
  type="date"
  name="expiryDate"
  className="w-full mb-3 p-2 border rounded"
  onChange={handleChange}
/>



        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
        />

        <label className="flex items-center mb-3">
  <input
    type="checkbox"
    name="isAvailable"
    checked={form.isAvailable}
    onChange={(e) =>
      setForm({ ...form, isAvailable: e.target.checked })
    }
  />
  <span className="ml-2">Available</span>
</label>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddInventory;