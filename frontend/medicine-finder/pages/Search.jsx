import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const Search = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const name = query.get("name");

  const handleAddToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

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
        quantity: 1,
        pharmacyName: item.pharmacyName,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  useEffect(() => {
    if (!name) return;

    const searchMedicine = async () => {
      const selectedAddress = JSON.parse(
        localStorage.getItem("selectedAddress")
      );

      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      const lat = selectedAddress.location.coordinates[1];
      const lng = selectedAddress.location.coordinates[0];

      setLoading(true);

      try {
        const res = await API.get(
          `/user/nearby?lat=${lat}&lng=${lng}&medicine=${name}&radius=5000`
        );

        setData(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch nearby pharmacies");
      } finally {
        setLoading(false);
      }
    };

    searchMedicine();
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

              <button
                disabled={item.stockQuantity === 0}
                onClick={() => handleAddToCart(item)}
                className={`px-4 py-2 rounded text-white ${
                  item.stockQuantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {item.stockQuantity === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;