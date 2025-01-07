"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  TextRun,
} from "docx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SalesDashboard from "../NvarbarAdmin";
import TableTypeProduct from "../../TableTypeProduct";
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

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export default function LoaiSanPhamManagementPage() {
  const [formData, setFormData] = useState<LoaiSanPham>({
    idloaisanpham: 0,
    tenloai: "",
    mota: "",
  });

  const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentLoaiSanPhamId, setCurrentLoaiSanPhamId] = useState<
    number | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchLoaiSanPham();
  }, [reloadKey]);

  const fetchLoaiSanPham = async () => {
    try {
      const response = await fetch("/api/loaisanpham");
      const data = await response.json();
      setLoaisanphamList(data);
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách loại sản phẩm",
        variant: "destructive",
      });
    }
  };

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
        variant: "success",
        description: isEditing
          ? "Cập nhật loại sản phẩm thành công"
          : "Thêm loại sản phẩm thành công",
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

  // Excel Export Functionality
  const exportLoaiSanPhamToExcel = () => {
    const exportData = loaisanphamList.map((item) => ({
      "Mã Loại": item.idloaisanpham,
      "Tên Loại": item.tenloai,
      "Mô Tả": item.mota,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loại Sản Phẩm");

    XLSX.writeFile(
      workbook,
      `loai_san_pham_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // PDF Export Functionality
  // Hàm xuất PDF - cập nhật phần styles
  const exportLoaiSanPhamToPDF = () => {
    const doc = new jsPDF();

    // Add title với font Times New Roman
    doc.setFont("TimesNewRoman", "normal");
    doc.setFontSize(16);
    doc.text("Danh Sách Loại Sản Phẩm", 14, 20);

    // Create table với Times New Roman
    (doc as any).autoTable({
      startY: 30,
      head: [["Mã Loại", "Tên Loại", "Mô Tả"]],
      body: loaisanphamList.map((item) => [
        item.idloaisanpham,
        item.tenloai,
        item.mota,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 5,
        font: "TimesNewRoman", // Thêm font Times New Roman
        fontStyle: "normal",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        font: "TimesNewRoman", // Font cho header
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 30 },
    });

    doc.save(`loai_san_pham_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Hàm xuất Word - cập nhật styling cho paragraphs
  const exportLoaiSanPhamToWord = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Danh Sách Loại Sản Phẩm",
                  bold: true,
                  size: 32, // 16pt
                  font: "Times New Roman",
                }),
              ],
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Mã Loại",
                              bold: true,
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Tên Loại",
                              bold: true,
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Mô Tả",
                              bold: true,
                              font: "Times New Roman",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                ...loaisanphamList.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: item.idloaisanpham.toString(),
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: item.tenloai })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: item.mota })],
                        }),
                      ],
                    })
                ),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `loai_san_pham_${
      new Date().toISOString().split("T")[0]
    }.docx`;
    link.click();
  };
  // Excel Import Functionality
  const handleImportExcel = async (
    data: Omit<LoaiSanPham, "idloaisanpham">[]
  ) => {
    try {
      const response = await fetch("/api/loaisanpham/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Không thể nhập loại sản phẩm");
      }

      setReloadKey((prev) => prev + 1);
      toast({
        title: "Thành công",
        description: "Nhập loại sản phẩm từ Excel thành công",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Lỗi nhập Excel",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const bufferArray = e.target?.result;
        const workbook = XLSX.read(bufferArray, { type: "buffer" });

        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        const data: any[] = XLSX.utils.sheet_to_json(worksheet);

        const validatedData = data.map((row) => {
          if (!row["Tên Loại"] || !row["Mô Tả"]) {
            throw new Error(
              'Invalid Excel format. Ensure columns "Tên Loại" and "Mô Tả" exist.'
            );
          }

          return {
            tenloai: row["Tên Loại"],
            mota: row["Mô Tả"],
          };
        });

        await handleImportExcel(validatedData);
      };

      fileReader.readAsArrayBuffer(file);
    }
  };

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
              <Button variant="outline" onClick={exportLoaiSanPhamToExcel}>
                Xuất Excel
              </Button>
              <Button variant="outline" onClick={exportLoaiSanPhamToPDF}>
                Xuất PDF
              </Button>
              <Button variant="outline" onClick={exportLoaiSanPhamToWord}>
                Xuất Word
              </Button>
              <label className="cursor-pointer">
                <Button variant="secondary" asChild>
                  <span>Nhập Excel</span>
                </Button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div className="">
            <TableTypeProduct
              onEdit={handleEdit}
              onDelete={handleDelete}
              reloadKey={reloadKey}
            />
          </div>

          {/* Form Dialog */}
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

          {/* Delete Confirmation Dialog */}
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
