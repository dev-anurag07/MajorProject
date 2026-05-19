import React from 'react'
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const AddAddress = () => {
    const navigate = useNavigate();
    const location=useLocation();

    const [formData, setformData] = useState({
      label:"",
      address:"",
      city:"",
      state:"",
      pincode:"",
      latitude:location.state?.lat||"",
      longitude:location.state?.lng||"",
    })

     console.log(formData)

  return (
    <div>
        <h1>Add New Address</h1>


        <input type="text"
        placeholder="Home/Ofiice"
        value={formData.label}
        onChange={(e)=> setformData({...formData,
          label: e.target.value,
        })}/>


        <input type="text"
        placeholder="Address"
        value={formData.address}

        onChange={(e)=>setformData({...formData,
          address: e.target.value,
        })}/>


        <input type="text"
        placeholder="City"
        value={formData.city}

        onChange={(e)=>setformData({...formData,
          city:e.target.value,
        })}/>

         <input type="text"
        placeholder="State"
        value={formData.state}

        onChange={(e)=>setformData({...formData,
          state:e.target.value,
        })}/>

         <input type="text"
        placeholder="Pincode"
        value={formData.pincode}

        onChange={(e)=>setformData({...formData,
          pincode:e.target.value,
        })}/>

         

       <input type="text"
        placeholder="Search Addres"/>

        <div>
            <p onClick={()=>navigate("/map-picker")}>Vijay Nagar, Indore</p>
            <p>Palasia, Indore</p>
        </div>

        <div>
          <p>{location.state?.lat}</p>
           <p>{location.state?.lng}</p>
        </div>
    </div>
  )
}

export default AddAddress;