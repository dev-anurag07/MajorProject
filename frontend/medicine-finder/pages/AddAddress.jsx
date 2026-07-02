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
    <div>
        <h1>Add New Address</h1>

        <button onClick={()=>navigate("/map-picker")} className='bg-blue-600 text-white px-4 py-2 rounded-lg'>Choose Location</button>

      <form onSubmit={handlesubmit}>
        
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
            

            <button type="submit">Save Address</button>
      </form>
         

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