import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/profile");
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <h2 className="p-6">Loading...</h2>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-6">

        <div className="flex items-center gap-5">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${user.Name}`
            }
            alt="avatar"
            className="w-24 h-24 rounded-full"
          />

          <div>
            <h1 className="text-3xl font-bold">{user.Name}</h1>
            <p>{user.email}</p>
            <p>{user.phoneNumber}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-3">
          Saved Addresses
        </h2>

        {user.addresses.map((address, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 mb-3"
          >
            <h3 className="font-semibold">{address.label}</h3>
            <p>{address.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;