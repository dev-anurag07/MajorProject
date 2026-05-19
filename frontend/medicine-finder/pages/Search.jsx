import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";

const Search = () => {
    
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const name = query.get("name");






  
const handleAddToCart = (item) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  // if pharmacy doesn't exist → create
  if (!cart[item.pharmacyId]) {
    cart[item.pharmacyId] = [];
  }

  const index = cart[item.pharmacyId].findIndex(
    (i) => i.inventoryId === item.inventoryId
  );

  if (index !== -1) {
    cart[item.pharmacyId][index].quantity += 1;
  } else {
    cart[item.pharmacyId].push({
      inventoryId: item.inventoryId,
      medicineName: item.medicineName,
      price: item.price,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
};





 useEffect(() => {
  if (!name) return;
   console.log("Trying to get location...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        const res = await API.get(
          `/user/nearby?lat=${lat}&lang=${lng}&medicine=${name}&radius=5000`
        );

        console.log("API RESPONSE:", res.data); // 👈 ADD THIS

        setData(res.data.data); // 👈 VERY IMPORTANT
      } catch (error) {
        console.log(error);
      }
    },
    () => {
      alert("Allow location");
    }
  );
}, [name]);







  return (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">
      {name} available at:
    </h2>

    {loading ? (
      <p>Loading...</p>
    ) : data.length === 0 ? (
      <p>No medicines found nearby</p>
    ) : (
      <div className="grid gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow flex justify-between items-center"
          >
            {/* LEFT SIDE */}
            <div>
              <h3 className="font-semibold text-lg">
                {item.medicineName}
              </h3>

              <p className="text-gray-600">
                {item.pharmacyName}
              </p>

              <p className="text-sm text-gray-500">
                {item.distance_km.toFixed(2)} km away
              </p>

              <p className="text-green-600 font-bold text-lg">
                ₹{item.price}
              </p>
            </div>

            {/* RIGHT SIDE */}
            <button
              onClick={() => handleAddToCart(item)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default Search;