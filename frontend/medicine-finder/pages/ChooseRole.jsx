import { useNavigate } from "react-router-dom";

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Continue as
        </p>

        <button
          onClick={() => navigate("/register/user")}
          className="w-full bg-green-600 text-white py-3 rounded-lg mb-4 hover:bg-green-700"
        >
          👤 User
        </button>

        <button
          onClick={() => navigate("/register/pharmacy")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          🏥 Pharmacy Owner
        </button>

      </div>
    </div>
  );
};

export default ChooseRole;