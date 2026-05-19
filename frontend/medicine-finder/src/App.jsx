import React from 'react'
import Home from "../pages/Home"
import Login from '../pages/Login'
import Navbar from '../components/Navbar'
import Search from '../pages/Search'
import Cart from '../pages/Cart'
import Orders from "../pages/Orders";
import {Routes,Route } from 'react-router-dom'
import PharmacyDashboard from "../pages/PharmacyDetails"
import AddInventory from "../pages/addInventory";
import Inventory from '../pages/InventoryPage';
import SelectAddress from '../pages/selectAddress';
import AddAddress from '../pages/AddAddress';
import MapPicker from '../pages/MapPicker'


const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/search" element={<Search />} />
      <Route path="/cart" element={<Cart />} />
     <Route path="/orders" element={<Orders />} />
     <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
     <Route path="/add-inventory" element={<AddInventory />} />
     <Route path="/inventory" element={<Inventory />} />
     <Route path="/select-address" element={<SelectAddress/>}/>
     <Route path="/add-address" element={<AddAddress/>}/>
     <Route path="/map-picker" element={<MapPicker/>}/>
    </Routes>
    </>
    
  )
}

export default App