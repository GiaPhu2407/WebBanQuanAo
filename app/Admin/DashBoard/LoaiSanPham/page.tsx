"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportOptions from "./component/ExportOptions";
import LoaiSanPhamTable from "./component/LoaiSanPhamTable";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

export default function LoaiSanPhamManagementPage() {
  // Thêm state cho phân trang
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });

  // Giữ nguyên các state hiện có
  const [formData, setFormData] = useState<LoaiSanPham>({
    idloaisanpham: 0,
    tenloai: "",
    mota: "",
  });
  const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentLoaiSanPhamId, setCurrentLoaiSanPhamId] = useState<
    number | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [allSelectedItems, setAllSelectedItems] = useState<{
    [key: number]: LoaiSanPham;
  }>({});

  const { toast } = useToast();

  // Cập nhật hàm fetchLoaiSanPham để hỗ trợ phân trang
  const fetchLoaiSanPham = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrangloaisanpham?page=${meta.page}&limit_size=${
          meta.limit_size
        }&search=${encodeURIComponent(searchText)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setLoaisanphamList(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPages,
        });
      }
    } catch (err) {
      console.error("Failed to fetch loai san pham:", err);
      toast({
        title: "Lỗi!",
        description: "Không thể tải danh sách loại sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoaiSanPham();
  }, [meta.page, meta.limit_size, searchText, reloadKey]);

  // Thêm useEffect cho searchText
  useEffect(() => {
    const timer = setTimeout(() => {
      setMeta((prev) => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Thêm hàm xử lý phân trang
  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const renderPagination = () => {
    const pages = [];
    let startPage = Math.max(1, meta.page - 2);
    let endPage = Math.min(meta.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === meta.page ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  // Giữ nguyên các hàm xử lý hiện có
  const validateForm = (): string | null => {
    if (!formData.tenloai.trim()) return "Vui lòng nhập tên loại sản phẩm";
    if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Lỗi",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const url = currentLoaiSanPhamId
      ? `/api/loaisanpham/${currentLoaiSanPhamId}`
      : "/api/loaisanpham";
    const method = currentLoaiSanPhamId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Lỗi khi cập nhật loại sản phẩm");
      }

      toast({
        title: "Thành công",
        description: isEditing
          ? "Cập nhật loại sản phẩm thành công"
          : "Thêm loại sản phẩm thành công",
        variant: "success",
      });

      handleCloseModal();
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const currentPageSelectedIds = loaisanphamList
      .filter((item) => allSelectedItems[item.idloaisanpham])
      .map((item) => item.idloaisanpham);
    setSelectedItems(currentPageSelectedIds);
  }, [meta.page, loaisanphamList, allSelectedItems]);

  // Cập nhật hàm handleSelectAll
  const handleSelectAll = (checked: boolean) => {
    const newSelectedItems = { ...allSelectedItems };

    if (checked) {
      // Thêm tất cả items của trang hiện tại
      loaisanphamList.forEach((item) => {
        newSelectedItems[item.idloaisanpham] = item;
      });
    } else {
      // Xóa tất cả items của trang hiện tại
      loaisanphamList.forEach((item) => {
        delete newSelectedItems[item.idloaisanpham];
      });
    }

    setAllSelectedItems(newSelectedItems);
    setSelectedItems(
      checked ? loaisanphamList.map((item) => item.idloaisanpham) : []
    );
  };

  // Cập nhật hàm handleSelectItem
  const handleSelectItem = (id: number, checked: boolean) => {
    const item = loaisanphamList.find((item) => item.idloaisanpham === id);
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

  // Cập nhật component ExportOptions để sử dụng allSelectedItems
  const modifiedExportOptions = (
    <ExportOptions
      selectedItems={Object.keys(allSelectedItems).map(Number)}
      loaisanphamList={loaisanphamList}
      onDataImported={() => setReloadKey((prev) => prev + 1)}
    />
  );

  // Thêm thông tin về số lượng item đã chọn
  const renderSelectionInfo = () => {
    const totalSelected = Object.keys(allSelectedItems).length;
    return totalSelected > 0 ? (
      <div className="text-sm text-blue-600">
        Đã chọn {totalSelected} loại sản phẩm trên tất cả các trang
      </div>
    ) : null;
  };

  const handleEdit = (loaiSanPham: LoaiSanPham) => {
    setFormData(loaiSanPham);
    setCurrentLoaiSanPhamId(loaiSanPham.idloaisanpham);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      idloaisanpham: 0,
      tenloai: "",
      mota: "",
    });
    setCurrentLoaiSanPhamId(null);
    setIsEditing(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const response = await fetch(`/api/loaisanpham/${deleteConfirmId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa loại sản phẩm");
      }

      toast({
        title: "Thành công",
        description: "Xóa loại sản phẩm thành công",
      });

      setReloadKey((prev) => prev + 1);
      setSelectedItems((prev) => prev.filter((id) => id !== deleteConfirmId));
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xóa loại sản phẩm",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteConfirmId(null);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    resetForm();
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredList = loaisanphamList.filter(
    (item) =>
      item.tenloai.toLowerCase().includes(searchText.toLowerCase()) ||
      item.mota.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8 pt-[100px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý loại sản phẩm
            </h1>
            <div className="flex space-x-2">
              <Button onClick={handleAddNewClick}>Thêm loại sản phẩm</Button>
              {modifiedExportOptions}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 mb-4">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên loại hoặc mô tả..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              {renderSelectionInfo()}
              <div className="text-sm text-gray-600">
                Tổng số: {meta.totalRecords} loại sản phẩm
              </div>
            </div>
          </div>

          <LoaiSanPhamTable
            categories={loaisanphamList}
            loading={loading}
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchText={searchText}
          />

          {/* Thêm phân trang */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Hiển thị {(meta.page - 1) * meta.limit_size + 1} -{" "}
              {Math.min(meta.page * meta.limit_size, meta.totalRecords)} trong{" "}
              {meta.totalRecords} loại sản phẩm
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
              >
                <span className="sr-only">Previous</span>←
              </Button>

              {renderPagination()}

              <Button
                variant="outline"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
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
                <SelectTrigger className="w-20">
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

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing
                    ? "Cập nhật loại sản phẩm"
                    : "Thêm loại sản phẩm mới"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tên loại sản phẩm
                  </label>
                  <Input
                    type="text"
                    name="tenloai"
                    value={formData.tenloai}
                    onChange={handleChange}
                    placeholder="Nhập tên loại sản phẩm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mô tả</label>
                  <Textarea
                    name="mota"
                    value={formData.mota}
                    onChange={handleChange}
                    placeholder="Nhập mô tả loại sản phẩm"
                    className="min-h-[100px]"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa loại sản phẩm này? Hành động này
                  không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
