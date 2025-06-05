"use client";
import { useState, useEffect, useCallback } from "react";
import type React from "react";

import {
  Calendar,
  momentLocalizer,
  type View,
  type ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

// No need to import these - they'll be provided by the layout
// import Menu from "@/app/Staff/DashBoard/Header";
// import StaffSidebar from "@/app/Staff/DashBoard/component/StaffSidebar";

interface User {
  idUsers: number;
  Tentaikhoan: string;
  Hoten: string;
  Email: string;
  idRole: number;
}

interface LichLamViec {
  idLichLamViec: number;
  idUsers: number;
  NgayLamViec: string;
  GioBatDau: string;
  GioKetThuc: string;
  DiaDiem?: string;
  user: User;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: LichLamViec;
}

moment.locale("vi");
const localizer = momentLocalizer(moment);

const CustomToolbar: React.FC<ToolbarProps<CalendarEvent, object>> = ({
  onView,
  onNavigate,
  date,
  view,
}) => {
  return (
    <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onNavigate("TODAY")}>
          Hôm nay
        </Button>
        <Button variant="outline" onClick={() => onNavigate("PREV")}>
          ←
        </Button>
        <Button variant="outline" onClick={() => onNavigate("NEXT")}>
          →
        </Button>
      </div>

      <h2 className="text-xl font-semibold">
        {view === "month" && moment(date).format("MMMM YYYY")}
        {view === "week" && `Tuần ${moment(date).format("W, YYYY")}`}
        {view === "day" && moment(date).format("DD/MM/YYYY")}
        {view === "agenda" && "Lịch trình"}
      </h2>

      <div className="flex gap-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          onClick={() => onView("month")}
        >
          Tháng
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          onClick={() => onView("week")}
        >
          Tuần
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          onClick={() => onView("day")}
        >
          Ngày
        </Button>
        <Button
          variant={view === "agenda" ? "default" : "outline"}
          onClick={() => onView("agenda")}
        >
          Lịch trình
        </Button>
      </div>
    </div>
  );
};

