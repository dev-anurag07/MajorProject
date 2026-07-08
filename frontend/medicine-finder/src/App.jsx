import React,{useContext} from 'react'
import Home from "../pages/Home"
import Login from '../pages/Login'
import Navbar from '../components/Navbar'
import Search from '../pages/Search'
import Cart from '../pages/Cart'
import Orders from "../pages/Orders";
import {Routes,Route } from 'react-router-dom'
import PharmacyDashboard from "../pages/PharmacyDashboard"
import AddInventory from "../pages/addInventory";
import Inventory from '../pages/InventoryPage';
import SelectAddress from '../pages/selectAddress';
import AddAddress from '../pages/AddAddress';
import MapPicker from '../pages/MapPicker'
import PharmacyCard from '../components/PharmacyCard'
import PharmacyDetails from '../pages/PharmacyDetails'
import PharmacyProfile from '../pages/PharmacyProfile'
import { Navigate } from 'react-router-dom'
import Register from '../pages/Register'
import UserProfile from '../pages/UserProfile'
import EditMedicine from '../pages/EditMedicine'
import {Toaster} from "react-hot-toast";
import { AuthContext } from './context/Authcontext'
import ChooseRole from '../pages/ChooseRole'
import PharmacyRegister from '../pages/PharmacyRegister'
import BusinessProfile from "../pages/BusinessProfile"
import Profile from '../pages/Profile'




const App = () => {
  const {role} = useContext(AuthContext);
   
  console.log("Role:",role);
  return (
    <>
    <Navbar/>

    <Toaster position="top-right"/>

    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path ="/register" element={<ChooseRole/>}/>
      <Route path='/register/user' element={<Register/>}/>
      <Route path="/register/pharmacy" element ={<PharmacyRegister/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/search" element={<Search />} />
      <Route
  path="/profile"
  element={
    role === "user"
      ? <UserProfile />
      : <Profile />
  }
/>
      
<Route
  path="/pharmacy/business-profile"
  element={<BusinessProfile />}
/>

      <Route path="/cart"
       element={
       role=="user"?(<Cart/>):(<Navigate to="/pharmacy/dashboard"/>)} />
     <Route path="/orders" element={
      role==="user"?(<Orders/>):(<Navigate to="/pharmacy/dashboard" />)} />
     <Route path="/pharmacy/dashboard" element={
      role ==="pharmacy"?(<PharmacyDashboard />):(<Navigate to ="/"/>)} />

     <Route path="/add-inventory" element={
      role ==="pharmacy"?(<AddInventory />):(<Navigate to ="/"/>)} />
     <Route path="/inventory" element={
      role==="pharmacy"?(<Inventory />):(<Navigate to= "/"/>)} />
     <Route path="/select-address" element={<SelectAddress/>}/>
     <Route path="/add-address" element={<AddAddress/>}/>
     <Route path="/map-picker" element={<MapPicker/>}/>
     <Route path="/pharmacy/:id" element={<PharmacyDetails/>}/>
     <Route path="/edit-medicine/:medicineId" element={
      role==="pharmacy"?<EditMedicine/>:<Navigate to="/"/>
     }/>
    </Routes>
    </>
    
  )
}

export default App