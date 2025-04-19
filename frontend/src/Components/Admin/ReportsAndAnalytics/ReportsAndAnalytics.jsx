import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsAndAnalytics = () => {
  const [bookingData, setBookingData] = useState([]);
  const [conflictData, setConflictData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default: Current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default: Current year

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookings = await axios.get("http://localhost:8000/api/bookings");
      const conflicts = await axios.get("http://localhost:8000/api/conflicts");
      const rooms = await axios.get("http://localhost:8000/api/rooms");
      const users = await axios.get("http://localhost:8000/api/users");

      setBookingData(bookings.data);
      setConflictData(conflicts.data);
      setRoomData(rooms.data);
      setUserData(users.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Chart 1: Booking Status
  const bookingStatusData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Booking Status",
        data: [
          bookingData.filter((booking) => booking.Status === "Pending").length,
          bookingData.filter((booking) => booking.Status === "Approved").length,
          bookingData.filter((booking) => booking.Status === "Rejected").length,
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.2)", // Yellow
          "rgba(75, 192, 192, 0.2)", // Green
          "rgba(255, 99, 132, 0.2)", // Red
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)", // Yellow
          "rgba(75, 192, 192, 1)", // Green
          "rgba(255, 99, 132, 1)", // Red
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Conflict Status
  const conflictStatusData = {
    labels: ["Conflict", "Resolved"],
    datasets: [
      {
        label: "Conflict Status",
        data: [
          conflictData.filter((conflict) => conflict.Status === "Conflict")
            .length,
          conflictData.filter((conflict) => conflict.Status === "Resolved")
            .length,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // Red
          "rgba(75, 192, 192, 0.2)", // Green
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Red
          "rgba(75, 192, 192, 1)", // Green
        ],
        borderWidth: 1,
      },
    ],
  };

  const [roomCapacityDisplayOption, setRoomCapacityDisplayOption] =
    useState("top20");
  const sortedRoomCapacityData = [...roomData].sort(
    (a, b) => b.Capacity - a.Capacity
  );

  // Chart 3: Room Capacity
  const filteredRoomCapacityData =
    roomCapacityDisplayOption === "top20"
      ? sortedRoomCapacityData.slice(0, 20)
      : sortedRoomCapacityData.slice(-20);

  const roomCapacityChartData = {
    labels: filteredRoomCapacityData.map((room) => room.RoomID),
    datasets: [
      {
        label: "Room Capacity",
        data: filteredRoomCapacityData.map((room) => room.Capacity),
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue
        borderColor: "rgba(54, 162, 235, 1)", // Blue
        borderWidth: 1,
      },
    ],
  };

  // Chart 4: User Roles
  const userRoleData = {
    labels: ["Admin", "Faculty"],
    datasets: [
      {
        label: "User Roles",
        data: [
          userData.filter((user) => user.role === "admin").length,
          userData.filter((user) => user.role === "faculty").length,
        ],
        backgroundColor: [
          "rgba(153, 102, 255, 0.2)", // Purple
          "rgba(255, 159, 64, 0.2)", // Orange
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(255, 159, 64, 1)", // Orange
        ],
        borderWidth: 1,
      },
    ],
  };

  const roomsByTypeData = {
    labels: [...new Set(roomData.map((room) => room.Type))],
    datasets: [
      {
        label: "Total Rooms by Type",
        data: [...new Set(roomData.map((room) => room.Type))].map(
          (type) => roomData.filter((room) => room.Type === type).length
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // Red
          "rgba(54, 162, 235, 0.2)", // Blue
          "rgba(75, 192, 192, 0.2)", // Green
          "rgba(153, 102, 255, 0.2)", // Purple
          "rgba(255, 159, 64, 0.2)", // Orange
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Red
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(75, 192, 192, 1)", // Green
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(255, 159, 64, 1)", // Orange
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Total Number of Rooms by Room Block
  const roomsByBlockData = {
    labels: [...new Set(roomData.map((room) => room.Block))],
    datasets: [
      {
        label: "Total Rooms by Block",
        data: [...new Set(roomData.map((room) => room.Block))].map(
          (block) => roomData.filter((room) => room.Block === block).length
        ),
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)", // Blue
          "rgba(255, 159, 64, 0.2)", // Orange
          "rgba(75, 192, 192, 0.2)", // Green
          "rgba(153, 102, 255, 0.2)", // Purple
          "rgba(255, 99, 132, 0.2)", // Red
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 159, 64, 1)", // Orange
          "rgba(75, 192, 192, 1)", // Green
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(255, 99, 132, 1)", // Red
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart 5: Bookings by Faculty
  const bookingsByFacultyData = {
    labels: [...new Set(bookingData.map((booking) => booking.FacultyName))],
    datasets: [
      {
        label: "Bookings by Faculty",
        data: [
          ...new Set(bookingData.map((booking) => booking.FacultyName)),
        ].map(
          (faculty) =>
            bookingData.filter((booking) => booking.FacultyName === faculty)
              .length
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Green
        borderColor: "rgba(75, 192, 192, 1)", // Green
        borderWidth: 1,
      },
    ],
  };

  const [bookingsByRoomDisplayOption, setBookingsByRoomDisplayOption] =
    useState("top10");

  // Count the number of bookings per room
  const roomBookingCounts = bookingData.reduce((acc, booking) => {
    acc[booking.RoomID] = (acc[booking.RoomID] || 0) + 1;
    return acc;
  }, {});

  // Convert the counts into an array of { RoomID, Bookings } objects
  const roomBookingData = Object.keys(roomBookingCounts).map((RoomID) => ({
    RoomID,
    Bookings: roomBookingCounts[RoomID],
  }));

  // Sort the data based on the number of bookings
  const sortedBookingsByRoomData = [...roomBookingData].sort(
    (a, b) => b.Bookings - a.Bookings
  );

  // Get top 10 or least 10 based on selection
  const filteredBookingsByRoomData =
    bookingsByRoomDisplayOption === "top10"
      ? sortedBookingsByRoomData.slice(0, 10)
      : sortedBookingsByRoomData.slice(-10);

  // Chart data for bookings by room
  const bookingsByRoomChartData = {
    labels: filteredBookingsByRoomData.map((room) => room.RoomID),
    datasets: [
      {
        label: "Bookings by Room",
        data: filteredBookingsByRoomData.map((room) => room.Bookings),
        backgroundColor: [
            "rgba(54, 162, 235, 0.2)", // Blue
            "rgba(255, 159, 64, 0.2)", // Orange
            "rgba(75, 192, 192, 0.2)", // Green
            "rgba(153, 102, 255, 0.2)", // Purple
            "rgba(255, 99, 132, 0.2)", // Red
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)", // Blue
            "rgba(255, 159, 64, 1)", // Orange
            "rgba(75, 192, 192, 1)", // Green
            "rgba(153, 102, 255, 1)", // Purple
            "rgba(255, 99, 132, 1)", // Red
          ],
        borderWidth: 1,
      },
    ],
  };
  // Chart 7: Resource Requests by Faculty
  const resourceRequestsByFacultyData = {
    labels: [...new Set(bookingData.map((booking) => booking.FacultyName))],
    datasets: [
      {
        label: "Resource Requests by Faculty",
        data: [
          ...new Set(bookingData.map((booking) => booking.FacultyName)),
        ].map(
          (faculty) =>
            bookingData.filter(
              (booking) =>
                booking.FacultyName === faculty && booking.ResourceNeeds
            ).length
        ),
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Purple
        borderColor: "rgba(153, 102, 255, 1)", // Purple
        borderWidth: 1,
      },
    ],
  };

  // Chart 8: Bookings Over Time
  const bookingsOverTimeData = {
    labels: [
      ...new Set(
        bookingData.map((booking) =>
          new Date(booking.Date).toLocaleDateString()
        )
      ),
    ],
    datasets: [
      {
        label: "Bookings Over Time",
        data: [
          ...new Set(
            bookingData.map((booking) =>
              new Date(booking.Date).toLocaleDateString()
            )
          ),
        ].map(
          (date) =>
            bookingData.filter(
              (booking) => new Date(booking.Date).toLocaleDateString() === date
            ).length
        ),
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Red
        borderColor: "rgba(255, 99, 132, 1)", // Red
        borderWidth: 1,
      },
    ],
  };

  // Filter bookings by selected month and year
  const filterBookingsByDate = (bookings) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.Date);
      return (
        bookingDate.getMonth() + 1 === selectedMonth &&
        bookingDate.getFullYear() === selectedYear
      );
    });
  };

  // Chart 1: Block Utilization
  const blockUtilizationData = () => {
    const filteredBookings = filterBookingsByDate(bookingData);

    // Group bookings by block
    const blockBookings = filteredBookings.reduce((acc, booking) => {
      const block = roomData.find(
        (room) => room.RoomID === booking.RoomID
      )?.Block;
      if (block) {
        acc[block] = (acc[block] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate utilization percentage
    const blockUtilization = Object.keys(blockBookings).map((block) => {
      const totalRoomsInBlock = roomData.filter(
        (room) => room.Block === block
      ).length;
      const utilizationPercentage =
        (blockBookings[block] / totalRoomsInBlock) * 100;
      return { block, utilizationPercentage };
    });

    return {
      labels: blockUtilization.map((item) => item.block),
      datasets: [
        {
          label: "Block Utilization (%)",
          data: blockUtilization.map((item) => item.utilizationPercentage),
          backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue
          borderColor: "rgba(54, 162, 235, 1)", // Blue
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart 2: Room Utilization
  const roomUtilizationData = () => {
    const filteredBookings = filterBookingsByDate(bookingData);

    // Group bookings by room
    const roomBookings = filteredBookings.reduce((acc, booking) => {
      acc[booking.RoomID] = (acc[booking.RoomID] || 0) + 1;
      return acc;
    }, {});

    // Calculate utilization percentage
    const roomUtilization = Object.keys(roomBookings).map((roomID) => {
      const totalRooms = roomData.length;
      const utilizationPercentage = (roomBookings[roomID] / totalRooms) * 100;
      return { roomID, utilizationPercentage };
    });

    return {
      labels: roomUtilization.map((item) => item.roomID),
      datasets: [
        {
          label: "Room Utilization (%)",
          data: roomUtilization.map((item) => item.utilizationPercentage),
          backgroundColor: "rgba(255, 159, 64, 0.2)", // Orange
          borderColor: "rgba(255, 159, 64, 1)", // Orange
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart 3: Purpose Chart
  const purposeChartData = () => {
    const filteredBookings = filterBookingsByDate(bookingData);

    // Group bookings by purpose
    const purposeCounts = filteredBookings.reduce((acc, booking) => {
      acc[booking.Purpose] = (acc[booking.Purpose] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(purposeCounts),
      datasets: [
        {
          label: "Purpose of Bookings",
          data: Object.values(purposeCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)", // Red
            "rgba(75, 192, 192, 0.2)", // Green
            "rgba(153, 102, 255, 0.2)", // Purple
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)", // Red
            "rgba(75, 192, 192, 1)", // Green
            "rgba(153, 102, 255, 1)", // Purple
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart 1: Room Utilization by Block
  const roomUtilizationByBlockData = () => {
    const filteredBookings = filterBookingsByDate(bookingData);

    // Join bookings and rooms tables
    const blockUtilization = filteredBookings.reduce((acc, booking) => {
      const room = roomData.find((room) => room.RoomID === booking.RoomID);
      if (room) {
        acc[room.Block] = (acc[room.Block] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(blockUtilization),
      datasets: [
        {
          label: "Bookings by Block",
          data: Object.values(blockUtilization),
          backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue
          borderColor: "rgba(54, 162, 235, 1)", // Blue
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart 2: Booking Trends by Room Type
  const bookingTrendsByRoomTypeData = () => {
    const filteredBookings = filterBookingsByDate(bookingData);

    // Join bookings and rooms tables
    const roomTypeCounts = filteredBookings.reduce((acc, booking) => {
      const room = roomData.find((room) => room.RoomID === booking.RoomID);
      if (room) {
        acc[room.Type] = (acc[room.Type] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(roomTypeCounts),
      datasets: [
        {
          label: "Bookings by Room Type",
          data: Object.values(roomTypeCounts),
          backgroundColor: "rgba(255, 159, 64, 0.2)", // Orange
          borderColor: "rgba(255, 159, 64, 1)", // Orange
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart 3: Faculty Booking Trends by Room Type
  const facultyBookingTrendsByRoomTypeData = () => {
    const filteredBookings = filterBookingsByDate(bookingData);

    // Join bookings, rooms, and users tables
    const facultyRoomTypeCounts = filteredBookings.reduce((acc, booking) => {
      const room = roomData.find((room) => room.RoomID === booking.RoomID);
      const faculty = userData.find(
        (user) => user.faculty_id === booking.FacultyID
      );
      if (room && faculty) {
        const key = `${faculty.faculty_name} - ${room.Type}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(facultyRoomTypeCounts),
      datasets: [
        {
          label: "Bookings by Faculty and Room Type",
          data: Object.values(facultyRoomTypeCounts),
          backgroundColor: "rgba(153, 102, 255, 0.2)", // Purple
          borderColor: "rgba(153, 102, 255, 1)", // Purple
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart 4: Conflict Resolution Time by Room
  const conflictResolutionTimeByRoomData = () => {
    // Join conflicts and rooms tables
    const roomConflictResolutionTime = conflictData.reduce((acc, conflict) => {
      const room = roomData.find((room) => room.RoomID === conflict.RoomID);
      if (room) {
        const resolutionTime =
          (new Date(conflict.updatedAt) - new Date(conflict.createdAt)) /
          (1000 * 60); // in minutes
        acc[room.RoomID] = (acc[room.RoomID] || 0) + resolutionTime;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(roomConflictResolutionTime),
      datasets: [
        {
          label: "Conflict Resolution Time (minutes)",
          data: Object.values(roomConflictResolutionTime),
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Red
          borderColor: "rgba(255, 99, 132, 1)", // Red
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Existing Charts */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Booking Status</h2>
          <Bar data={bookingStatusData} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Conflict Status</h2>
          <div className="flex justify-center h-80">
            <Pie data={conflictStatusData} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Room Capacity</h2>
            <div className="flex items-center">
              <label htmlFor="roomCapacityDisplayOption" className="mr-2">
                Show:
              </label>
              <select
                id="roomCapacityDisplayOption"
                value={roomCapacityDisplayOption}
                onChange={(e) => setRoomCapacityDisplayOption(e.target.value)}
                className="p-1 border rounded"
              >
                <option value="top20">Top 20</option>
                <option value="least20">Least 20</option>
              </select>
            </div>
          </div>
          <Line data={roomCapacityChartData} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">User Roles</h2>
          <div className="flex justify-center  h-80">
            <Doughnut data={userRoleData} />
          </div>
        </div>
        {/* Chart 1: Total Number of Rooms by Room Type */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Total Rooms by Type</h2>
          <Bar data={roomsByTypeData} />
        </div>

        {/* Chart 2: Total Number of Rooms by Room Block */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Total Rooms by Block</h2>
          <Bar data={roomsByBlockData} />
        </div>
        {/* Additional Charts */}

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Bookings by Room</h2>
            <div className="flex items-center">
              <label htmlFor="bookingsByRoomDisplayOption" className="mr-2">
                Show:
              </label>
              <select
                id="bookingsByRoomDisplayOption"
                value={bookingsByRoomDisplayOption}
                onChange={(e) => setBookingsByRoomDisplayOption(e.target.value)}
                className="p-1 border rounded"
              >
                <option value="top10">Top 10</option>
                <option value="least10">Least 10</option>
              </select>
            </div>
          </div>
          <Bar data={bookingsByRoomChartData} />
        </div>
        {/* <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            Resource Requests by Faculty
          </h2>
          <Bar data={resourceRequestsByFacultyData} />
        </div> */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Bookings Over Time</h2>
          <Line data={bookingsOverTimeData} />
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Filters for Month and Year */}
        <div className="flex space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Block Utilization Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Block Utilization</h2>
            <Bar data={blockUtilizationData()} />
          </div>

          {/* Room Utilization Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Room Utilization</h2>
            <Bar data={roomUtilizationData()} />
          </div>

          {/* Purpose Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Purpose of Bookings</h2>
            <div className="flex justify-center h-80">
              <Pie data={purposeChartData()} />
            </div>
          </div>
          {/* Faculty Booking Trends by Room Type */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">
              Faculty Booking Trends by Room Type
            </h2>
            <Bar data={facultyBookingTrendsByRoomTypeData()} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Room Utilization by Block */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">
              Room Utilization by Block
            </h2>
            <Bar data={roomUtilizationByBlockData()} />
          </div>

          {/* Booking Trends by Room Type */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">
              Booking Trends by Room Type
            </h2>
            <Bar data={bookingTrendsByRoomTypeData()} />
          </div>

          {/* Resource Requests by Faculty */}
        </div>
      </div>
    </div>
  );
};

export default ReportsAndAnalytics;
