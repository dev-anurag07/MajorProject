import { useEffect, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

const Cart = () => {
  const [cart, setCart] = useState({});
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

 
  const increaseQty = (pharmacyId, inventoryId) => {
    const updated = { ...cart };

    updated[pharmacyId] = updated[pharmacyId].map((item) =>
      item.inventoryId === inventoryId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  
  const decreaseQty = (pharmacyId, inventoryId) => {
    const updated = { ...cart };

    updated[pharmacyId] = updated[pharmacyId]
      .map((item) =>
        item.inventoryId === inventoryId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    
    if (updated[pharmacyId].length === 0) {
      delete updated[pharmacyId];
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  
  const handleRemove = (pharmacyId, inventoryId) => {
    const updated = { ...cart };

    updated[pharmacyId] = updated[pharmacyId].filter(
      (item) => item.inventoryId !== inventoryId
    );

    if (updated[pharmacyId].length === 0) {
      delete updated[pharmacyId];
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  
  const navigate = useNavigate();


  const handlePlaceOrder = async (pharmacyId) => {
    setloading(true);
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || {};

    const items = storedCart[pharmacyId].map((item) => ({
      inventoryId: item.inventoryId,
      quantity: item.quantity,
    }));

    console.log("sending",{pharmacyId,items})
    try {
      const response = await API.post("/orders/reserve", {
        pharmacyId,
        items,
      });

      toast.success(`Reservation Successful! \nReservation Code :${response.data.reservationCode}`);

     
      delete storedCart[pharmacyId];

      localStorage.setItem("cart", JSON.stringify(storedCart));
      setCart({ ...storedCart });

      navigate('/orders');
    } catch (error) {
      console.log(error);
      toast.error("Order failed");
      setloading(false);
    }
  };

 return (
  <div className="max-w-5xl mx-auto p-6">

    <h1 className="text-3xl font-bold mb-8">
      🛒 My Cart
    </h1>

    {Object.keys(cart).length === 0 ? (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-2">
          Search medicines and add them to your cart.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Continue Shopping
        </button>
      </div>
    ) : (
      Object.keys(cart).map((pharmacyId) => {
        const items = cart[pharmacyId];

        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return (
          <div
            key={pharmacyId}
            className="bg-white shadow-lg rounded-2xl p-6 mb-8"
          >

            <div className="flex justify-between items-center mb-5">

              <div>
                <h2 className="text-2xl font-bold text-green-700">
                  🏥 {items[0]?.pharmacyName}
                </h2>

                <p className="text-gray-500">
                  {items.length} medicine(s)
                </p>
              </div>

            </div>

            {items.map((item) => (
              <div
                key={item.inventoryId}
                className="border rounded-xl p-4 mb-4 flex justify-between items-center"
              >

               <div className="flex items-center gap-4"> 
                <img src={item.image}
                alt={item.medicineName}
                className="w-20 h-20 rounded-xl object-cover border"/>
                <div>

                  <h3 className="text-lg font-semibold">
                    💊 {item.medicineName}
                  </h3>

                  <p className="text-green-700 font-bold mt-1">
                    ₹{item.price}
                  </p>

                </div></div>

                <div className="text-right">

                  <div className="flex items-center justify-end gap-3">

                    <button
                      onClick={() =>
                        decreaseQty(
                          pharmacyId,
                          item.inventoryId
                        )
                      }
                      className="bg-red-500 text-white w-8 h-8 rounded-full"
                    >
                      −
                    </button>

                    <span className="font-bold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(
                          pharmacyId,
                          item.inventoryId
                        )
                      }
                      className="bg-green-600 text-white w-8 h-8 rounded-full"
                    >
                      +
                    </button>

                  </div>

                  <button
                    onClick={() =>
                      handleRemove(
                        pharmacyId,
                        item.inventoryId
                      )
                    }
                    className="text-red-600 mt-3"
                  >
                    🗑 Remove
                  </button>

                </div>

              </div>
            ))}

            <div className="border-t pt-5 mt-5 flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                Total
              </h2>

              <h2 className="text-3xl font-bold text-green-700">
                ₹{total}
              </h2>

            </div>

          <button
  onClick={() => handlePlaceOrder(pharmacyId)}
  disabled={loading}
  className={`px-4 py-2 mt-4 rounded text-white flex items-center justify-center gap-2 ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {loading ? (
    <>
      <TailSpin
        height={20}
        width={20}
        color="white"
      />
      Reserving...
    </>
  ) : (
    "Place Order"
  )}
</button>

          </div>
        );
      })
    )}
  </div>
);
};

export default Cart;