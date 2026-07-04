import React from 'react'
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';


const AddAddress = () => {
    const navigate = useNavigate();
    const location=useLocation();

    const [formData, setformData] = useState({
      label:"",
      address:"",
      city:"",
      state:"",
      pincode:"",
      lat:location.state?.lat||"",
      long:location.state?.lng||"",
    })

     console.log(formData)

     const handlesubmit = async(e)=>{
e.preventDefault();

try {
      
  const response = await API.post("user/add-address", formData);
  console.log(response.data);


} catch (error) {
  console.log(error);
}
}

 return (
  <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">

      <h1 className="text-3xl font-bold text-center mb-6">
        Add New Address
      </h1>

      <button
        onClick={() => navigate("/map-picker")}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-6"
      >
        📍 Choose Location
      </button>

      {location.state?.lat && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-3 mb-6">
          <p className="font-semibold text-green-700">
            ✓ Location Selected
          </p>
          <p className="text-sm">
            Latitude: {location.state.lat}
          </p>
          <p className="text-sm">
            Longitude: {location.state.lng}
          </p>
        </div>
      )}

      <form onSubmit={handlesubmit} className="space-y-4">

        <input
          type="text"
          placeholder="🏠 Home / Office"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="📍 Address"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="🏙 City"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="🗺 State"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="📮 Pincode"
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Save Address
        </button>

      </form>

    </div>
  </div>
);
}

export default AddAddress;