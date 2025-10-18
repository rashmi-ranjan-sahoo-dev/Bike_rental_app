import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../api/api";


export default function Helmets() {
  const [helmets, setHelmets] = useState([]);
  const [formData, setFormData] = useState({
    model: "",
    pricePerDay: "",
    pricePerHour: "",
    pricePerWeek: "",
    imageUrl: "",
    status: "available", // available / unavailable / maintenance
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchHelmets = async () => {
    try {
      const res = await axios.get(`${API}/admin/helmets`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHelmets(res.data.helmets || []);
    } catch (err) {
      console.error("Failed to fetch helmets", err);
    }
  };

  useEffect(() => {
    fetchHelmets();
  }, []);

  const handleChange = (key, value) => {
    setFormData((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        pricePerHour: Number(formData.pricePerHour),
        pricePerWeek: Number(formData.pricePerWeek),
      };

      if (editId) {
        await axios.put(`${API}/admin/helmet`, { helmetId: editId, ...payload }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${API}/admin/helmet`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      setFormData({
        model: "",
        pricePerDay: "",
        pricePerHour: "",
        pricePerWeek: "",
        imageUrl: "",
        status: "available",
      });
      setEditId(null);
      fetchHelmets();
    } catch (err) {
      console.error("Failed to save helmet", err);
      alert("Failed to save helmet");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this helmet?")) return;
    try {
      await axios.delete(`${API}/admin/helmet`, { 
        data: { helmetId: id },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchHelmets();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  const handleEdit = (helmet) => {
    setFormData({
      model: helmet.model || "",
      pricePerDay: helmet.pricePerDay ?? "",
      pricePerHour: helmet.pricePerHour ?? "",
      pricePerWeek: helmet.pricePerWeek ?? "",
      imageUrl: helmet.imageUrl || "",
      status: helmet.status || "available",
    });
    setEditId(helmet._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Helmets</h1>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => handleChange("model", e.target.value)}
          className="border p-2 rounded"
          required
        />

        <select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <input
          type="number"
          placeholder="Price / Day"
          value={formData.pricePerDay}
          onChange={(e) => handleChange("pricePerDay", e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price / Hour"
          value={formData.pricePerHour}
          onChange={(e) => handleChange("pricePerHour", e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price / Week"
          value={formData.pricePerWeek}
          onChange={(e) => handleChange("pricePerWeek", e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="url"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          className="border p-2 rounded md:col-span-2"
        />

        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editId ? "Update Helmet" : "Add Helmet"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormData({
                  model: "",
                  pricePerDay: "",
                  pricePerHour: "",
                  pricePerWeek: "",
                  imageUrl: "",
                  status: "available",
                });
              }}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Image preview */}
        {formData.imageUrl && (
          <div className="md:col-span-3 mt-2">
            <p className="text-sm text-gray-600">Image preview:</p>
            <img
              src={formData.imageUrl}
              alt="preview"
              onError={(e) => (e.target.style.display = "none")}
              className="w-40 h-28 object-cover rounded mt-1"
            />
          </div>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Model</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Price/Day</th>
              <th className="p-2 text-left">Price/Hour</th>
              <th className="p-2 text-left">Price/Week</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {helmets.map((helmet) => (
              <tr key={helmet._id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {helmet.imageUrl ? (
                    <img src={helmet.imageUrl} alt={helmet.model} className="w-24 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-24 h-16 bg-gray-100 flex items-center justify-center text-sm text-gray-400 rounded">
                      No image
                    </div>
                  )}
                </td>
                <td className="p-2">{helmet.model}</td>
                <td className="p-2 capitalize">{helmet.status}</td>
                <td className="p-2">₹{helmet.pricePerDay}</td>
                <td className="p-2">₹{helmet.pricePerHour}</td>
                <td className="p-2">₹{helmet.pricePerWeek}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(helmet)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(helmet._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {helmets.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">No helmets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
