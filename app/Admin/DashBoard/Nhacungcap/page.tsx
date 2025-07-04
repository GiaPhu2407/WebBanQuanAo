"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import TableSupplier from "../../TableSuppler";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExportButtons from "./XuatExcel/exportButton";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

export default function NhaCungCapManagementPage() {
  // State cho phân trang
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });

  const [formData, setFormData] = useState<NhaCungCap>({
    idnhacungcap: 0,
    tennhacungcap: "",
    sodienthoai: "",
    diachi: "",
    email: "",
    trangthai: true,
  });

  const [nhacungcapList, setNhacungcapList] = useState<NhaCungCap[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentNhaCungCapId, setCurrentNhaCungCapId] = useState<number | null>(
    null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [allSelectedItems, setAllSelectedItems] = useState<{
    [key: number]: NhaCungCap;
  }>({});
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const { toast } = useToast();

  // Cập nhật hàm fetchNhaCungCap để hỗ trợ phân trang
  const fetchNhaCungCap = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrangnhacungcap?page=${meta.page}&limit_size=${
          meta.limit_size
        }&search=${encodeURIComponent(searchText)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setNhacungcapList(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPages,
        });
      }
    } catch (err) {
      console.error("Failed to fetch nha cung cap:", err);
      toast({
        title: "Lỗi!",
        description: "Không thể tải danh sách nhà cung cấp",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNhaCungCap();
  }, [meta.page, meta.limit_size, searchText, reloadKey]);

  // useEffect cho searchText
  useEffect(() => {
    const timer = setTimeout(() => {
      setMeta((prev) => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Hàm xử lý phân trang
  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const renderPagination = () => {
    const pages = [];
    let startPage = Math.max(1, meta.page - 1);
    const endPage = Math.min(meta.totalPages, startPage + 2);

    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === meta.page ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
          className="min-w-[32px] h-8 px-2 sm:min-w-[40px] sm:h-10 sm:px-3"
          size="sm"
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  const validateForm = (): string | null => {
    if (!formData.tennhacungcap.trim()) return "Vui lòng nhập tên nhà cung cấp";
    if (!formData.sodienthoai.trim()) return "Vui lòng nhập số điện thoại";
    if (!formData.diachi.trim()) return "Vui lòng nhập địa chỉ";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Email không hợp lệ";
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.sodienthoai))
      return "Số điện thoại không hợp lệ";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      name === "trangthai"
        ? value === "true"
        : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Lỗi Xác Thực!",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const url = currentNhaCungCapId
      ? `/api/nhacungcap/${currentNhaCungCapId}`
      : "/api/nhacungcap";
    const method = currentNhaCungCapId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Lỗi khi thêm/cập nhật nhà cung cấp"
        );
      }

      toast({
        title: "Thành Công!",
        description: isEditing
          ? "Cập nhật nhà cung cấp thành công"
          : "Thêm nhà cung cấp thành công",
        variant: "success",
      });

      setReloadKey((prev) => prev + 1);
      resetForm();
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      modal.close();
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Lỗi!",
        description:
          err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        const response = await fetch(`/api/nhacungcap/${deleteConfirmId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa nhà cung cấp");
        }

        toast({
          title: "Thành Công!",
          description: "Nhà cung cấp đã được xóa thành công",
          variant: "success",
        });

        // Cập nhật allSelectedItems
        const newSelectedItems = { ...allSelectedItems };
        delete newSelectedItems[deleteConfirmId];
        setAllSelectedItems(newSelectedItems);
        setSelectedItems((prev) => prev.filter((id) => id !== deleteConfirmId));

        setReloadKey((prev) => prev + 1);
        setDeleteConfirmId(null);
      } catch (err) {
        console.error("Error deleting nha cung cap:", err);
        toast({
          title: "Lỗi!",
          description:
            err instanceof Error ? err.message : "Lỗi khi xóa nhà cung cấp",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleEdit = (nhacungcap: NhaCungCap) => {
    setFormData(nhacungcap);
    setCurrentNhaCungCapId(nhacungcap.idnhacungcap);
    setIsEditing(true);
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    modal.showModal();
  };

  const resetForm = () => {
    setFormData({
      idnhacungcap: 0,
      tennhacungcap: "",
      sodienthoai: "",
      diachi: "",
      email: "",
      trangthai: true,
    });
    setCurrentNhaCungCapId(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    resetForm();
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    modal.close();
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    resetForm();
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  // Cập nhật useEffect cho selectedItems
  useEffect(() => {
    const currentPageSelectedIds = nhacungcapList
      .filter((item) => allSelectedItems[item.idnhacungcap])
      .map((item) => item.idnhacungcap);
    setSelectedItems(currentPageSelectedIds);
  }, [meta.page, nhacungcapList, allSelectedItems]);

  // Cập nhật handleSelectAll
  const handleSelectAll = (checked: boolean) => {
    const newSelectedItems = { ...allSelectedItems };

    if (checked) {
      nhacungcapList.forEach((item) => {
        newSelectedItems[item.idnhacungcap] = item;
      });
    } else {
      nhacungcapList.forEach((item) => {
        delete newSelectedItems[item.idnhacungcap];
      });
    }

    setAllSelectedItems(newSelectedItems);
    setSelectedItems(
      checked ? nhacungcapList.map((item) => item.idnhacungcap) : []
    );
  };

  // Hàm mới cho nút chọn tất cả
  const handleSelectAllButton = () => {
    const totalSelected = Object.keys(allSelectedItems).length;
    if (totalSelected === meta.totalRecords) {
      setAllSelectedItems({});
      setSelectedItems([]);
      toast({
        title: "Đã bỏ chọn tất cả",
        description: "Đã bỏ chọn tất cả nhà cung cấp",
        variant: "default",
      });
    } else {
      // Chọn tất cả items hiện tại trên trang
      const newSelectedItems = { ...allSelectedItems };
      nhacungcapList.forEach((item) => {
        newSelectedItems[item.idnhacungcap] = item;
      });
      setAllSelectedItems(newSelectedItems);
      const allIds = nhacungcapList.map((item) => item.idnhacungcap);
      setSelectedItems(allIds);
      toast({
        title: "Đã chọn trang hiện tại",
        description: `Đã chọn ${allIds.length} nhà cung cấp trên trang này`,
        variant: "default",
      });
    }
  };

  // Cập nhật handleSelectItem
  const handleSelectItem = (id: number, checked: boolean) => {
    const item = nhacungcapList.find((item) => item.idnhacungcap === id);
    if (!item) return;

    const newSelectedItems = { ...allSelectedItems };
    if (checked) {
      newSelectedItems[id] = item;
    } else {
      delete newSelectedItems[id];
    }

    setAllSelectedItems(newSelectedItems);
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  const handleDataImported = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  // Render thông tin selection
  const renderSelectionInfo = () => {
    const totalSelected = Object.keys(allSelectedItems).length;
    return totalSelected > 0 ? (
      <div className="text-sm text-blue-600">
        Đã chọn {totalSelected} nhà cung cấp
      </div>
    ) : null;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SalesDashboard onSidebarToggle={handleSidebarToggle} />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarExpanded ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <div className="p-4 mt-6 sm:p-6 pt-16 md:pt-6">
          <div className="max-w-7xl mx-auto">
            <Toaster />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Quản lý nhà cung cấp
              </h1>

              {/* Desktop Actions */}
              <div className="hidden sm:flex space-x-2 mt-2">
                <Button onClick={handleAddNewClick}>
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm nhà cung cấp
                </Button>
                <ExportButtons
                  data={Object.values(allSelectedItems)}
                  selectedItems={Object.keys(allSelectedItems).map(Number)}
                  onDataImported={handleDataImported}
                  onSelectAll={handleSelectAllButton}
                />
              </div>

              {/* Mobile Actions */}
              <div className="flex sm:hidden w-full justify-between">
                <Button onClick={handleAddNewClick} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm mới
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowExportOptions(!showExportOptions)}
                    >
                      Xuất/Nhập dữ liệu
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Export Options */}
            {showExportOptions && (
              <div className="sm:hidden mb-4">
                <ExportButtons
                  data={Object.values(allSelectedItems)}
                  selectedItems={Object.keys(allSelectedItems).map(Number)}
                  onDataImported={handleDataImported}
                  onSelectAll={handleSelectAllButton}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="w-full sm:max-w-md relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-600 w-full sm:w-auto">
                {renderSelectionInfo()}
                <div>Tổng số: {meta.totalRecords} nhà cung cấp</div>
              </div>
            </div>

            {/* Modal thêm/sửa nhà cung cấp */}
            <dialog
              id="my_modal_3"
              className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="modal-box bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      {isEditing
                        ? "Cập nhật nhà cung cấp"
                        : "Thêm nhà cung cấp"}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên nhà cung cấp
                      </label>
                      <input
                        type="text"
                        name="tennhacungcap"
                        value={formData.tennhacungcap}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        name="sodienthoai"
                        value={formData.sodienthoai}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="diachi"
                        value={formData.diachi}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        name="trangthai"
                        value={formData.trangthai.toString()}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="true">Đang cung cấp</option>
                        <option value="false">Ngừng cung cấp</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button type="submit" disabled={loading}>
                      {isEditing ? "Cập nhật" : "Thêm"}
                    </Button>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Hủy
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </dialog>

            {/* Bảng danh sách nhà cung cấp */}
            <div className="mt-4">
              <TableSupplier
                onEdit={handleEdit}
                onDelete={handleDelete}
                reloadKey={reloadKey}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
                data={nhacungcapList}
                loading={loading}
              />
            </div>

            {/* Phân trang */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Hiển thị {(meta.page - 1) * meta.limit_size + 1} -{" "}
                {Math.min(meta.page * meta.limit_size, meta.totalRecords)} trong{" "}
                {meta.totalRecords} nhà cung cấp
              </div>

              <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  size="sm"
                  className="h-8 w-8 p-0 sm:h-10 sm:w-10"
                >
                  <span className="sr-only">Previous</span>←
                </Button>

                {renderPagination()}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  size="sm"
                  className="h-8 w-8 p-0 sm:h-10 sm:w-10"
                >
                  <span className="sr-only">Next</span>→
                </Button>

                <Select
                  value={String(meta.limit_size)}
                  onValueChange={(value) =>
                    setMeta((prev) => ({
                      ...prev,
                      limit_size: Number(value),
                      page: 1,
                    }))
                  }
                >
                  <SelectTrigger className="w-16 sm:w-20 h-8 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
              open={deleteConfirmId !== null}
              onOpenChange={() => setDeleteConfirmId(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này
                    không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
