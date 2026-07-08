import React ,{useContext}from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from "../services/api";
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';
import { AuthContext } from '../src/context/Authcontext';

const Login = () => {
    const navigate = useNavigate();
    const{
      setuser,
      setrole,
      settoken,
    }=useContext(AuthContext);

    const [form, setform] = useState({email:"",password:""});
    const [loading, setloading] = useState(false);

    const handleChange =(e)=>{
     setform({...form, [e.target.name]:e.target.value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setloading(true);

        try {
            const res = await API.post("/user/login",form);
            console.log(res.data);

            localStorage.setItem("token", res.data.AccessToken);
            localStorage.setItem("role",res.data.user.role);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            

            settoken(res.data.AccessToken);
            setrole(res.data.user.role);
            setuser(res.data.user);
            
            toast.success("login successfull");
           setTimeout(() => {
  navigate(
    res.data.user.role === "pharmacy"
      ? "/pharmacy/dashboard"
      : "/"
  );
  window.location.reload();
}, 1000);
           



        } catch (error) {
            const message =
               error.response?.data?.message || "Something went wrong";
             toast.error(message);
             setloading(false);
        }
    }

  return (
    <div className='flex justify-center items-center h-screen'>
        <form onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80">
             <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

             <p className="text-center mt-4">
  Don't have an account?{" "}
  <span
    onClick={() => navigate("/register")}
    className="text-green-600 font-semibold cursor-pointer hover:underline"
  >
    Register
  </span>
</p>

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
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-500 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}`}>
          {loading?(
            <>
            <TailSpin 
            height ={20}
            width={20}
            color="white"/>
            Logging in...</>):("Login")}
        </button>

        </form>


    </div>
  )
}

export default Login