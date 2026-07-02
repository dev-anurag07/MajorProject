import { useNavigate } from "react-router-dom";

const PharmacyCard = ({ pharmacy }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Top */}
      <div className="bg-green-50 p-5 border-b">

        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
              🏥 {pharmacy.pharmacyName}
            </h2>

            <p className="text-gray-600 text-xl mt-2 flex items-center gap-2">
              💊 {pharmacy.medicineName}
            </p>

          </div>

          <div className="text-right">

            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
              ⭐ {pharmacy.rating || "4.5"}
            </span>

          </div>

        </div>

      </div>

     
      <div className="p-5">

        <div className="flex justify-between items-center mb-4">

          <div>

            <p className="text-gray-500 text-sm">
              Distance
            </p>

            <h3 className="font-bold text-lg">
              📍 {pharmacy.distance_km.toFixed(2)} km
            </h3>

          </div>

          <div className="text-right">

            <p className="text-gray-500 text-sm">
              Price
            </p>

            <h2 className="text-3xl font-bold text-green-700">
              ₹{pharmacy.price}
            </h2>

          </div>

        </div>

        <div className="flex justify-between items-center">

          <span
            className={`px-4 py-2 rounded-full font-semibold ${
              pharmacy.stockQuantity > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {pharmacy.stockQuantity > 0
              ? "🟢 In Stock"
              : "🔴 Out of Stock"}
          </span>

          <button
            onClick={() =>
              navigate(`/pharmacy/${pharmacy.pharmacyId}`)
            }
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            View Details →
          </button>

        </div>

      </div>

    </div>
  );
};

export default PharmacyCard;