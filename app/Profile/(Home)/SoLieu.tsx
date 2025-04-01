// pages/index.js
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function SoLieu() {
  const [weeklyBuyers, setWeeklyBuyers] = useState(0);
  const [dailyBuyers, setDailyBuyers] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [branches, setBranches] = useState(0);

  useEffect(() => {
    // Animate weekly buyers counter
    const weeklyBuyersInterval = setInterval(() => {
      setWeeklyBuyers((prev) => {
        if (prev < 2355) return prev + Math.ceil((2355 - prev) / 20);
        clearInterval(weeklyBuyersInterval);
        return 2355;
      });
    }, 50);

    // Animate daily buyers counter
    const dailyBuyersInterval = setInterval(() => {
      setDailyBuyers((prev) => {
        if (prev < 350) return prev + Math.ceil((350 - prev) / 15);
        clearInterval(dailyBuyersInterval);
        return 350;
      });
    }, 50);

    // Animate total reviews counter
    const totalReviewsInterval = setInterval(() => {
      setTotalReviews((prev) => {
        if (prev < 10927) return prev + Math.ceil((10927 - prev) / 25);
        clearInterval(totalReviewsInterval);
        return 10927;
      });
    }, 30);

    // Animate branches counter
    const branchesInterval = setInterval(() => {
      setBranches((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(branchesInterval);
        return 4;
      });
    }, 300);

    return () => {
      clearInterval(weeklyBuyersInterval);
      clearInterval(dailyBuyersInterval);
      clearInterval(totalReviewsInterval);
      clearInterval(branchesInterval);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Shop Statistics</title>
        <meta name="description" content="Shop statistics dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top navigation bar */}

      {/* Statistics section */}
      <section className="bg-red-200 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Weekly buyers */}
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-lg">Người mua trong tuần</p>
                <p className="text-white text-3xl font-bold">
                  {weeklyBuyers.toLocaleString()} +
                </p>
              </div>
            </div>

            {/* Daily buyers */}
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-lg">Người mua trong ngày</p>
                <p className="text-white text-3xl font-bold">
                  {dailyBuyers.toLocaleString()} +
                </p>
              </div>
            </div>

            {/* Total reviews */}
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-lg">
                  Người đánh giá tốt trên các nền tảng
                </p>
                <p className="text-white text-3xl font-bold">
                  {totalReviews.toLocaleString()} +
                </p>
              </div>
            </div>

            {/* Branches */}
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-lg">Chi nhánh toàn quốc</p>
                <p className="text-white text-3xl font-bold">
                  {branches.toLocaleString()} +
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content would go here */}
      <main className="container mx-auto p-4">{/* Your main content */}</main>
      
    </div>
  );
}
