import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

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
        image:medicine.image,
        price: medicine.price,
        pharmacyName: pharmacy.name,
    
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));

    toast.success("Medicine added to cart");
  };

  if(!pharmacy){
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin height={70} width={70} color="#16a34a"/>
      </div>
    )
  }

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
      className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition p-5"
    >
      <div className="flex items-center gap-6">

        <img
          src={item.image}
          alt={item.medicineName}
          className="w-28 h-28 rounded-xl object-cover border"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {item.medicineName}
          </h2>

          <p className="text-gray-500 mt-1">
            {item.manufacturer}
          </p>

          <div className="flex items-center gap-6 mt-4">
            <span className="text-2xl font-bold text-green-600">
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
              {item.isAvailable ? "🟢 Available" : "🔴 Out of Stock"}
            </span>
          </div>
        </div>

        <button
          onClick={() => addToCart(item)}
          disabled={!item.isAvailable}
          className={`px-6 py-3 rounded-lg font-semibold ${
            item.isAvailable
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          🛒 Add To Cart
        </button>

      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default PharmacyDetails;