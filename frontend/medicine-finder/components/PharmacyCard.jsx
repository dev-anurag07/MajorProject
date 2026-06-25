import React from 'react'
import { useNavigate } from 'react-router-dom'

const PharmacyCard = ({pharmacy}) => {
  console.log(pharmacy);
    const navigate = useNavigate();
  return (
    <div className="border p-4 rounded-lg mb-4">
        <h2>{pharmacy.pharmacyName}</h2>
        <p>{pharmacy.medicineName}</p>
        <p>{pharmacy.distance_km.toFixed(2)}km away</p>

        <button onClick={()=>navigate(`/pharmacy/${pharmacy.pharmacyId}`)}>Veiw Details</button>
    </div>
  )
}

export default PharmacyCard