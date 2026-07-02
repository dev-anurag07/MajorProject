import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PharmacyDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [code, setcode] = useState("");
  const [searchedOrder, setsearchedOrder] = useState(null);
  const [stats, setstats] = useState({
    totalOrders:0,
    pendingOrders:0,
    totalRevenue:0,
    totalMedicines:0,
  })

const navigate = useNavigate();



const searchReservation = async ()=>{
  try {
    const res = await API.get(`/orders/search/${code}`);
console.log(res.data);
    setsearchedOrder(res.data.data);
  } catch (error) {
    toast.error("Reservation not found");
    setsearchedOrder(null);
  }
}


const handleUpdateStatus = async (id, status) => {
  try {
    await API.put(`/orders/status/${id}`, { status });

    
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status } : order
      )
    );

  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  }
};
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/incoming");
      const orderData = res.data.data;

setOrders(orderData);

setstats({
  totalOrders: orderData.length,
  pendingOrders: orderData.filter(
    (o) => o.status === "Pending"
  ).length,
  totalRevenue: orderData.reduce(
    (sum, o) => sum + Number(o.totalAmount),
    0
  ),
  totalMedicines: orderData.reduce(
    (sum, o) => sum + o.items.length,
    0
  ),
});
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    }
  };

  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-6">
  <h2 className="text-3xl font-bold text-green-700">
    🏥 Pharmacy Dashboard
  </h2>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

  <div className="bg-blue-100 rounded-xl p-4 shadow">
    <p className="text-gray-600">Orders</p>
    <h2 className="text-3xl font-bold">
      {stats.totalOrders}
    </h2>
  </div>

  <div className="bg-yellow-100 rounded-xl p-4 shadow">
    <p className="text-gray-600">Pending</p>
    <h2 className="text-3xl font-bold">
      {stats.pendingOrders}
    </h2>
  </div>

  <div className="bg-green-100 rounded-xl p-4 shadow">
    <p className="text-gray-600">Revenue</p>
    <h2 className="text-3xl font-bold">
      ₹{stats.totalRevenue}
    </h2>
  </div>

  <div className="bg-purple-100 rounded-xl p-4 shadow">
    <p className="text-gray-600">Medicines</p>
    <h2 className="text-3xl font-bold">
      {stats.totalMedicines}
    </h2>
  </div>

</div>


<div className="mb-6 flex items-center gap-2">
  <input type ='text'
  placeholder ="Enter Reservation code"
  value={code}
  onChange={(e)=>{setcode(e.target.value);
    if(e.target.value.trim()===""){
      setsearchedOrder(null);
      fetchOrders();
    }
  }}
  
  className="border p-2 rounded w-72"/>


<button onClick={searchReservation} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
</div>


      {searchedOrder ? (
  <div
    key={searchedOrder._id}
    className="border p-4 mb-4 rounded shadow"
  >
    <h3 className="font-bold text-lg">
      {searchedOrder.pharmacy?.name}
    </h3>

    <p className="text-sm text-gray-500">
      Customer: {searchedOrder.user?.Name}
    </p>

    <p className="text-sm text-gray-500">
      Phone: {searchedOrder.user?.phoneNumber}
    </p>

    <p>Status: {searchedOrder.status}</p>

    <p className="text-blue-600 font-bold">
      Code: {searchedOrder.reservationCode}
    </p>

    {searchedOrder.items.map((item) => (
      <div key={item._id}>
        <p>{item.medicineName}</p>
        <p>
          ₹{item.pricePerUnit} × {item.quantity}
        </p>
      </div>
    ))}

    <h4 className="font-bold mt-2">
      Total: ₹{searchedOrder.totalAmount}
    </h4>
  </div>
) : orders.length === 0 ? (
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