import React from "react";
import AddAddress from "./AddAddress";
import { useNavigate } from "react-router-dom";



const SelectAddress=()=>{
    const navigate = useNavigate();
    const addresses =[
        {label:"Home",
            address:"Vijay Nagar, Indore",
        },

        {
            label:"Work",
            address:"Palasia, Indore",

        },
    ];


    return (
        <div>

            <h1>Select Address</h1>
            <button>
                Use Current Location
            </button>

            <h2>Saved Addresses</h2>

            <div>
                {addresses.map((item,index)=>(
                    <div key ={index}>
                       <h3>{item.label}</h3>
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