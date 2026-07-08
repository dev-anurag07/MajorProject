import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [hasBusiness, setHasBusiness] = useState(false);

  useEffect(() => {
    fetchProfile();
    checkBusinessProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/profile");
      setUser(res.data.data);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const checkBusinessProfile = async () => {
    try {
      const res = await API.get("/pharmacy/profile");
console.log(res);
      if (res.data.data) {
        setHasBusiness(true);
      }
    } catch (error) {
      setHasBusiness(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-3xl font-bold text-center mb-6">
          Owner Profile
        </h2>

        <div className="flex justify-center mb-5">
          <img
            src={
              user.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="owner"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <div className="space-y-4">

          <div>
            <p className="text-gray-500">Name</p>
            <h3 className="font-semibold text-lg">
              {user.name}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <h3 className="font-semibold text-lg">
              {user.email}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Phone Number</p>
            <h3 className="font-semibold text-lg">
              {user.phoneNumber}
            </h3>
          </div>

        </div>

        <hr className="my-6" />

        <h2 className="text-2xl font-bold mb-2">
          Business Profile
        </h2>

        {!hasBusiness ? (
          <>
            <p className="text-red-600 mb-4">
              Your pharmacy business profile is not completed.
            </p>

            <button
              onClick={() =>
                navigate("/pharmacy/business-profile")
              }
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Complete Business Profile
            </button>
          </>
        ) : (
          <>
            <p className="text-green-600 mb-4">
              Business Profile Completed
            </p>

            <button
              onClick={() =>
                navigate("/pharmacy/business-profile")
              }
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Edit Business Profile
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default Profile;