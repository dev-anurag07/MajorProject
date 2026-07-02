import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory/my");
      setInventory(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load inventory");
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      const res = await API.put(`/inventory/update/${id}`, updatedFields);

      setInventory((prev) =>
        prev.map((item) =>
          item._id === id ? res.data.data : item
        )
      );
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      await API.delete(`/inventory/delete/${id}`);

      setInventory((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Medicine deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          💊 Pharmacy Inventory
        </h1>

        <button
          onClick={() => navigate("/add-inventory")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Medicine
        </button>
      </div>

      {inventory.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No medicines added yet.
        </div>
      ) : (
        inventory.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition p-6 mb-5 flex justify-between items-center"
          >

            <div className="flex items-center gap-5">

              <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center text-3xl">
                💊
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {item.medicineName}
                </h2>

                <p className="text-gray-500">
                  {item.manufacturer}
                </p>

                <p className="text-blue-600 text-sm">
                  {item.category}
                </p>

                <p className="text-sm text-gray-500">
                  Expiry :
                  {" "}
                  {item.expiryDate
                    ? new Date(item.expiryDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="text-right">

              <input
                type="number"
                defaultValue={item.price}
                onBlur={(e) =>
                  handleUpdate(item._id, {
                    price: Number(e.target.value),
                  })
                }
                className="w-24 border-2 rounded-lg px-2 py-1 text-center font-semibold mb-3"
              />

              <div className="flex items-center justify-end gap-3 mb-3">

                <button
                  onClick={() =>
                    handleUpdate(item._id, {
                      stockQuantity: item.stockQuantity - 1,
                    })
                  }
                  className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full"
                >
                  -
                </button>

                <span className="font-bold text-lg">
                  {item.stockQuantity}
                </span>

                <button
                  onClick={() =>
                    handleUpdate(item._id, {
                      stockQuantity: item.stockQuantity + 1,
                    })
                  }
                  className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded-full"
                >
                  +
                </button>

              </div>

              <p
                className={`font-semibold mb-3 ${
                  item.stockQuantity === 0
                    ? "text-red-600"
                    : item.stockQuantity <= 10
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {item.stockQuantity === 0
                  ? "🔴 Out of Stock"
                  : item.stockQuantity <= 10
                  ? "🟡 Low Stock"
                  : "🟢 In Stock"}
              </p>

              <label className="flex items-center justify-end gap-2 mt-2">
                <input type="checkbox"
                checked={item.isAvailable}
                onChange={(e)=>handleUpdate(item._id,{
                  isAvailable:e.target.checked,
                })}
                />
                <span>{item.isAvailable?"Available":"Not Available"}</span>
              </label>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                🗑 Delete
              </button>

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Inventory;