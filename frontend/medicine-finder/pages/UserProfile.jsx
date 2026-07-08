import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/profile");
console.log(res.data.data);
      setForm({
        name: res.data.data.name,
        email: res.data.data.email,
        phoneNumber: res.data.data.phoneNumber || "",
      });

      setPreview(res.data.data.image);
    } catch (error) {
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

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.put("/user/profile", formData);

      toast.success("Profile Updated");
    } catch (error) {
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
          User Profile
        </h2>

        {preview && (
          <img
            src={preview}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border mx-auto mb-4"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="email"
          value={form.email}
          disabled
          className="w-full border p-2 rounded mb-3 bg-gray-100"
        />

        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;