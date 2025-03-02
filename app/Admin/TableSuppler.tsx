"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

interface TableSupplierProps {
  onEdit: (nhacungcap: NhaCungCap) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
  selectedItems?: number[];
  onSelectItem?: (id: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

export default function TableSupplier({
  onEdit,
  onDelete,
  reloadKey,
  selectedItems = [],
  onSelectItem = () => {},
  onSelectAll = () => {},
}: TableSupplierProps) {
  const [nhacungcapList, setNhacungcapList] = useState<NhaCungCap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNhaCungCap = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/nhacungcap");
      const data = await response.json();
      setNhacungcapList(data);
    } catch (err) {
      console.error("Failed to fetch nha cung cap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNhaCungCap();
  }, [reloadKey]);

  const filteredList = nhacungcapList.filter(
    (item) =>
      item.tennhacungcap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sodienthoai.includes(searchTerm) ||
      item.diachi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected =
    filteredList.length > 0 && selectedItems.length === filteredList.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < filteredList.length;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div className="p-4">
        <input
          type="text"
          placeholder="Tìm kiếm nhà cung cấp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left">
              <div className="flex items-center">
                <Checkbox
                  checked={allSelected || someSelected}
                  onCheckedChange={(checked: boolean) => onSelectAll(checked)}
                  className={
                    someSelected ? "data-[state=checked]:bg-gray-500" : ""
                  }
                />
              </div>
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên nhà cung cấp
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số điện thoại
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Địa chỉ
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={8} className="px-3 py-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                  <span className="ml-2">Đang tải...</span>
                </div>
              </td>
            </tr>
          ) : filteredList.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                {searchTerm
                  ? "Không tìm thấy nhà cung cấp phù hợp"
                  : "Chưa có nhà cung cấp nào"}
              </td>
            </tr>
          ) : (
            filteredList.map((item, index) => (
              <tr
                key={item.idnhacungcap}
                className={`${
                  selectedItems.includes(item.idnhacungcap)
                    ? "bg-blue-50"
                    : index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedItems.includes(item.idnhacungcap)}
                      onCheckedChange={(checked: boolean) =>
                        onSelectItem(item.idnhacungcap, checked)
                      }
                    />
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.idnhacungcap}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.tennhacungcap}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.sodienthoai}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {item.diachi}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {item.email}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.trangthai
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp"}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="text-xs py-0 h-7"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item.idnhacungcap)}
                      className="text-xs py-0 h-7"
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
