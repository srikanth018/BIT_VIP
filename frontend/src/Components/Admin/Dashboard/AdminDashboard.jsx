import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  FaBuilding,
  FaCalendarCheck,
  FaChalkboardTeacher,
  FaDesktop,
  FaMicrophone,
} from "react-icons/fa";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

import { ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [overviewCards, setOverviewCards] = useState([
    {
      title: "Total Bookings",
      value: 0,
      icon: <FaCalendarCheck className="w-8 h-8" />,
    },
    {
      title: "Academic Classes",
      value: 0,
      icon: <FaChalkboardTeacher className="w-8 h-8" />,
    },
    {
      title: "Computer Labs",
      value: 0,
      icon: <FaDesktop className="w-8 h-8" />,
    },
    {
      title: "Seminar Halls",
      value: 0,
      icon: <FaBuilding className="w-8 h-8" />,
    },
    {
      title: "Auditorium",
      value: 0,
      icon: <FaMicrophone className="w-8 h-8" />,
    },
  ]);

  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [chartData2, setChartData2] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/getCardData");
        const data = await response.json();
        setOverviewCards([
          { ...overviewCards[0], value: data.totalBookings },
          { ...overviewCards[1], value: data.academicClasses },
          { ...overviewCards[2], value: data.computerLabs },
          { ...overviewCards[3], value: data.seminarHalls },
          { ...overviewCards[4], value: data.auditorium },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/todayBookings");
        const result = await response.json();
        setChartData({ labels: result.labels, data: result.data });
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Number of Bookings",
        data: chartData.data,
        backgroundColor: "rgb(224 242 254)", // Tailwind bg-sky-100
        borderColor: "rgb(56 189 248)", // Tailwind border-sky-400
        borderWidth: 2,
        borderRadius: 7,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Today’s Room Booking Statistics" },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/todayBookingsStatus"
        );
        const result = await response.json();
        setChartData2({
          labels: Object.keys(result),
          data: Object.values(result),
        });
      } catch (error) {
        console.error("Error fetching booking status data:", error);
      }
    };
    fetchData();
  }, []);

  const data2 = {
    labels: chartData2.labels,
    datasets: [
      {
        label: "Bookings by Status",
        data: chartData2.data,
        backgroundColor: [
          "rgb(254 249 195)",
          "rgb(220 252 231)",
          "rgb(254 202 202)",
        ], // Tailwind bg-yellow-100, bg-green-100, bg-red-100
        borderColor: ["rgb(234 179 8)", "rgb(34 197 94)", "rgb(239 68 68)"], // Tailwind border-yellow-500, border-green-500, border-red-500
        borderWidth: 2,
      },
    ],
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Today's Bookings by Status" },
    },
  };

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-sky-800 mb-4">Overview </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-wrap justify-between gap-4">
          {overviewCards.map((card, index) => (
            <div
              key={index}
              className="p-6 rounded-lg w-full sm:w-[48%] lg:w-[30%] xl:w-[18%] shadow-md border bg-sky-100 border-sky-400 text-sky-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
                <div className="text-sky-700">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-sky-800 mb-4 mt-6">
        Detailed Charts for Today Bookings{" "}
      </h1>
      <div className="flex justify-around items-stretch space-x-4">
        <div className="flex-1 p-4 bg-white shadow-lg rounded-lg flex items-center">
          <Bar data={data} options={options} />
        </div>
        <div className="flex-1 p-4 bg-white shadow-lg rounded-lg flex items-center justify-center">
          <div className="w-80 h-80">
            <Doughnut data={data2} options={options2} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
