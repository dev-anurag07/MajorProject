import { useEffect, useState } from "react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

const handleCancel = async (id) => {
  try {
    await API.put(`/orders/cancel/${id}`);

    alert("Order cancelled");

    setOrders((prev) =>
      prev.map((order) =>
        order._id === id
          ? { ...order, status: "Cancelled" }
          : order
      )
    );

  } catch (error) {
    alert("Cancel failed");
  }
};





  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

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

            <p className="text-sm text-gray-500">
              Status: {order.status}
            </p>

            <p className="text-sm text-gray-500">
              Code: {order.reservationCode}
            </p>

            {/* Items */}
            {order.items.map((item) => (
              <div key={item._id} className="mt-2">
                <p>{item.medicineName}</p>
                <p>
                  ₹{item.pricePerUnit} × {item.quantity}
                </p>
              </div>
            ))}

            <h4 className="mt-3 font-bold">
              Total: ₹{order.totalAmount}
            </h4>

            {order.status === "Pending" && (
  <button
    onClick={() => handleCancel(order._id)}
    className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
  >
    Cancel Order
  </button>
)}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;