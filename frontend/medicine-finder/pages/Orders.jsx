import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Picked Up":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-green-700 mb-2">
        📦 My Orders
      </h1>

      <p className="text-gray-500 mb-8">
        Track all your medicine reservations
      </p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-500">
            Search medicines and place your first reservation.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md border mb-8 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-green-50 p-5 border-b">

              <div>
                <h2 className="text-2xl font-bold">
                  🏥 {order.pharmacy.name}
                </h2>

                <p className="text-gray-600 mt-1">
                  📍 {order.pharmacy.address}
                </p>

                <p className="text-gray-600">
                  📞 {order.pharmacy.phoneNumber}
                </p>
              </div>

              <div className="text-right">

                <span
                  className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

                <p className="mt-3 text-sm text-gray-500">
                  Reservation Code
                </p>

                <p className="font-bold text-lg text-blue-700">
                  {order.reservationCode}
                </p>

              </div>

            </div>

            

            <div className="p-5">

              <h3 className="text-lg font-bold mb-4">
                Medicines
              </h3>

              {order.items.map((item) => (
                <div
                  key={item.inventoryItem}
                  className="flex justify-between border-b py-3"
                >
                  <div>
                    <p className="font-semibold">
                      💊 {item.medicineName}
                    </p>

                    <p className="text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="font-bold">
                    ₹{item.pricePerUnit * item.quantity}
                  </div>
                </div>
              ))}

              {/* Footer */}

              <div className="flex justify-between items-center mt-5">

                <div>
                  <p className="text-gray-500">
                    Total Medicines
                  </p>

                  <p className="font-bold">
                    {order.items.length}
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-gray-500">
                    Total Amount
                  </p>

                  <p className="text-2xl font-bold text-green-700">
                    ₹{order.totalAmount}
                  </p>

                </div>

              </div>

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
