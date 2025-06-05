"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import SalesDashboard from "../NvarbarAdmin";
import { format as formatDate } from "date-fns";

interface User {
  idUsers: number;
  Tentaikhoan: string;
  Hoten: string;
  Email: string;
  IdRole: number;
}

interface CaLamViec {
  idCaLamViec: number;
  idUsers: number;
  ngaylam: string;
  giobatdau: string;
  gioketthuc: string;
  users: User;
}

interface FormDataType {
  idUsers: string;
  ngaylam: string;
  giobatdau: string;
  gioketthuc: string;
  DiaDiem: string;
}

interface ErrorResponse {
  message: string;
}

export default function CaLamViecPage() {
  const [caLamViecList, setCaLamViecList] = useState<CaLamViec[]>([]);
  const [filteredList, setFilteredList] = useState<CaLamViec[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCaLamViec, setSelectedCaLamViec] = useState<CaLamViec | null>(
    null
  );
  // State để theo dõi trạng thái mở rộng của sidebar
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Filter states
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterWeek, setFilterWeek] = useState("");

  const [formData, setFormData] = useState<FormDataType>({
    idUsers: "",
    ngaylam: "",
    giobatdau: "",
    gioketthuc: "",
    DiaDiem: "",
  });

  // Function to get week number from date
  const getWeekNumber = (date: Date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchCaLamViec();
    fetchUsers();
  }, []);

  // Lắng nghe sự kiện sidebarToggle từ Navbar
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSidebarExpanded(customEvent.detail.expanded);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);

  // Apply filters when filter criteria or data changes
  useEffect(() => {
    if (caLamViecList.length === 0) return;

    let filtered = [...caLamViecList];

    switch (filterType) {
      case "day":
        if (filterDate) {
          filtered = filtered.filter(
            (ca) =>
              new Date(ca.ngaylam).toISOString().split("T")[0] === filterDate
          );
        }
        break;
      case "week":
        if (filterWeek) {
          const [year, week] = filterWeek.split("-W");
          filtered = filtered.filter((ca) => {
            const date = new Date(ca.ngaylam);
            const caWeek = getWeekNumber(date);
            return (
              caWeek === parseInt(week) &&
              date.getFullYear().toString() === year
            );
          });
        }
        break;
      case "month":
        if (filterMonth) {
          const [year, month] = filterMonth.split("-");
          filtered = filtered.filter((ca) => {
            const date = new Date(ca.ngaylam);
            return (
              date.getMonth() + 1 === parseInt(month) &&
              date.getFullYear().toString() === year
            );
          });
        }
        break;
      case "year":
        if (filterYear) {
          filtered = filtered.filter(
            (ca) => new Date(ca.ngaylam).getFullYear().toString() === filterYear
          );
        }
        break;
    }

    setFilteredList(filtered);
  }, [
    caLamViecList,
    filterType,
    filterDate,
    filterMonth,
    filterYear,
    filterWeek,
  ]);

  const fetchCaLamViec = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/calamviec");
      if (!response.ok) throw new Error("Không thể tải danh sách ca làm việc");
      const data = await response.json();
      setCaLamViecList(data);
      setFilteredList(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ca làm việc:", error);
      toast.error("Không thể tải danh sách ca làm việc");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Không thể tải danh sách người dùng");
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  const createLichLamViec = async (caLamViecData: FormDataType) => {
    try {
      const lichLamViecData = {
        idUsers: caLamViecData.idUsers,
        NgayLamViec: caLamViecData.ngaylam,
        GioBatDau: caLamViecData.giobatdau,
        GioKetThuc: caLamViecData.gioketthuc,
        DiaDiem: caLamViecData.DiaDiem || "",
      };

      const response = await fetch("/api/lichlamviec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lichLamViecData),
      });

      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        throw new Error(error.message || "Không thể tạo lịch làm việc");
      }

      return await response.json();
    } catch (error: unknown) {
      console.error("Lỗi khi tạo lịch làm việc:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleAddCaLamViec = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create Ca Làm Việc
      const caLamViecResponse = await fetch("/api/calamviec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!caLamViecResponse.ok) {
        const errorData = (await caLamViecResponse.json()) as ErrorResponse;
        throw new Error(errorData.message || "Không thể thêm ca làm việc");
      }

      // Create Lịch Làm Việc
      await createLichLamViec(formData);

      await fetchCaLamViec();
      toast.success("Thêm ca làm việc và lịch làm việc thành công");
      setOpen(false);
      setFormData({
        idUsers: "",
        ngaylam: "",
        giobatdau: "",
        gioketthuc: "",
        DiaDiem: "",
      });
    } catch (error: unknown) {
      console.error("Lỗi:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể thêm ca làm việc"
      );
    }
  };

  const handleEditCaLamViec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaLamViec) return;

    try {
      // Update Ca Làm Việc
      const caLamViecResponse = await fetch(
        `/api/calamviec/${selectedCaLamViec.idCaLamViec}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!caLamViecResponse.ok) {
        const errorData = (await caLamViecResponse.json()) as ErrorResponse;
        throw new Error(errorData.message || "Không thể cập nhật ca làm việc");
      }

      // Update corresponding Lịch Làm Việc
      const lichLamViecResponse = await fetch(
        `/api/lichlamviec/${selectedCaLamViec.idCaLamViec}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsers: formData.idUsers,
            NgayLamViec: formData.ngaylam,
            GioBatDau: formData.giobatdau,
            GioKetThuc: formData.gioketthuc,
            DiaDiem: formData.DiaDiem,
          }),
        }
      );

      if (!lichLamViecResponse.ok) {
        console.warn("Không thể cập nhật lịch làm việc tương ứng");
      }

      await fetchCaLamViec();
      toast.success("Cập nhật ca làm việc và lịch làm việc thành công");
      setEditOpen(false);
      setSelectedCaLamViec(null);
      setFormData({
        idUsers: "",
        ngaylam: "",
        giobatdau: "",
        gioketthuc: "",
        DiaDiem: "",
      });
    } catch (error: unknown) {
      console.error("Lỗi:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật ca làm việc"
      );
    }
  };

  const handleDeleteCaLamViec = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ca làm việc này?")) return;

    try {
      const response = await fetch(`/api/calamviec/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.message || "Không thể xóa ca làm việc");
      }

      // Try to delete corresponding lichlamviec entry
      try {
        await fetch(`/api/lichlamviec/${id}`, {
          method: "DELETE",
        });
      } catch (lichError) {
        console.warn("Không thể xóa lịch làm việc tương ứng:", lichError);
      }

      await fetchCaLamViec();
      toast.success("Xóa ca làm việc thành công");
    } catch (error: unknown) {
      console.error("Lỗi:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa ca làm việc"
      );
    }
  };

  const handleEditClick = (caLamViec: CaLamViec) => {
    setSelectedCaLamViec(caLamViec);
    setFormData({
      idUsers: caLamViec.idUsers.toString(),
      ngaylam: new Date(caLamViec.ngaylam).toISOString().split("T")[0],
      giobatdau: caLamViec.giobatdau,
      gioketthuc: caLamViec.gioketthuc,
      DiaDiem: "", // You would need to fetch this from lichlamviec if needed
    });
    setEditOpen(true);
  };

  // Xử lý sự kiện khi sidebar thay đổi trạng thái
  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Truyền hàm xử lý toggle vào SalesDashboard */}
      <SalesDashboard onSidebarToggle={handleSidebarToggle} />

      {/* Container chính với margin-left động dựa trên trạng thái sidebar */}
      <div
        className={`transition-all duration-300 pt-20 ${
          sidebarExpanded ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Quản Lý Ca Làm Việc</CardTitle>
                <CardDescription>
                  Xem và quản lý tất cả ca làm việc của nhân viên
                </CardDescription>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>Thêm Ca Làm Việc</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm Ca Làm Việc Mới</DialogTitle>
                    <DialogDescription>
                      Nhập thông tin ca làm việc mới
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCaLamViec}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="add-idUsers" className="text-right">
                          Nhân viên
                        </Label>
                        <div className="col-span-3">
                          <Select
                            value={formData.idUsers}
                            onValueChange={(value) =>
                              handleSelectChange("idUsers", value)
                            }
                          >
                            <SelectTrigger id="add-idUsers">
                              <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem
                                  key={user.idUsers}
                                  value={user.idUsers.toString()}
                                >
                                  {user.Hoten || user.Tentaikhoan}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="add-ngaylam" className="text-right">
                          Ngày làm
                        </Label>
                        <Input
                          id="add-ngaylam"
                          name="ngaylam"
                          type="date"
                          value={formData.ngaylam}
                          onChange={handleChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="add-giobatdau" className="text-right">
                          Giờ bắt đầu
                        </Label>
                        <Input
                          id="add-giobatdau"
                          name="giobatdau"
                          type="time"
                          value={formData.giobatdau}
                          onChange={handleChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="add-gioketthuc" className="text-right">
                          Giờ kết thúc
                        </Label>
                        <Input
                          id="add-gioketthuc"
                          name="gioketthuc"
                          type="time"
                          value={formData.gioketthuc}
                          onChange={handleChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="add-diadiem" className="text-right">
                          Địa điểm
                        </Label>
                        <Input
                          id="add-diadiem"
                          name="DiaDiem"
                          type="text"
                          value={formData.DiaDiem}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Thêm mới</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {/* Filter Controls */}
              <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <Select
                    value={filterType}
                    onValueChange={(value) => setFilterType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kiểu lọc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="day">Theo ngày</SelectItem>
                      <SelectItem value="week">Theo tuần</SelectItem>
                      <SelectItem value="month">Theo tháng</SelectItem>
                      <SelectItem value="year">Theo năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filterType === "day" && (
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                )}

                {filterType === "week" && (
                  <Input
                    type="week"
                    value={filterWeek}
                    onChange={(e) => setFilterWeek(e.target.value)}
                  />
                )}

                {filterType === "month" && (
                  <Input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                  />
                )}

                {filterType === "year" && (
                  <Input
                    type="number"
                    placeholder="Năm"
                    min="2000"
                    max="2100"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  />
                )}
              </div>

              {/* Table */}
              {loading ? (
                <div className="flex justify-center p-4">
                  Đang tải dữ liệu...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nhân Viên</TableHead>
                        <TableHead>Ngày Làm</TableHead>
                        <TableHead>Giờ Bắt Đầu</TableHead>
                        <TableHead>Giờ Kết Thúc</TableHead>
                        <TableHead className="text-right">Hành Động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            Không có dữ liệu ca làm việc
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredList.map((caLamViec) => (
                          <TableRow key={caLamViec.idCaLamViec}>
                            <TableCell>{caLamViec.idCaLamViec}</TableCell>
                            <TableCell>
                              {caLamViec.users?.Hoten ||
                                caLamViec.users?.Tentaikhoan ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {formatDate(
                                new Date(caLamViec.ngaylam),
                                "dd/MM/yyyy"
                              )}
                            </TableCell>
                            <TableCell>{caLamViec.giobatdau}</TableCell>
                            <TableCell>{caLamViec.gioketthuc}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleEditClick(caLamViec)}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDeleteCaLamViec(caLamViec.idCaLamViec)
                                }
                              >
                                Xoá
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa Ca Làm Việc</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin ca làm việc
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCaLamViec}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-idUsers" className="text-right">
                  Nhân viên
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.idUsers}
                    onValueChange={(value) =>
                      handleSelectChange("idUsers", value)
                    }
                  >
                    <SelectTrigger id="edit-idUsers">
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem
                          key={user.idUsers}
                          value={user.idUsers.toString()}
                        >
                          {user.Hoten || user.Tentaikhoan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ngaylam" className="text-right">
                  Ngày làm
                </Label>
                <Input
                  id="edit-ngaylam"
                  name="ngaylam"
                  type="date"
                  value={formData.ngaylam}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-giobatdau" className="text-right">
                  Giờ bắt đầu
                </Label>
                <Input
                  id="edit-giobatdau"
                  name="giobatdau"
                  type="time"
                  value={formData.giobatdau}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-gioketthuc" className="text-right">
                  Giờ kết thúc
                </Label>
                <Input
                  id="edit-gioketthuc"
                  name="gioketthuc"
                  type="time"
                  value={formData.gioketthuc}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-diadiem" className="text-right">
                  Địa điểm
                </Label>
                <Input
                  id="edit-diadiem"
                  name="DiaDiem"
                  type="text"
                  value={formData.DiaDiem}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Cập nhật</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
