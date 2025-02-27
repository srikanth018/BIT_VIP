import React, { useEffect, useState } from "react";
import Select from "react-select";
import VenueDetails from "./VenueDetails";

function BookSlots() {
  const [roomBlock, setRoomBlock] = useState(null);

  const [roomData, setRoomData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [capacity, setCapacity] = useState(null);

  const [formValues, setFormValues] = useState({
    date: "",
    fromTime: "",
    toTime: "",
  });
  const [errors, setErrors] = useState({});

  const roomBlockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  useEffect(() => {
    // Fetch room data from the API
    const fetchRoomData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/rooms");
        const data = await response.json();

        setRoomData(data);

        // Extract unique options for each dropdown
        const uniqueTypes = [...new Set(data.map((room) => room.Type))].map(
          (type) => ({ value: type, label: type })
        );
        const uniqueFloors = [...new Set(data.map((room) => room.Floor))].map(
          (floor) => ({ value: floor, label: `Floor ${floor}` })
        );
        const uniqueBlocks = [...new Set(data.map((room) => room.Block))].map(
          (block) => ({ value: block, label: block })
        );

        setTypeOptions(uniqueTypes);
        setFloorOptions(uniqueFloors);
        setBlockOptions(uniqueBlocks);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "3px",
      fontSize: "1.125rem",
      borderWidth: "2px",
      borderColor: state.isFocused ? "#0ea5e9" : "#38bdf8",
      boxShadow: state.isFocused
        ? "0 0 4px 2px rgba(14, 165, 233, 0.3)"
        : "none",
      "&:hover": { borderColor: "#0ea5e9" },
      borderRadius: "8px",
      width: "100%",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#0ea5e9",
      // fontWeight: "600",
      fontSize: "15px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#0284c7",
      fontWeight: "600",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formValues.date) newErrors.date = "Date is required.";
    if (!formValues.fromTime) newErrors.fromTime = "From Time is required.";
    if (!formValues.toTime) newErrors.toTime = "To Time is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      // Proceed with submission
      console.log("Form submitted successfully!", formValues, roomBlock);
    }
  };

  return (
    <>
      <main className="p-8 min-h-screen">
        <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="mb-1">
            {/* <h1 className="text-2xl font-cambria font-semibold text-gray-800">
              Book Slots
            </h1> */}
            <p className="text-gray-500 text-sm">
              Fields marked with <span className="text-red-500">*</span> are
              mandatory.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Mandatory Fields */}
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formValues.date}
                onChange={handleInputChange}
                className={`p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border ${
                  errors.date ? "border-red-500" : "border-sky-500"
                } focus:outline-none focus:ring-2 ${
                  errors.date ? "focus:ring-red-500" : "focus:ring-sky-500"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                From Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="fromTime"
                value={formValues.fromTime}
                onChange={handleInputChange}
                className={`p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border ${
                  errors.fromTime ? "border-red-500" : "border-sky-500"
                } focus:outline-none focus:ring-2 ${
                  errors.fromTime ? "focus:ring-red-500" : "focus:ring-sky-500"
                }`}
              />
              {errors.fromTime && (
                <p className="text-red-500 text-sm mt-1">{errors.fromTime}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                To Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="toTime"
                value={formValues.toTime}
                onChange={handleInputChange}
                className={`p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border ${
                  errors.toTime ? "border-red-500" : "border-sky-500"
                } focus:outline-none focus:ring-2 ${
                  errors.toTime ? "focus:ring-red-500" : "focus:ring-sky-500"
                }`}
              />
              {errors.toTime && (
                <p className="text-red-500 text-sm mt-1">{errors.toTime}</p>
              )}
            </div>
          </div>

          {/* Non-Mandatory Fields */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                Room Block (Optional)
              </label>
              <Select
                options={blockOptions}
                value={selectedBlock}
                onChange={setSelectedBlock}
                placeholder="Select Block"
                styles={customStyles}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                Type (Optional)
              </label>
              <Select
                options={typeOptions}
                value={selectedType}
                onChange={setSelectedType}
                placeholder="Select Type"
                styles={customStyles}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                Floor (Optional)
              </label>
              <Select
                options={floorOptions}
                value={selectedFloor}
                onChange={setSelectedFloor}
                placeholder="Select Floor"
                styles={customStyles}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                Capacity (Optional)
              </label>
              <input
                type="number"
                placeholder="Enter Capacity"
                className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 placeholder:text-base placeholder:font-normal border-sky-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          {formValues.date && formValues.fromTime && formValues.toTime && (
            <VenueDetails
              formValues={formValues}
              selectedBlock={selectedBlock}
              selectedType={selectedType}
              selectedFloor={selectedFloor}
              capacity={capacity}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default BookSlots;
