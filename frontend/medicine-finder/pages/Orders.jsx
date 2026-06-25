import { useEffect, useState } from "react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded p-4 mb-4 shadow"
          >
            <h2 className="font-bold">{order.pharmacy.name}</h2>

            <p>Address: {order.pharmacy.address}</p>

            <p>Phone: {order.pharmacy.phoneNumber}</p>

            <p>Status: {order.status}</p>

            <p>Total: ₹{order.totalAmount}</p>

            <p>Reservation Code: {order.reservationCode}</p>

            <h3 className="font-semibold mt-2">Medicines</h3>

            {order.items.map((item) => (
              <div key={item.inventoryItem}>
                {item.medicineName} × {item.quantity}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;