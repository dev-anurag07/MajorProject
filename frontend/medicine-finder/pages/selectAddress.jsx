import React, { useEffect,useState } from "react";
import AddAddress from "./AddAddress";
import { useNavigate } from "react-router-dom";
import API from "../services/api";



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


    return (
        <div>

            <h1>Select Address</h1>
            <button>
                Use Current Location
            </button>

            <h2>Saved Addresses</h2>

            <div>
                {addresses.map((item,index)=>(
                    <div key ={index}
                    className="border p-4 rounded-lg mb-4 cursor-pointer"
                    onClick={()=>{
                        localStorage.setItem("selectedAddress", JSON.stringify(item));
                        navigate("/");
                    }}>
                       <h3 >{item.label}</h3>
                       <p>{item.address}

                       </p>

                    </div>
                ))}
            </div>

            <button onClick={()=>navigate("/add-address")}> +add new address </button>
        </div>
    )
}

export default SelectAddress;