export default function LichLamViecPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<LichLamViec | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [formData, setFormData] = useState<Partial<LichLamViec>>({
    idUsers: 0,
    NgayLamViec: "",
    GioBatDau: "",
    GioKetThuc: "",
    DiaDiem: "",
  });
  const [isNewEvent, setIsNewEvent] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLichLamViec = useCallback(async () => {
    try {
      setIsLoading(true);

      // If a specific user ID is selected, fetch only their schedules
      if (formData.idUsers) {
        const response = await fetch(`/api/lichlam/user/${formData.idUsers}`);
        const result = await response.json();

        if (result.data) {
          const calendarEvents = result.data.map((item: LichLamViec) => ({
            id: item.idLichLamViec,
            title: `${
              item.user?.Hoten || item.user?.Tentaikhoan || "Chưa có tên"
            } - ${item.DiaDiem || "Lịch Làm"}`,
            start: new Date(
              `${item.NgayLamViec.split("T")[0]}T${new Date(item.GioBatDau)
                .toTimeString()
                .slice(0, 8)}`
            ),
            end: new Date(
              `${item.NgayLamViec.split("T")[0]}T${new Date(item.GioKetThuc)
                .toTimeString()
                .slice(0, 8)}`
            ),
            resource: item,
          }));

          setEvents(calendarEvents);
        }
      } else {
        // If no user is selected, clear the events
        setEvents([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch làm việc:", error);
      toast.error("Không thể tải danh sách lịch làm việc");
    } finally {
      setIsLoading(false);
    }
  }, [formData.idUsers]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/user");
      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        const sortedUsers = result.data
          .filter((user: User) => user.idRole === 3)
          .sort((a: User, b: User) =>
            (a.Hoten || a.Tentaikhoan).localeCompare(b.Hoten || b.Tentaikhoan)
          );

        setUsers(sortedUsers);

        if (sortedUsers.length > 0) {
          setFormData((prev) => ({
            ...prev,
            idUsers: sortedUsers[0].idUsers,
          }));
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    // Don't automatically fetch schedules, wait for user selection
  }, [fetchUsers]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const startDate = new Date(start);
    const formattedDate = startDate.toISOString().split("T")[0];
    const formattedStartTime = startDate.toTimeString().slice(0, 8);
    const formattedEndTime = new Date(end).toTimeString().slice(0, 8);

    setFormData({
      idUsers: users.length > 0 ? users[0].idUsers : 0,
      NgayLamViec: formattedDate,
      GioBatDau: formattedStartTime,
      GioKetThuc: formattedEndTime,
      DiaDiem: "",
    });

    setIsNewEvent(true);
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    const lichLamViec = event.resource;
    setSelectedEvent(lichLamViec);

    setFormData({
      idUsers: lichLamViec.idUsers,
      NgayLamViec: new Date(lichLamViec.NgayLamViec)
        .toISOString()
        .split("T")[0],
      GioBatDau: new Date(lichLamViec.GioBatDau).toTimeString().slice(0, 8),
      GioKetThuc: new Date(lichLamViec.GioKetThuc).toTimeString().slice(0, 8),
      DiaDiem: lichLamViec.DiaDiem || "",
    });

    setIsNewEvent(false);
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLichLamViec = async () => {
    try {
      if (
        !formData.idUsers ||
        !formData.NgayLamViec ||
        !formData.GioBatDau ||
        !formData.GioKetThuc
      ) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      const payload = {
        idUsers: Number(formData.idUsers),
        NgayLamViec: formData.NgayLamViec,
        GioBatDau: formData.GioBatDau,
        GioKetThuc: formData.GioKetThuc,
        DiaDiem: formData.DiaDiem || "",
      };

      let response;

      if (isNewEvent) {
        response = await fetch("/api/lichlam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/lichlam/${selectedEvent?.idLichLamViec}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (response.ok) {
        toast.success(
          isNewEvent ? "Đã tạo lịch hẹn mới" : "Đã cập nhật lịch hẹn"
        );
        setIsDialogOpen(false);
        fetchLichLamViec();
      } else {
        toast.error(result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi lưu lịch làm việc:", error);
      toast.error("Không thể lưu lịch làm việc");
    }
  };

  const handleDeleteLichLamViec = async () => {
    try {
      const response = await fetch(
        `/api/lichlam/${selectedEvent?.idLichLamViec}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Đã xóa lịch hẹn");
        setIsDeleteDialogOpen(false);
        setIsDialogOpen(false);
        fetchLichLamViec();
      } else {
        const result = await response.json();
        toast.error(result.message || "Có lỗi xảy ra khi xóa");
      }
    } catch (error) {
      console.error("Lỗi khi xóa lịch làm việc:", error);
      toast.error("Không thể xóa lịch làm việc");
    }
  };

  const getUserDisplayName = (user: User) => {
    return user.Hoten || user.Tentaikhoan || "Chưa có tên";
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mt-10">Quản Lý Lịch Làm Việc</h1>

      <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <Label htmlFor="filterUser" className="min-w-[100px]">
            Chọn nhân viên:
          </Label>
          <select
            id="filterUser"
            name="idUsers"
            className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2"
            value={formData.idUsers || ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 0;
              setFormData((prev) => ({ ...prev, idUsers: value }));
            }}
          >
            <option value="">Chọn nhân viên</option>
            {users.map((user) => (
              <option key={user.idUsers} value={user.idUsers}>
                {getUserDisplayName(user)}
              </option>
            ))}
          </select>
          <Button onClick={fetchLichLamViec} disabled={!formData.idUsers}>
            Xem lịch
          </Button>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded-lg shadow-md"
        style={{ height: "calc(100vh - 250px)" }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            components={{
              toolbar: CustomToolbar,
            }}
            messages={{
              today: "Hôm nay",
              previous: "Trước",
              next: "Sau",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày",
              agenda: "Lịch trình",
              date: "Ngày",
              time: "Thời gian",
              event: "Sự kiện",
              allDay: "Cả ngày",
              work_week: "Tuần làm việc",
              yesterday: "Hôm qua",
              tomorrow: "Ngày mai",
              noEventsInRange:
                "Không có lịch hẹn nào trong khoảng thời gian này",
            }}
          />
        )}
      </div>

      {/* Dialog Form tạo/chỉnh sửa lịch */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isNewEvent ? "Tạo lịch hẹn mới" : "Chỉnh sửa lịch hẹn"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idUsers" className="text-right">
                Nhân viên
              </Label>
              <select
                id="idUsers"
                name="idUsers"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.idUsers || ""}
                onChange={handleInputChange}
              >
                {users.length === 0 ? (
                  <option value="" disabled>
                    Không có nhân viên nào
                  </option>
                ) : (
                  <>
                    <option value="" disabled>
                      Chọn nhân viên
                    </option>
                    {users.map((user) => (
                      <option key={user.idUsers} value={user.idUsers}>
                        {getUserDisplayName(user)}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="NgayLamViec" className="text-right">
                Ngày
              </Label>
              <Input
                id="NgayLamViec"
                name="NgayLamViec"
                type="date"
                value={formData.NgayLamViec}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="GioBatDau" className="text-right">
                Giờ bắt đầu
              </Label>
              <Input
                id="GioBatDau"
                name="GioBatDau"
                type="time"
                value={formData.GioBatDau?.toString().slice(0, 5)}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="GioKetThuc" className="text-right">
                Giờ kết thúc
              </Label>
              <Input
                id="GioKetThuc"
                name="GioKetThuc"
                type="time"
                value={formData.GioKetThuc?.toString().slice(0, 5)}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DiaDiem" className="text-right">
                Địa điểm
              </Label>
              <Input
                id="DiaDiem"
                name="DiaDiem"
                value={formData.DiaDiem || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Nhập địa điểm (nếu có)"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              {!isNewEvent && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Xóa
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="button" onClick={handleSaveLichLamViec}>
                {isNewEvent ? "Tạo" : "Cập nhật"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa lịch hẹn này không?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteLichLamViec}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
