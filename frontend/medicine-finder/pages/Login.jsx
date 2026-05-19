import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from "../services/api";

const Login = () => {
    const navigate = useNavigate();

    const [form, setform] = useState({email:"",password:""});

    const handleChange =(e)=>{
     setform({...form, [e.target.name]:e.target.value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try {
            const res = await API.post("/user/login",form);

            localStorage.setItem("token", res.data.AccessToken);
            localStorage.setItem("role",res.data.user.role);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            alert("login successfull");
           if (res.data.user.role === "pharmacy") {
             navigate("/pharmacy/dashboard");
               } else {
               navigate("/");
}


        } catch (error) {
            const message =
               error.response?.data?.message || "Something went wrong";
             alert(message);
        }
    }

  return (
    <div className='flex justify-center items-center h-screen'>
        <form onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80">
             <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

            <input
             type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          />
            
        <input
         type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>

        </form>


    </div>
  )
}

export default Login