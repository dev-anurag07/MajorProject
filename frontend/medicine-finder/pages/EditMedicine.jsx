import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const EditMedicine = () => {
  const { medicineId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    manufacturer: "",
    category: "",
    price: "",
    stockQuantity: "",
    isAvailable: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchMedicine();
  }, []);

  const fetchMedicine = async () => {
    try {
        console.log(medicineId);
      const res = await API.get(`/inventory/medicine/${medicineId}`);

      const medicine = res.data.data;

      setForm({
        manufacturer: medicine.manufacturer,
        category: medicine.category,
        price: medicine.price,
        stockQuantity: medicine.stockQuantity,
        isAvailable: medicine.isAvailable,
      });

      setPreview(medicine.image);
    } catch (error) {
      toast.error("Failed to load medicine");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("manufacturer", form.manufacturer);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("stockQuantity", form.stockQuantity);
    formData.append("isAvailable", form.isAvailable);

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.put(
        `/inventory/update/${medicineId}`,
        formData
      );

      toast.success("Medicine updated successfully");

      navigate("/inventory");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">
          Edit Medicine
        </h2>

        {preview && (
          <img
            src={preview}
            alt="medicine"
            className="w-32 h-32 object-cover rounded-lg border mx-auto mb-4"
          />
        )}

        <input
          type="text"
          name="manufacturer"
          value={form.manufacturer}
          onChange={handleChange}
          placeholder="Manufacturer"
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="number"
          name="stockQuantity"
          value={form.stockQuantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="w-full border p-2 rounded mb-3"
        />

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>

        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Update Medicine
        </button>
      </form>
    </div>
  );
};

export default EditMedicine;