import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();


  const handleUpdate = async (id, updatedFields) => {
  try {
    const res = await API.put(`/inventory/update/${id}`, updatedFields);

    // update UI instantly
    setInventory((prev) =>
      prev.map((item) =>
        item._id === id ? res.data.data : item
      )
    );

  } catch (error) {
    alert("Update failed");
  }
};



  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory/my");
      setInventory(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load inventory");
    }
  };

  return (
  <div className="p-6">
    {/* Top Bar */}
    <div className="flex justify-between mb-4">
      <h2 className="text-xl font-bold">Your Inventory</h2>

      <button
        onClick={() => navigate("/add-inventory")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Medicine
      </button>
    </div>

    {/* List */}
    {inventory.length === 0 ? (
      <p>No medicines added yet</p>
    ) : (
      inventory.map((item) => (
        <div
          key={item._id}
          className="border p-4 mb-3 rounded flex justify-between items-center"
        >
          {/* LEFT */}
          <div>
            <p className="font-semibold">{item.medicineName}</p>
            <p className="text-sm text-gray-500">
              {item.manufacturer}
            </p>
          </div>

          {/* RIGHT */}
          <div className="text-right">

            {/* 🔥 PRICE EDIT */}
            <input
              type="number"
              defaultValue={item.price}
              onBlur={(e) =>
                handleUpdate(item._id, {
                  price: Number(e.target.value),
                })
              }
              className="w-20 border rounded px-1 text-right mb-2"
            />

            {/* 🔥 STOCK CONTROL */}
            <div className="flex items-center gap-2 justify-end mb-2">
              <button
                onClick={() =>
                  handleUpdate(item._id, {
                    stockQuantity: item.stockQuantity - 1,
                  })
                }
                className="bg-red-500 text-white px-2 rounded"
              >
                -
              </button>

              <span>{item.stockQuantity}</span>

              <button
                onClick={() =>
                  handleUpdate(item._id, {
                    stockQuantity: item.stockQuantity + 1,
                  })
                }
                className="bg-green-500 text-white px-2 rounded"
              >
                +
              </button>
            </div>

            {/* 🔥 DELETE BUTTON */}
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              Delete
            </button>

          </div>
        </div>
      ))
    )}
  </div>
);
};

export default Inventory;