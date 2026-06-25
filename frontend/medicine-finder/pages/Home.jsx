import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import API from '../services/api';
import PharmacyCard from "../components/PharmacyCard"


const Home = () => {

  const navigate = useNavigate();
  const selectedAddress=JSON.parse(localStorage.getItem("selectedAddress"));

  console.log(selectedAddress);
  const [medicine, setmedicine] = useState("");
  const [results, setresults] = useState([]);

  const searchMedicine = async ()=>{
    try {
      const response = await API.get("user/nearby",{
        params:{
          medicine,
          lat:
          selectedAddress.location.coordinates[1],
          lang:
          selectedAddress.location.coordinates[0]
        }
      });
      console.log(response.data);
      setresults(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='max-w-3xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>MediFinder</h1>

      <button onClick={()=> navigate("/select-address")}
        className='border p-3 rounded-lg w-full text-left mb-4'>
        {selectedAddress?.label || "Selected Address"}
      </button>

      <input type="text" placeholder="Search medicine..."
      value={medicine}
      onChange={(e)=>setmedicine(e.target.value)}
      className='border p-3 rounded-lg w-full'/>

      <button  onClick={searchMedicine}
      className='bg-green-600 text-white px-4 py-2 rounded-lg mt-4 w-full'>Search</button>

      <div className='mt-6'>{results.map((pharmacy)=>(<PharmacyCard 
      key={pharmacy._id}
      pharmacy={pharmacy}/>))}
      </div>
    </div>
  )
}

export default Home