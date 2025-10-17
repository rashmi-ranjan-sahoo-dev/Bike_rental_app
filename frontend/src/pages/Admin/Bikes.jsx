import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API } from '../../api/api';

const Bikes = () => {

    const [bikes, setBikes] = useState([]);
    const [formData,setFormData] = useState({
        modle: "",
        type: "",
        pricePerDay: "",
        pricePerHour: "",
        pricePerWeek: "",
        imageUrl: "",
        status: "available"
    });

    const [editId, setEditId] = useState(null);

    const fetchBikes = async () =>{
        try {
            const res = await axios.get(`${API}/admin/bikes`);

            setBikes(res.data.bikes || [])
        }catch(error){
            console.error("Failed to load bikes", error);
        }
    }

    useEffect(() =>{
        fetchBikes();
    },[]);

    const handleChange = ( key, value) =>{
        setFormData((s) => ({ ...s, [key]: value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const payload = {
                ...formData,
                pricePerDay: Number(formData.pricePerDay),
                pricePerHour: Number(formData.pricePerHour),
                pricePerWeek: Number(formData.pricePerWeek),
            }

            if(editId){
                await axios.put(`${API}/admin/bike`, { bikeId: editId, ...payload})
            }else {
                await axios.post(`${API}/admin/bike`, payload)
            }

               setFormData({
                     model: "",
                     type: "",
                     pricePerDay: "",
                     pricePerHour: "",
                     pricePerWeek: "",
                     imageUrl: "",
                     status: "available",
                   });

                   setEditId(null);
                   fetchBikes();
        } catch( error){
            console.log("failed to save bike", error);
            alert("Failed to save bike")
        }
    };

    
       const handleDelete = async (id) => {
         if (!confirm("Delete this bike?")) return;
         try {
           await axios.delete(`${API}/admin/bike`, { data: { bikeId: id } });
           fetchBikes();
         } catch (err) {
           console.error("Delete failed", err);
           alert("Delete failed");
         }
       };


    const handleEdit = (bike) =>{
        setFormData({
              model: bike.model || "",
              type: bike.type || "",
              pricePerDay: bike.pricePerDay ?? "",
              pricePerHour: bike.pricePerHour ?? "",
              pricePerWeek: bike.pricePerWeek ?? "",
              imageUrl: bike.imageUrl || "",
              status: bike.status || "available",
        })
        setEditId(bike._id);
         
        // scroll to top / from if needed
        window.scrollTo({ top: 0, behavior: "smooth"})
    }
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Manage Bikes</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}
      className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 '>
        <input
         type="text"
         placeholder='Modle'
         value={formData.modle}
         onChange={(e) => handleChange("modle", e.target.value)}
         className='border p-2 rounded'
         />

         <input  
         type='text'
         placeholder ="Type"
         value = {formData.type}
         onChange= {(e) => handleChange("type",e.target.value)}
         className= "border p-2 rounded" />

         <select value={formData.status}
         onChange={(e) => handleChange("status",e.target.value)}
         className='border p-2 rounded'
         >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="maintenance">Maintenance</option>
         </select>
         
         <input  
         type='text'
         placeholder ="Price / Day"
         value = {formData.pricePerDay}
         onChange= {(e) => handleChange("pricePerDay",e.target.value)}
         className= "border p-2 rounded" />

        <input  
         type='text'
         placeholder ="Price / Hour"
         value = {formData.pricePerHour}
         onChange= {(e) => handleChange("pricePerHour",e.target.value)}
         className= "border p-2 rounded" />

        <input  
         type='text'
         placeholder ="Price / Week"
         value = {formData.pricePerWeek}
         onChange= {(e) => handleChange("pricePerWeek",e.target.value)}
         className= "border p-2 rounded" />
         
         <input  
         type='url'
         placeholder ="Image URL"
         value = {formData.imageUrl}
         onChange= {(e) => handleChange("imageUrl",e.target.value)}
         className= "border p-2 rounded" />

         <div className='flex items-center gap-3'>
            <button className='bg-blue-600 text-white px-4 rounded hover:bg-blue-700'>
                {editId ? "Update Bike" : "Add Bike"}
            </button>
             {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormData({
                  model: "",
                  type: "",
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
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Price/Day</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike._id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {bike.imageUrl ? (
                    <img src={bike.imageUrl} alt={bike.model} className="w-24 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-24 h-16 bg-gray-100 flex items-center justify-center text-sm text-gray-400 rounded">
                      No image
                    </div>
                  )}
                </td>
                <td className="p-2">{bike.model}</td>
                <td className="p-2">{bike.type}</td>
                <td className="p-2 capitalize">{bike.status}</td>
                <td className="p-2">₹{bike.pricePerDay}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(bike)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(bike._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {bikes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No bikes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Bikes
