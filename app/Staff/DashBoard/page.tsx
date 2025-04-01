// app/staff/page.tsx
import React from "react";
import PaymentChart from "./component/linechart";

const StaffPage = () => {
  return (
    <div>
      {/* Your staff dashboard content */}
      <h1 className="text-2xl font-bold">Staff Dashboard</h1>
      <PaymentChart />

    </div>
  );
};

export default StaffPage;
