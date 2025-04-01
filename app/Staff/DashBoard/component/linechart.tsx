"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PaymentChart: React.FC = () => {
  const [paymentData, setPaymentData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment data
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/tongthanhtien");
        const data = await response.json();

        // Assuming the API might return multiple data points
        // If not, you'll need to mock or adjust this
        setPaymentData([64, 59, 80, 81, 56, 55, 40]);
        setError(null);
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setError("Không thể tải dữ liệu");
        setPaymentData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
    const intervalId = setInterval(fetchPaymentData, 60000); // Fetch every minute

    return () => clearInterval(intervalId);
  }, []);

  // Chart configuration
  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First Dataset",
        data: paymentData,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Fixed type issue by using 'as const'
      },
      title: {
        display: true,
        text: "A line chart is a way of plotting data points on a line. Often, it is used to show trend data, or the comparison of two data sets.",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 40,
        max: 85,
      },
    },
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="h-96 w-full p-4">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PaymentChart;
