"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, Size } from "@/app/Admin/type/product";
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
import ProductFilters from "./ProductFilter/ProductFilters";
import ProductTable from "./ProductTable/ProductTables";
import { ProductDialog } from "./components/form/ProductDialog";
import ExportProductOptions from "./components/ExportProduct";
import Menu from "@/app/Staff/DashBoard/Header";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categories, setCategories] = useState<
    Array<{ idloaisanpham: number; tenloai: string }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [allSelectedItems, setAllSelectedItems] = useState<{
    [key: number]: Product;
  }>({});
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    tensanpham: "",
    gia: "",
    mota: "",
    idloaisanpham: "",
    giamgia: 0,
    mausac: "",
    gioitinh: true,
    productSizes: {},
  });
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchSizes();
    fetchCategories();
  }, [searchTerm, categoryFilter, genderFilter]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(genderFilter !== "all" && { gender: genderFilter }),
      });

      const response = await fetch(`/api/phantrang?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      });
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch("/api/size");
      if (!response.ok) throw new Error("Failed to fetch sizes");
      const data = await response.json();
      setSizes(data.size || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách size",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/loaisanpham");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách loại sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const url = selectedProduct
        ? `/api/sanpham/${selectedProduct.idsanpham}`
        : "/api/sanpham";

      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hinhanh: imageUrl,
          releaseDate: releaseDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save product");
      }

      toast({
        title: "Thành công",
        description: selectedProduct
          ? "Cập nhật sản phẩm thành công"
          : "Thêm sản phẩm thành công",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi không xác định",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      tensanpham: product.tensanpham || "",
      gia: String(product.gia) || "",
      mota: product.mota || "",
      idloaisanpham: product.idloaisanpham?.toString() || "",
      giamgia: product.giamgia || 0,
      mausac: product.mausac || "",
      gioitinh: product.gioitinh,
      productSizes:
        product.ProductSizes?.reduce((acc, size) => {
          acc[size.idSize] = size.soluong;
          return acc;
        }, {} as { [key: number]: number }) || {},
    });
    setImageUrl(product.hinhanh || "");
    setReleaseDate(product.releaseDate ? new Date(product.releaseDate) : null);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const response = await fetch(`/api/sanpham/${deleteConfirmId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast({
        title: "Thành công",
        description: "Xóa sản phẩm thành công",
      });

      setDeleteConfirmId(null);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tensanpham: "",
      gia: "",
      mota: "",
      idloaisanpham: "",
      giamgia: 0,
      mausac: "",
      gioitinh: true,
      productSizes: {},
    });
    setImageUrl("");
    setSelectedProduct(undefined);
    setReleaseDate(null);
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const item = products.find((item) => item.idsanpham === id);
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

  const handleSelectAll = (checked: boolean) => {
    const newSelectedItems = { ...allSelectedItems };

    if (checked) {
      products.forEach((item) => {
        newSelectedItems[item.idsanpham] = item;
      });
    } else {
      products.forEach((item) => {
        delete newSelectedItems[item.idsanpham];
      });
    }

    setAllSelectedItems(newSelectedItems);
    setSelectedItems(checked ? products.map((item) => item.idsanpham) : []);
  };

  useEffect(() => {
    const currentPageSelectedIds = products
      .filter((item) => allSelectedItems[item.idsanpham])
      .map((item) => item.idsanpham);
    setSelectedItems(currentPageSelectedIds);
  }, [products, allSelectedItems]);

  const renderSelectionInfo = () => {
    const totalSelected = Object.keys(allSelectedItems).length;
    return totalSelected > 0 ? (
      <div className="text-sm text-blue-600">
        Đã chọn {totalSelected} sản phẩm
      </div>
    ) : null;
  };

  return (
    <div>
      <div className="flex">
        <div className="p-6 mt-16 w-full">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                >
                  Thêm sản phẩm
                </Button>
                <ExportProductOptions
                  selectedItems={Object.keys(allSelectedItems).map(Number)}
                  productList={Object.values(allSelectedItems)}
                  onDataImported={fetchProducts}
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-4 mb-4">
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                genderFilter={genderFilter}
                onGenderChange={setGenderFilter}
                categories={categories}
              />
              {renderSelectionInfo()}
            </div>
          </div>

          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={setDeleteConfirmId}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            allSelected={
              products.length > 0 &&
              products.every((product) =>
                selectedItems.includes(product.idsanpham)
              )
            }
          />

          <ProductDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              resetForm();
            }}
            product={selectedProduct}
            sizes={sizes}
            categories={categories}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            isSubmitting={isSubmitting}
            releaseDate={releaseDate}
            onReleaseDateChange={setReleaseDate}
          />

          <AlertDialog
            open={!!deleteConfirmId}
            onOpenChange={() => setDeleteConfirmId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không
                  thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
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
