import { useNavigate } from "react-router-dom";

const ProfileBanner = ({ message, buttonText, path }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-xl p-4 mb-6 flex justify-between items-center">
      <div>
        <h2 className="font-bold text-yellow-800">
          Complete Your Profile
        </h2>

        <p className="text-yellow-700">
          {message}
        </p>
      </div>

      <button
        onClick={() => navigate(path)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ProfileBanner;