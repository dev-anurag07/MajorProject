import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const PharmacyDashboard = () => {
  const [orders, setOrders] = useState([]);
const navigate = useNavigate();
const handleUpdateStatus = async (id, status) => {
  try {
    await API.put(`/orders/status/${id}`, { status });

    // update UI instantly
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status } : order
      )
    );

  } catch (error) {
    alert(error.response?.data?.message || "Update failed");
  }
};
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/incoming");
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load orders");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-bold">
    Pharmacy Dashboard
  </h2>

  <button
    onClick={() => navigate("/add-inventory")}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    + Add Medicine
  </button>
</div>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 mb-4 rounded shadow"
          >
           
            <h3 className="font-bold text-lg">
              {order.pharmacy?.name}
            </h3>

            <p>Total medicines:
              {order.items.length}
            </p>
            <p className="text-sm text-gray-500">
              Customer: {order.user?.Name}
            </p>

            <p className="text-sm text-gray-500">
              Phone: {order.user?.phoneNumber}
            </p>

            
            <div className="mt-2">
  <label className="text-sm mr-2">Status:</label>

  <select
  value={order.status}
  onChange={(e) =>
    handleUpdateStatus(order._id, e.target.value)
  }
  className={`border p-1 rounded
    ${
      order.status === "Pending"
        ? "bg-yellow-100"
        : order.status === "Confirmed"
        ? "bg-blue-100"
        : order.status === "Picked Up"
        ? "bg-green-100"
        : "bg-red-100"
    }
  `}
>
  <option value="Pending">Pending</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Picked Up">Picked Up</option>
  <option value="Cancelled">Cancelled</option>
</select>
</div>

           
            <p className="text-sm text-blue-700 font-bold mt-1">
              Code: {order.reservationCode}
            </p>

            
            {order.items.map((item) => (
              <div key={item._id} className="mt-2">
                <p>{item.medicineName}</p>
                <p>
                  ₹{item.pricePerUnit} × {item.quantity}
                </p>
              </div>
            ))}

            {/* Total */}
            <h4 className="mt-3 font-bold">
              Total: ₹{order.totalAmount}
            </h4>
          </div>
        ))
      )}
    </div>
  );
};

export default PharmacyDashboard;