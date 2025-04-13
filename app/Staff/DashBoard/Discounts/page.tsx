import React from "react";
import DiscountList from "../component/DiscountList";
 

export default function DiscountsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý mã giảm giá</h1>
      <DiscountList />
    </div>
  );
}
