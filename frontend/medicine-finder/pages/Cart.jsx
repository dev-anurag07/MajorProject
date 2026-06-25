import { useEffect, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState({});

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

    // remove pharmacy if empty
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
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || {};

    const items = storedCart[pharmacyId].map((item) => ({
      inventoryId: item.inventoryId,
      quantity: item.quantity,
    }));

    try {
      const response = await API.post("/orders/reserve", {
        pharmacyId,
        items,
      });

      alert(`Reservation Successful! \nReservation Code :${response.data.reservationCode}`);

     
      delete storedCart[pharmacyId];

      localStorage.setItem("cart", JSON.stringify(storedCart));
      setCart({ ...storedCart });

      navigate('/orders');
    } catch (error) {
      console.log(error);
      alert("Order failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {Object.keys(cart).length === 0 ? (
        <p>No items in cart</p>
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
              className="border p-4 mb-6 rounded"
            >
              
              <h2 className="text-lg font-bold mb-3">
                {items[0]?.pharmacyName}
              </h2>

            
              {items.map((item) => (
                <div
                  key={item.inventoryId}
                  className="border p-3 mb-2 rounded"
                >
                  <h3>{item.medicineName}</h3>
                  <p>₹{item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        decreaseQty(pharmacyId, item.inventoryId)
                      }
                      className="bg-gray-300 px-2"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQty(pharmacyId, item.inventoryId)
                      }
                      className="bg-gray-300 px-2"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleRemove(pharmacyId, item.inventoryId)
                    }
                    className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}

            
              <h3 className="mt-4 font-bold text-lg">
                Total: ₹{total}
              </h3>

              <button
                onClick={() => handlePlaceOrder(pharmacyId)}
                className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
              >
                Place Order
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Cart;
