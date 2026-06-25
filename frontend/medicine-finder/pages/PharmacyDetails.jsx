import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

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

    alert("Medicine added to cart");
  };

  if (!pharmacy) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{pharmacy.name}</h1>

      <p>Address: {pharmacy.address}</p>
      <p>Phone: {pharmacy.phoneNumber}</p>
      <p>License: {pharmacy.licenseNumber}</p>

      <h2 className="text-xl font-semibold mt-4">
        Available Medicines
      </h2>

      {inventory.map((item) => (
        <div
          key={item._id}
          className="border p-3 rounded my-2"
        >
          <p>{item.medicineName}</p>
          <p>₹{item.price}</p>

          <button
            className="bg-green-600 text-white px-3 py-1 rounded mt-2"
            onClick={() => addToCart(item)}
          >
            Add To Cart
          </button>
        </div>
      ))}

      <button
        onClick={() => navigate("/cart")}
        className="bg-blue-600 text-white px-5 py-2 rounded mt-6"
      >
        Go To Cart
      </button>
    </div>
  );
};

export default PharmacyDetails;