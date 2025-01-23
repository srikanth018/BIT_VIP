import React from "react";

function VenueDetails({ formValues, selectedBlock,selectedFloor,selectedType, capacity }) {
  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800">Venue Details</h2>
      <div>
        <p className="mt-2 text-gray-600">Date: {formValues.date || "N/A"}</p>
        <p className="mt-1 text-gray-600">
          From Time: {formValues.fromTime || "N/A"}
        </p>
        <p className="mt-1 text-gray-600">
          To Time: {formValues.toTime || "N/A"}
        </p>
      </div>
      <p className="mt-1 text-gray-600">
        Room Block: {selectedBlock?.label || "N/A"}
      </p>
      <p className="mt-1 text-gray-600">
        Floor: {selectedFloor?.label || "N/A"}
      </p>
      <p className="mt-1 text-gray-600">
        Room Type: {selectedType?.label || "N/A"}
      </p>
      <p className="mt-1 text-gray-600">Capacity: {capacity || "N/A"}</p>
    </div>
  );
}

export default VenueDetails;
