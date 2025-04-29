"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { formatCurrency } from "../utils/currency";
import { AdministrativeData } from "./AdministrativeData"; // Import the new component

interface CartSummaryProps {
  selectedItemsCount: number;
  totalItemsCount: number;
  total: number;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onCheckout: () => void;
  processing: boolean;
  onApplyDiscount: (discountInfo: DiscountInfo | null) => void;
  onAddressChange: (addressId: number) => void;
}

interface DiscountInfo {
  idDiscount: number;
  code: string;
  discountType: string;
  value: number;
  calculatedDiscount: number;
  maxDiscount?: number | null;
}

interface UserInfo {
  idUsers: number;
  Tentaikhoan: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  Email: string;
}

interface Address {
  idDiaChi: number;
  diaChiChiTiet: string;
  thanhPho: string;
  quanHuyen: string;
  phuongXa: string;
  soDienThoai: string;
  tenNguoiNhan: string;
  macDinh: boolean;
}

export const CartSummary = ({
  selectedItemsCount,
  totalItemsCount,
  total,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout,
  processing,
  onApplyDiscount,
  onAddressChange,
}: CartSummaryProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(
    null
  );
  const [discountError, setDiscountError] = useState("");
  const [availableDiscounts, setAvailableDiscounts] = useState<any[]>([]);
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressUpdateMessage, setAddressUpdateMessage] = useState("");

  // New address form state
  const [newAddress, setNewAddress] = useState({
    diaChiChiTiet: "",
    thanhPho: "",
    quanHuyen: "",
    phuongXa: "",
    soDienThoai: "",
    tenNguoiNhan: "",
    macDinh: false,
  });

  // Fetch user info and addresses when component mounts
  useEffect(() => {
    fetchUserInfo();
    fetchSavedAddresses();
  }, []);

  // Update parent component whenever appliedDiscount changes
  useEffect(() => {
    onApplyDiscount(appliedDiscount);
  }, [appliedDiscount, onApplyDiscount]);

  // Update parent component with the address ID, not the formatted address string
  useEffect(() => {
    if (selectedAddressId) {
      console.log(
        "CartSummary - Selected address ID changed:",
        selectedAddressId
      );
      onAddressChange(selectedAddressId);
    }
  }, [selectedAddressId, onAddressChange]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user/update");
      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }
      const userData = await response.json();
      setUserInfo(userData);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const response = await fetch("/api/Address");

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();
      setSavedAddresses(data.addresses || []);

      // Set default address if available
      const defaultAddress = data.addresses?.find(
        (addr: Address) => addr.macDinh
      );
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.idDiaChi);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleNewAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress((prev) => ({
      ...prev,
      macDinh: e.target.checked,
    }));
  };

  // Update new address with administrative data
  const handleLocationChange = (location: {
    province: string;
    district: string;
    ward: string;
  }) => {
    setNewAddress((prev) => ({
      ...prev,
      thanhPho: location.province,
      quanHuyen: location.district,
      phuongXa: location.ward,
    }));
  };

  const saveNewAddress = async () => {
    // Validate form
    if (
      !newAddress.diaChiChiTiet ||
      !newAddress.thanhPho ||
      !newAddress.quanHuyen ||
      !newAddress.soDienThoai ||
      !newAddress.tenNguoiNhan
    ) {
      setAddressUpdateMessage("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      const response = await fetch("/api/Address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      const data = await response.json();

      // Refresh the address list
      fetchSavedAddresses();

      // Select the new address
      setSelectedAddressId(data.address.idDiaChi);

      // Hide the form
      setShowNewAddressForm(false);

      // Reset form
      setNewAddress({
        diaChiChiTiet: "",
        thanhPho: "",
        quanHuyen: "",
        phuongXa: "",
        soDienThoai: "",
        tenNguoiNhan: "",
        macDinh: false,
      });

      setAddressUpdateMessage("Địa chỉ đã được thêm thành công");

      // Clear message after 3 seconds
      setTimeout(() => {
        setAddressUpdateMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving address:", error);
      setAddressUpdateMessage("Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  const setAddressAsDefault = async (addressId: number) => {
    try {
      const response = await fetch(`/api/Address/${addressId}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to set default address");
      }

      // Refresh the address list
      fetchSavedAddresses();

      setAddressUpdateMessage("Đã đặt địa chỉ mặc định");

      // Clear message after 3 seconds
      setTimeout(() => {
        setAddressUpdateMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error setting default address:", error);
      setAddressUpdateMessage(
        "Không thể đặt địa chỉ mặc định. Vui lòng thử lại."
      );
    }
  };

  const deleteAddress = async (addressId: number) => {
    if (confirm("Bạn có chắc muốn xóa địa chỉ này không?")) {
      try {
        const response = await fetch(`/api/Address/${addressId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete address");
        }

        // Refresh the address list
        fetchSavedAddresses();

        // If the deleted address was selected, reset selection
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }

        setAddressUpdateMessage("Địa chỉ đã được xóa");

        // Clear message after 3 seconds
        setTimeout(() => {
          setAddressUpdateMessage("");
        }, 3000);
      } catch (error) {
        console.error("Error deleting address:", error);
        setAddressUpdateMessage("Không thể xóa địa chỉ. Vui lòng thử lại.");
      }
    }
  };

  const fetchAvailableDiscounts = async () => {
    try {
      setIsLoadingDiscounts(true);
      const response = await fetch("/api/discounts");
      const data = await response.json();
      setAvailableDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setIsLoadingDiscounts(false);
    }
  };

  const applyDiscountCode = async (code: string) => {
    try {
      setDiscountError("");
      const response = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderTotal: total }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDiscountError(data.error);
        setAppliedDiscount(null);
        return;
      }

      // Ensure we store the complete discount information
      const discountInfo: DiscountInfo = {
        idDiscount: data.discount.idDiscount,
        code: data.discount.code,
        discountType: data.discount.discountType,
        value: data.discount.value,
        calculatedDiscount: data.discount.calculatedDiscount,
        maxDiscount: data.discount.maxDiscount,
      };

      setAppliedDiscount(discountInfo);
    } catch (error) {
      console.error("Error applying discount:", error);
      setDiscountError("Error applying discount code");
    }
  };

  const finalTotal = appliedDiscount
    ? total - appliedDiscount.calculatedDiscount
    : total;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Thông tin đơn hàng
      </h2>

      <div className="space-y-4">
        {/* Address Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>

          {isLoadingAddresses ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
              <span className="text-gray-500">Đang tải thông tin...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Saved addresses list */}
              {savedAddresses.length > 0 ? (
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.idDiaChi}
                      className={`border rounded-lg p-3 ${
                        selectedAddressId === address.idDiaChi
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <input
                            type="radio"
                            id={`address-${address.idDiaChi}`}
                            name="selected-address"
                            checked={selectedAddressId === address.idDiaChi}
                            onChange={() => {
                              setSelectedAddressId(address.idDiaChi);
                              console.log(
                                "Address selected:",
                                address.idDiaChi
                              );
                            }}
                            className="mt-1"
                          />
                          <div>
                            <label
                              htmlFor={`address-${address.idDiaChi}`}
                              className="font-medium"
                            >
                              {address.tenNguoiNhan} - {address.soDienThoai}
                              {address.macDinh && (
                                <span className="ml-2 text-sm text-blue-600 px-2 py-1 bg-blue-100 rounded-full">
                                  Mặc định
                                </span>
                              )}
                            </label>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.diaChiChiTiet}, {address.phuongXa},{" "}
                              {address.quanHuyen}, {address.thanhPho}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!address.macDinh && (
                            <button
                              onClick={() =>
                                setAddressAsDefault(address.idDiaChi)
                              }
                              className="text-blue-600 text-sm hover:underline"
                            >
                              Đặt mặc định
                            </button>
                          )}
                          <button
                            onClick={() => deleteAddress(address.idDiaChi)}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Bạn chưa có địa chỉ giao hàng nào
                </p>
              )}

              {/* Link to add new address */}
              {!showNewAddressForm ? (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-blue-600 text-sm hover:underline flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Thêm địa chỉ mới
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <h4 className="font-medium mb-3">Địa chỉ mới</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên người nhận
                        </label>
                        <input
                          type="text"
                          name="tenNguoiNhan"
                          value={newAddress.tenNguoiNhan}
                          onChange={handleNewAddressChange}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Họ tên người nhận"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          name="soDienThoai"
                          value={newAddress.soDienThoai}
                          onChange={handleNewAddressChange}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Số điện thoại"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ chi tiết
                      </label>
                      <textarea
                        name="diaChiChiTiet"
                        value={newAddress.diaChiChiTiet}
                        onChange={handleNewAddressChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Số nhà, tên đường, tòa nhà..."
                      />
                    </div>

                    {/* Replace manual input fields with dropdown selectors */}
                    <AdministrativeData
                      onLocationChange={handleLocationChange}
                      initialProvince={newAddress.thanhPho}
                      initialDistrict={newAddress.quanHuyen}
                      initialWard={newAddress.phuongXa}
                    />

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="default-address"
                        checked={newAddress.macDinh}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="default-address"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={saveNewAddress}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Lưu địa chỉ
                      </button>
                      <button
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {addressUpdateMessage && (
                <p
                  className={`text-sm mt-1 ${
                    addressUpdateMessage.includes("không") ||
                    addressUpdateMessage.includes("Vui lòng")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {addressUpdateMessage}
                </p>
              )}

              {/* Add visual confirmation of address selection */}
              {selectedAddressId && (
                <div className="mt-2 bg-green-50 p-2 rounded-md border border-green-200">
                  <p className="text-green-600 text-sm">
                    ✓ Đã chọn địa chỉ giao hàng
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Số sản phẩm đã chọn:</span>
          <span className="font-medium">
            {selectedItemsCount}/{totalItemsCount}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tạm tính:</span>
          <span className="font-medium">{formatCurrency(total)}</span>
        </div>

        {/* Discount Code Section */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Nhập mã giảm giá"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => applyDiscountCode(discountCode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!discountCode}
            >
              Áp dụng
            </button>
          </div>

          {discountError && (
            <p className="text-red-500 text-sm">{discountError}</p>
          )}

          {appliedDiscount && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-700">
                Đã áp dụng mã giảm giá: {appliedDiscount.code}
              </p>
              <p className="text-sm text-green-600">
                Tiết kiệm: {formatCurrency(appliedDiscount.calculatedDiscount)}
              </p>
              <button
                onClick={() => setAppliedDiscount(null)}
                className="text-red-500 text-sm mt-1 hover:underline"
              >
                Xóa mã
              </button>
            </div>
          )}

          {/* Available Discounts */}
          <button
            onClick={fetchAvailableDiscounts}
            className="text-blue-600 text-sm hover:underline"
          >
            Xem các mã giảm giá hiện có
          </button>

          {isLoadingDiscounts ? (
            <p>Đang tải mã giảm giá...</p>
          ) : (
            availableDiscounts.length > 0 && (
              <div className="mt-2 space-y-2">
                {availableDiscounts.map((discount) => (
                  <div
                    key={discount.idDiscount}
                    className="border p-2 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setDiscountCode(discount.code);
                      applyDiscountCode(discount.code);
                    }}
                  >
                    <p className="font-medium">{discount.code}</p>
                    <p className="text-sm text-gray-600">
                      {discount.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Giảm:{" "}
                      {discount.discountType === "PERCENTAGE"
                        ? `${discount.value}%`
                        : formatCurrency(Number(discount.value))}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển:</span>
          <span className="text-green-600 font-medium">Miễn phí</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Tổng thanh toán:</span>
            <span className="text-blue-600 text-lg">
              {formatCurrency(finalTotal)}
            </span>
          </div>
          {appliedDiscount && (
            <div className="text-sm text-gray-500 text-right">
              Đã giảm: {formatCurrency(appliedDiscount.calculatedDiscount)}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium mb-2">
            Phương thức thanh toán:
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">Thanh toán khi nhận hàng</p>
                <p className="text-sm text-gray-500">
                  Thanh toán bằng tiền mặt khi nhận hàng
                </p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">Thanh toán chuyển khoản</p>
                <p className="text-sm text-gray-500">
                  Chuyển khoản ngân hàng & tải ảnh chứng minh
                </p>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">Thanh toán qua Stripe</p>
                <p className="text-sm text-gray-500">
                  Thanh toán an toàn bằng thẻ tín dụng/ghi nợ
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Email notification info */}
        <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <p className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Email xác nhận đơn hàng sẽ được gửi đến địa chỉ email của bạn sau
            khi đặt hàng thành công.
          </p>
        </div>

        <button
          onClick={onCheckout}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
            processing ||
            selectedItemsCount === 0 ||
            !paymentMethod ||
            !selectedAddressId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={
            processing ||
            selectedItemsCount === 0 ||
            !paymentMethod ||
            !selectedAddressId
          }
        >
          {processing ? "Đang xử lý..." : "Tiến hành thanh toán"}
        </button>

        {!selectedAddressId && (
          <p className="text-red-500 text-sm text-center">
            Vui lòng chọn hoặc thêm địa chỉ giao hàng trước khi tiến hành thanh
            toán
          </p>
        )}
      </div>
    </div>
  );
};

export default CartSummary;
