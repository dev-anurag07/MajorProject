import { useNavigate } from "react-router-dom";

const PharmacyCard = ({ pharmacy }) => {
  const navigate = useNavigate();

  return (
  <div className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition overflow-hidden">

    <div className="flex p-5 gap-5">

      <img
        src={pharmacy.image}
        alt={pharmacy.medicineName}
        className="w-32 h-32 object-cover rounded-xl border"
      />

      <div className="flex-1">

        <div className="flex justify-between items-start">

          <div>
            <h2 className="text-2xl font-bold text-green-700">
              🏥 {pharmacy.pharmacyName}
            </h2>

            <p className="text-gray-600 text-lg mt-2">
              💊 {pharmacy.medicineName}
            </p>

            <p className="text-gray-700 mt-2 ">
              📍 {pharmacy.distance_km.toFixed(2)} km away
            </p>

            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  pharmacy.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {pharmacy.isAvailable ? "🟢 In Stock" : "🔴 Out of Stock"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
              ⭐ {pharmacy.rating || "4.5"}
            </div>

            <h2 className="text-3xl font-bold text-green-600 mt-6">
              ₹{pharmacy.price}
            </h2>

            <button
              onClick={() => navigate(`/pharmacy/${pharmacy.pharmacyId}`)}
              className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              View Details →
            </button>
          </div>

        </div>

      </div>

    </div>

  </div>
);
};

export default PharmacyCard;