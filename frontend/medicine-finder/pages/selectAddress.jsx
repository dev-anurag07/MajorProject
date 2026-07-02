import React, { useEffect,useState } from "react";
import AddAddress from "./AddAddress";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";



const SelectAddress=()=>{
    const navigate = useNavigate();
  
    const [addresses, setaddresses] = useState([]);

    useEffect(()=>{
        const fetchAddresses = async ()=>{
            try {
                const response = await API.get("/user/get-address");
                console.log(response.data);
                setaddresses(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAddresses();
    },[]);

    const handleCurrentLocation =()=>{
        if(!navigator.geolocation){
            toast.error("Geolocation is not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition((position)=>{
            const location={
                label:"Current Location",
                address:"Live Location",
                location:{
                    type:"Point",
                    coordinates:[
                        position.coords.longitude,
                        position.coords.latitude
                    ]
                }
            }

            localStorage.setItem("selectedAddress",
                JSON.stringify(location));
            
                navigate("/");
        },
    ()=>{
        toast.error("Unable to get your location")
    })
    }

return (
  <div className="max-w-2xl mx-auto p-6">

    <h1 className="text-3xl font-bold mb-6">
      Select Delivery Address
    </h1>

    <button
    onClick={handleCurrentLocation}
      className="w-full border rounded-lg p-4 text-left mb-6 hover:bg-gray-100"
    >
      📍 <span className="font-semibold">Use Current Location</span>
    </button>

    <h2 className="text-xl font-semibold mb-4">
      Saved Addresses
    </h2>

    <div className="space-y-4">
      {addresses.map((item, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer transition"
          onClick={() => {
            localStorage.setItem(
              "selectedAddress",
              JSON.stringify(item)
            );
            navigate("/");
          }}
        >
          <h3 className="font-bold text-lg">
            🏠 {item.label}
          </h3>

          <p className="text-gray-600 mt-1">
            {item.address}
          </p>
        </div>
      ))}
    </div>

    <button
      onClick={() => navigate("/add-address")}
      className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
    >
      + Add New Address
    </button>

  </div>
);
}

export default SelectAddress;