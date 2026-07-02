import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const PharmacyProfile = () => {
  const [profile, setProfile] = useState({
    name:"",
    phoneNumber:"",
    address:"",
    isOpen:false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/pharmacy/profile");
      setProfile(res.data.data);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const handleSave = async () => {
  try {
    const res = await API.put("/pharmacy/profile", profile);

    setProfile(res.data.data);

    toast.success("Profile updated successfully");
  } catch (error) {
    toast.error("Update failed");
  }
};

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
<div className="max-w-xl mx-auto p-6">
  <h2 className="text-2xl font-bold mb-6">
    Pharmacy Profile
  </h2>

  <div className="space-y-4">

    <input
      type="text"
      value={profile.name}
      onChange={(e) =>
        setProfile({ ...profile, name: e.target.value })
      }
      placeholder="Pharmacy Name"
      className="w-full border p-2 rounded"
    />

    <input
      type="text"
      value={profile.phoneNumber}
      onChange={(e) =>
        setProfile({ ...profile, phoneNumber: e.target.value })
      }
      placeholder="Phone Number"
      className="w-full border p-2 rounded"
    />

    <input
      type="text"
      value={profile.address}
      onChange={(e) =>
        setProfile({ ...profile, address: e.target.value })
      }
      placeholder="Address"
      className="w-full border p-2 rounded"
    />

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={profile.isOpen}
        onChange={(e) =>
          setProfile({
            ...profile,
            isOpen: e.target.checked,
          })
        }
      />
      Pharmacy Open
    </label>

    <button
      onClick={handleSave}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Save Changes
    </button>

  </div>
</div>
  );
};

export default PharmacyProfile;