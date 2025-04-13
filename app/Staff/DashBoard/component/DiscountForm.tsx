"use client";

import React from "react";
import { useForm } from "react-hook-form";

interface DiscountFormProps {
  discount?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function DiscountForm({
  discount,
  onSubmit,
  onCancel,
}: DiscountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: discount?.code || "",
      description: discount?.description || "",
      discountType: discount?.discountType || "PERCENTAGE",
      value: discount?.value || "",
      minOrderValue: discount?.minOrderValue || "",
      maxDiscount: discount?.maxDiscount || "",
      startDate: discount?.startDate
        ? new Date(discount.startDate).toISOString().split("T")[0]
        : "",
      endDate: discount?.endDate
        ? new Date(discount.endDate).toISOString().split("T")[0]
        : "",
      usageLimit: discount?.usageLimit || "",
      isActive: discount?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        {discount ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mã giảm giá
          </label>
          <input
            type="text"
            {...register("code", { required: "Vui lòng nhập mã giảm giá" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.code && <p className="mt-1 text-sm text-red-600"></p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loại giảm giá
          </label>
          <select
            {...register("discountType")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="PERCENTAGE">Phần trăm</option>
            <option value="FIXED_AMOUNT">Số tiền cố định</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giá trị
          </label>
          <input
            type="number"
            {...register("value", {
              required: "Vui lòng nhập giá trị giảm giá",
              min: {
                value: 0,
                message: "Giá trị phải lớn hơn 0",
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.value && <p className="mt-1 text-sm text-red-600"></p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giá trị đơn hàng tối thiểu
          </label>
          <input
            type="number"
            {...register("minOrderValue")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giảm giá tối đa
          </label>
          <input
            type="number"
            {...register("maxDiscount")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giới hạn sử dụng
          </label>
          <input
            type="number"
            {...register("usageLimit")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            {...register("startDate", {
              required: "Vui lòng chọn ngày bắt đầu",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày kết thúc
          </label>
          <input
            type="date"
            {...register("endDate", {
              required: "Vui lòng chọn ngày kết thúc",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Kích hoạt mã giảm giá
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {discount ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
}
