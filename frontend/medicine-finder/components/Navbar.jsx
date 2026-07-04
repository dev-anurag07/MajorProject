import React, { useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../src/context/Authcontext";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {role,user,setuser,setrole,settoken}=useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?name=${query}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setuser(null);
    setrole(null);
    settoken(null);
    
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-3 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        <Link to="/" className="text-2xl font-bold">
          MediFinder
        </Link>

        
        {role === "user" && 
        location.pathname ==="/" && (
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search medicines..."
              className="px-3 py-1 rounded text-black"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        )}

        <div className="flex items-center gap-6 text-sm font-medium">

          
          {role === "pharmacy" && (
            <>
              <Link to="/pharmacy/dashboard">Dashboard</Link>
              <Link to="/inventory">Inventory</Link>
              <Link to="/add-inventory">Add Medicine</Link>
              <Link to="/pharmacy/profile">Profile</Link>
            </>
          )}

          
          {role === "user" && (
            <>
              <Link to="/">Home</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}

          
          {user ? (
            <>
              <span className="font-semibold">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-green-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-green-600 px-3 py-1 rounded"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;