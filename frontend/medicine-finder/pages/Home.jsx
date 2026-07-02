import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PharmacyCard from "../components/PharmacyCard";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();

  const selectedAddress = JSON.parse(
    localStorage.getItem("selectedAddress")
  );

  const [medicine, setMedicine] = useState("");
  const [sortBy, setsortBy] = useState("distance")
  const [results, setResults] = useState([]);

  useEffect(() => {
    checkAddress();
  }, []);

  const checkAddress = async () => {
    const selectedAddress = localStorage.getItem("selectedAddress");

    if (selectedAddress) return;

    try {
      const res = await API.get("/user/get-address");

      if (res.data.length === 0) {
        navigate("/select-address");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchMedicine = async () => {
    if (!medicine) {
      toast.error("Enter medicine name");
      return;
    }

    try {
      const response = await API.get("/user/nearby", {
        params: {
          medicine,
          lat: selectedAddress.location.coordinates[1],
          lang: selectedAddress.location.coordinates[0],
          radius:5000,
        },
      });

      setResults(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const popularMedicines = [
    "Paracetamol",
    "Crocin",
    "Dolo 650",
    "Cetirizine",
    "Aspirin",
    "Vitamin C",
  ];

  const sortedResults = [...results];


  if(sortBy ==='distance'){
    sortedResults.sort((a,b)=>a.distance_km - b.distance_km);
  }

  if(sortBy ==='priceLow'){
    sortedResults.sort((a,b)=>a.price-b.price);

  }

  if(sortBy==='priceHigh'){
    sortedResults.sort((a,b)=>b.price-a.price);
  }




  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold text-green-700 mb-6">
        💊 MediFinder
      </h1>

      <button
        onClick={() => navigate("/select-address")}
        className="w-full bg-white border rounded-xl shadow p-4 text-left mb-6 hover:shadow-md"
      >
        <p className="text-sm text-gray-500">
          📍 Deliver To
        </p>

        <h2 className="font-bold text-lg">
          {selectedAddress?.label || "Choose Address"}
        </h2>

        <p className="text-gray-600">
          {selectedAddress?.address}
        </p>
      </button>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="🔍 Search Medicines..."
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={searchMedicine}
          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl"
        >
          Search
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Popular Medicines
      </h2>

      <div className="flex flex-wrap gap-3 mb-8">
        {popularMedicines.map((item) => (
          <button
            key={item}
            onClick={() => setMedicine(item)}
            className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded-full"
          >
            💊 {item}
          </button>
        ))}
      </div>

      {results.length > 0 && (
  <>
    <div className="flex justify-between items-center mb-4">

      <h2 className="text-2xl font-semibold">
        Nearby Pharmacies
      </h2>

      <select
        value={sortBy}
        onChange={(e) => setsortBy(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="distance">Nearest First</option>
        <option value="priceLow">Price: Low → High</option>
        <option value="priceHigh">Price: High → Low</option>
      </select>

    </div>

   

          <div className="grid gap-4">
            {sortedResults.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.pharmacyId}
                pharmacy={pharmacy}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default Home;