import React, { useState } from "react";

export default function Header({ onDatesChange }) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const handleDateChange = () => {
    if (pickup && drop) {
      onDatesChange({ pickup, drop });
    }
  };

  return (
    <div className="bg-gray-100 p-4 flex flex-wrap gap-4 justify-center items-center border-b shadow-sm">
      <div className="flex flex-col">
        <label className="text-sm font-medium">Pickup Date & Time</label>
        <input
          type="datetime-local"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          onBlur={handleDateChange}
          className="border px-2 py-1 rounded"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium">Drop Date & Time</label>
        <input
          type="datetime-local"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          onBlur={handleDateChange}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>
  );
}
