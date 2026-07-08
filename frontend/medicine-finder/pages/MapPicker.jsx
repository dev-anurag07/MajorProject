import React, {useRef,useState} from 'react'

import{GoogleMap, LoadScript} from "@react-google-maps/api"
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const center ={
    lat:22.75,
    lng:75.89,
}

const MapPicker = () => {
    const navigate=useNavigate();
    const location = useLocation();

    const mapRef = useRef();
    const [selectedlocation, setselectedlocation] = useState({lat:22.7533,
        lng:75.8937,
    });

  return (
 <div>  
    <div className='relative w-fit'> <LoadScript googleMapsApiKey="AIzaSyDz4rW-HyMgqQdiYPF70CfMj73D8w6GyYw">
    <GoogleMap onLoad={(map)=>{mapRef.current=map;} } onIdle={()=>{
        const center = mapRef.current.getCenter();
       setselectedlocation({
        lat:center.lat(),
        lng: center.lng(),
       })
    }}
    mapContainerStyle={{width:"500px",
        height:"70vh",
    }}
    center={center}
    zoom={15}/>
        </LoadScript>

        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-4xl'>📍</div>
        
        </div>

      <div className='p-4 bg-white shadow-md rounded-lg mt-4 w-fit'>
        <p className='text-sm font-semibold '>{selectedlocation.lat}</p>
        <p  className='text-sm font-semibold '>{selectedlocation.lng}</p>
<button
  className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4 hover:bg-green-700"
 onClick={() => {
  if (location.state?.from === "business-profile") {
    navigate("/pharmacy/business-profile", {
      state: {
        address: `Lat: ${selectedlocation.lat}, Lng: ${selectedlocation.lng}`,
        lat: selectedlocation.lat,
        lng: selectedlocation.lng,
      },
    });
  } else {
    navigate("/add-address", {
      state: {
        lat: selectedlocation.lat,
        lng: selectedlocation.lng,
      },
    });
  }
}}
>
  Confirm Location
</button>
      </div>
    </div>
  )
}

export default MapPicker