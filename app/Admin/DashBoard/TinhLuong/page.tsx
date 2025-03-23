"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Calculator,
  FileText,
} from "lucide-react";
import SalesDashboard from "../NvarbarAdmin";

interface User {
  idUsers: number;
  Tentaikhoan: string;
}

interface SalaryReport {
  idUsers: number;
  userName: string;
  totalShifts: number;
  totalWorkHours: string;
  hourlyRate: number;
  baseSalary: number;
  bonus: number;
  totalSalary: number;
  shiftDetails: {
    date: string;
    startTime: string;
    endTime: string;
    workHours: string;
    giobatdau: string;
    gioketthuc: string;
  }[];
}

interface Shift {
  idCaLamViec: number;
  idUsers: number;
  ngaylam: string;
  giobatdau: string;
  gioketthuc: string;
  users: User;
}

interface Salary {
  idLuong: number;
  idUsers: number;
  luongcoban: number;
  thuong?: number;
  ngaytinhluong: string;
  soca: number;
  tongluong: number;
  users: User;
}

interface UserSalaryInput {
  baseSalary: number;
  bonus: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salaryReports, setSalaryReports] = useState<SalaryReport[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [userSalaryInputs, setUserSalaryInputs] = useState<{
    [key: number]: UserSalaryInput;
  }>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const [showSalaryHistory, setShowSalaryHistory] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAllShifts();
    fetchAllSalaries();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu người dùng");
      }

      const data = await response.json();

      // Kiểm tra xem dữ liệu trả về có đúng định dạng hay không
      if (data && Array.isArray(data.data)) {
        setUsers(data.data); // Cập nhật state users

        // Initialize salary inputs cho mỗi người dùng
        const initialInputs = data.data.reduce(
          (acc: { [key: number]: UserSalaryInput }, user: User) => {
            acc[user.idUsers] = {
              baseSalary: 50000, // Lương cơ bản mặc định
              bonus: 100000, // Thưởng mặc định
            };
            return acc;
          },
          {}
        );
        setUserSalaryInputs(initialInputs); // Cập nhật state userSalaryInputs
      } else {
        console.error("Dữ liệu không hợp lệ:", data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  const fetchAllShifts = async () => {
    try {
      const response = await fetch("/api/calamviec");
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const fetchAllSalaries = async () => {
    try {
      const response = await fetch("/api/luong");
      const data = await response.json();
      setSalaries(data.data || []); // Add fallback to empty array
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  const calculateIndividualSalary = async (userId: number) => {
    setLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const userInput = userSalaryInputs[userId];
      if (!userInput) {
        throw new Error("User salary input not found");
      }

      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          month: selectedMonth,
          year: selectedYear,
          baseSalaryPerHour: userInput.baseSalary,
          defaultBonus: userInput.bonus, // Changed from bonus to defaultBonus to match API
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate salary");
      }

      const data = await response.json();

      if (data.data) {
        // Update salary reports with the new calculation
        setSalaryReports((prev) => {
          const otherReports = prev.filter((r) => r.idUsers !== userId);
          return [...otherReports, data.data];
        });

        // Fetch updated salary data
        await fetchAllSalaries();
      }
    } catch (error) {
      console.error("Error calculating individual salary:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleInputChange = (
    userId: number,
    field: keyof UserSalaryInput,
    value: number
  ) => {
    setUserSalaryInputs((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    const time = timeString.split(":");
    return `${time[0]}:${time[1]}`;
  };

  const calculateWorkHours = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "-";
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <SalesDashboard />
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <DollarSign className="mr-2" />
              Quản Lý Lương Nhân Viên
            </h1>

            {/* Period Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="text-gray-500" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="form-select block w-full rounded-md border-gray-300 shadow-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="text-gray-500" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="form-select block w-full rounded-md border-gray-300 shadow-sm"
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - 2 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      Năm {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setShowShiftDetails(!showShiftDetails)}
                className={`px-4 py-2 rounded-md flex items-center ${
                  showShiftDetails
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Clock className="mr-2 h-4 w-4" />
                Chi tiết ca làm việc
              </button>
              <button
                onClick={() => setShowSalaryHistory(!showSalaryHistory)}
                className={`px-4 py-2 rounded-md flex items-center ${
                  showSalaryHistory
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Lịch sử lương
              </button>
            </div>

            {/* Employee Salary Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số ca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng giờ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lương/giờ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thưởng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng lương
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => {
                      const report = salaryReports.find(
                        (r) => r.idUsers === user.idUsers
                      );
                      const userInput = userSalaryInputs[user.idUsers] || {
                        baseSalary: 50000,
                        bonus: 100000,
                      };

                      // Calculate total shifts and work hours for the user
                      const userShifts = shifts.filter(
                        (shift) => shift.idUsers === user.idUsers
                      );
                      const totalShifts = userShifts.length;
                      let totalWorkHours = "0:00";
                      if (userShifts.length > 0) {
                        const totalMinutes = userShifts.reduce((acc, shift) => {
                          const workHours = calculateWorkHours(
                            shift.giobatdau,
                            shift.gioketthuc
                          );
                          if (workHours !== "-") {
                            const [hours, minutes] = workHours
                              .split(":")
                              .map(Number);
                            return acc + hours * 60 + minutes;
                          }
                          return acc;
                        }, 0);
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        totalWorkHours = `${hours}:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                      }

                      return (
                        <React.Fragment key={user.idUsers}>
                          <tr
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                              setSelectedUserId(
                                selectedUserId === user.idUsers
                                  ? null
                                  : user.idUsers
                              )
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Users className="h-5 w-5 text-gray-400 mr-2" />
                                <div className="text-sm font-medium text-gray-900">
                                  {user.Tentaikhoan}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {totalShifts}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {totalWorkHours}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={userInput.baseSalary}
                                onChange={(e) =>
                                  handleInputChange(
                                    user.idUsers,
                                    "baseSalary",
                                    Number(e.target.value)
                                  )
                                }
                                className="form-input block w-32 rounded-md border-gray-300 shadow-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={userInput.bonus}
                                onChange={(e) =>
                                  handleInputChange(
                                    user.idUsers,
                                    "bonus",
                                    Number(e.target.value)
                                  )
                                }
                                className="form-input block w-32 rounded-md border-gray-300 shadow-sm"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {report
                                ? formatCurrency(Number(report.totalSalary))
                                : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  calculateIndividualSalary(user.idUsers);
                                }}
                                disabled={loading[user.idUsers]}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                              >
                                <Calculator className="mr-2 h-4 w-4" />
                                {loading[user.idUsers]
                                  ? "Đang tính..."
                                  : "Tính lương"}
                              </button>
                            </td>
                          </tr>

                          {/* Shift Details */}
                          {selectedUserId === user.idUsers &&
                            showShiftDetails &&
                            userShifts.length > 0 && (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="px-6 py-4 bg-gray-50"
                                >
                                  <div className="text-sm text-gray-900 font-medium mb-2">
                                    Chi tiết ca làm việc:
                                  </div>
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Ngày
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Giờ bắt đầu
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Giờ kết thúc
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Số giờ
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {userShifts.map((shift) => (
                                        <tr
                                          key={shift.idCaLamViec}
                                          className="hover:bg-gray-100"
                                        >
                                          <td className="px-4 py-2 text-sm text-gray-900">
                                            {formatDate(shift.ngaylam)}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900">
                                            {formatTime(shift.giobatdau)}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900">
                                            {formatTime(shift.gioketthuc)}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900">
                                            {calculateWorkHours(
                                              shift.giobatdau,
                                              shift.gioketthuc
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}

                          {/* Salary History */}
                          {selectedUserId === user.idUsers &&
                            showSalaryHistory && (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="px-6 py-4 bg-gray-50"
                                >
                                  <div className="text-sm text-gray-900 font-medium mb-2">
                                    Lịch sử lương:
                                  </div>
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Ngày tính
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Lương cơ bản
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Thưởng
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Số ca
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                          Tổng lương
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {salaries
                                        .filter(
                                          (salary) =>
                                            salary.idUsers === user.idUsers
                                        )
                                        .map((salary) => (
                                          <tr
                                            key={salary.idLuong}
                                            className="hover:bg-gray-100"
                                          >
                                            <td className="px-4 py-2 text-sm text-gray-900">
                                              {formatDate(salary.ngaytinhluong)}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900">
                                              {formatCurrency(
                                                salary.luongcoban
                                              )}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900">
                                              {salary.thuong
                                                ? formatCurrency(salary.thuong)
                                                : "-"}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900">
                                              {salary.soca}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900">
                                              {formatCurrency(salary.tongluong)}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Không có dữ liệu nhân viên
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
