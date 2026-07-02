import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const PharmacyDetails = () => {
  const { id } = useParams();

  const [pharmacy, setpharmacy] = useState(null);
  const [inventory, setinventory] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await API.get(`user/getpharmacydetails/${id}`);

      setpharmacy(res.data.data.pharmacy);
      setinventory(res.data.data.inventory);
    };

    fetchDetails();
  }, [id]);

  const addToCart = (medicine) => {
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || {};

    const pharmacyId = pharmacy._id;

    if (!storedCart[pharmacyId]) {
      storedCart[pharmacyId] = [];
    }

    const existing = storedCart[pharmacyId].find(
      (item) => item.inventoryId === medicine._id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      storedCart[pharmacyId].push({
        inventoryId: medicine._id,
        medicineName: medicine.medicineName,
        quantity: 1,
        price: medicine.price,
        pharmacyName: pharmacy.name,
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));

    toast.success("Medicine added to cart");
  };

  if (!pharmacy) return <p>Loading...</p>;

  return (
    <div className="p-6">
     <div className="bg-white shadow rounded-xl p-6 mb-6">
  <h1 className="text-3xl font-bold text-green-700">
    {pharmacy.name}
  </h1>

  <div className="grid md:grid-cols-2 gap-3 mt-4 text-gray-700">
    <p>📍 {pharmacy.address}</p>
    <p>📞 {pharmacy.phoneNumber}</p>
    <p>🪪 {pharmacy.licenseNumber}</p>
    <p>⭐ {pharmacy.rating || 4.5}</p>
  </div>
</div>

     <div className="grid gap-5 mt-6">
  {inventory.map((item) => (
    <div
      key={item._id}
      className="bg-white rounded-xl shadow-md border hover:shadow-xl transition-all p-5 flex justify-between items-center"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {item.medicineName}
        </h2>

        <p className="text-gray-500 mt-1">
          {item.manufacturer}
        </p>

        <div className="flex gap-6 mt-4">
          <span className="text-green-700 font-bold text-lg">
            ₹{item.price}
          </span>

          <span className="text-gray-600">
            Stock:
            <span className="font-semibold ml-1">
              {item.stockQuantity}
            </span>
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              item.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.isAvailable ? "Available" : "Out of Stock"}
          </span>
        </div>
      </div>

      <button
        onClick={() => addToCart(item)}
        disabled={!item.isAvailable}
        className={`px-6 py-3 rounded-lg font-semibold transition ${
          item.isAvailable
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        🛒 Add To Cart
      </button>
    </div>
  ))}
</div>
    </div>
  );
};

export default PharmacyDetails;