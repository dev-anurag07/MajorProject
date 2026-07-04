import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const PharmacyProfile = () => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/pharmacy/profile");

      setForm({
        name: res.data.data.name || "",
        phoneNumber: res.data.data.phoneNumber || "",
        address: res.data.data.address || "",
      });

      setPreview(res.data.data.image || "");
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("address", form.address);

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.put("/pharmacy/profile", formData);

      toast.success("Profile Updated");
      fetchProfile();
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-5">
          Pharmacy Profile
        </h2>

        {preview && (
          <img
            src={preview}
            alt="profile"
            className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
          />
        )}

        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
          className="mb-4"
        />

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Pharmacy Name"
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2 rounded mb-4"
        />

        <button
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default PharmacyProfile;