import React, { useState, useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
 formatCurrency 
import { X } from "lucide-react";
import { formatCurrency } from "./utils/currency";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (discountInfo: any) => void;
  orderTotal: number;
}

interface Discount {
  idDiscount: number;
  code: string;
  description: string;
  discountType: string;
  value: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
}

export const DiscountModal = ({
  isOpen,
  onClose,
  onApplyDiscount,
  orderTotal,
}: DiscountModalProps) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchDiscounts();
    }
  }, [isOpen]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/discounts");
      const data = await response.json();
      setDiscounts(data);
    } catch (err) {
      setError("Failed to load discounts");
      console.error("Error fetching discounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = async (code: string) => {
    try {
      const response = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderTotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      onApplyDiscount(data.discount);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to apply discount");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Available Discounts</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {loading && <p className="text-center">Loading discounts...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading &&
              !error &&
              discounts.map((discount) => (
                <div
                  key={discount.idDiscount}
                  className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleApplyDiscount(discount.code)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{discount.code}</h3>
                      <p className="text-sm text-gray-600">
                        {discount.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {discount.discountType === "PERCENTAGE"
                          ? `${discount.value}% OFF`
                          : formatCurrency(discount.value)}
                      </p>
                      {discount.maxDiscount && (
                        <p className="text-xs text-gray-500">
                          Max: {formatCurrency(discount.maxDiscount)}
                        </p>
                      )}
                    </div>
                  </div>
                  {discount.minOrderValue && (
                    <p className="text-xs text-gray-500">
                      Min order: {formatCurrency(discount.minOrderValue)}
                    </p>
                  )}
                  {discount.usageLimit && (
                    <p className="text-xs text-gray-500">
                      Used: {discount.usedCount}/{discount.usageLimit}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DiscountModal;
