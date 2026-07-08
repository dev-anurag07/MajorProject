import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const BusinessProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    licenseNumber: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isprofilecreated, setisprofilecreated] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

 useEffect(() => {
  if (location.state?.lat) {
    setForm((prev) => ({
      ...prev,
   
      latitude: location.state.lat,
      longitude: location.state.lng,
    }));
  }
}, [location.state]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/pharmacy/profile");

      const pharmacy = res.data.data;

      if (pharmacy){
        setisprofilecreated(true);
      }

      setForm({
        name: pharmacy.name || "",
        phoneNumber: pharmacy.phoneNumber || "",
        licenseNumber: pharmacy.licenseNumber || "",
        address:pharmacy.address||"",
        latitude: pharmacy.address?.location?.coordinates?.[1] || "",
        longitude: pharmacy.address?.location?.coordinates?.[0] || "",
      });

      setPreview(pharmacy.image || "");
    } catch (err) {}
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
    formData.append("licenseNumber", form.licenseNumber);
    formData.append("address", form.address);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);

    if (image) {
      formData.append("image", image);
    }

    try {
      if (isprofilecreated) {
        await API.put("/pharmacy/profile", formData);
      } else {
        await API.post("/pharmacy/register", formData);
      }

      toast.success("Business Profile Saved");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >

        <h2 className="text-2xl font-bold text-center mb-5">
          Business Profile
        </h2>

        {preview && (
          <img
            src={preview}
            className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
            alt=""
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
          placeholder="Pharmacy Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="text"
          name="licenseNumber"
          placeholder="License Number"
          value={form.licenseNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <input
  type="text"
  name="address"
  placeholder="Business Address"
  value={form.address}
  onChange={handleChange}
  className="w-full border p-2 rounded mb-3"
/>

        <button
          type="button"
          onClick={() => navigate("/map-picker",{
            state:{
              from:"business-profile"},
            
          })
        }
          className="w-full bg-blue-600 text-white py-2 rounded mb-3"
        >
          📍 Choose Pharmacy Location
        </button>

       {form.latitude && (
  <div className="bg-gray-100 p-3 rounded mb-3 text-sm">
<p> Location selected successfully</p>
  </div>
)}

        <button
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Save Business Profile
        </button>

      </form>
    </div>
  );
};

export default BusinessProfile;