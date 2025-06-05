"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Calculator,
  FileText,
  Info,
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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchAllShifts();
    fetchAllSalaries();

    // Event listener for sidebar toggle
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarExpanded(event.detail.expanded);
    };

    window.addEventListener(
      "sidebarToggle",
      handleSidebarToggle as EventListener
    );

    return () => {
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarToggle as EventListener
      );
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu người dùng");
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        setUsers(data.data);

        const initialInputs = data.data.reduce(
          (acc: { [key: number]: UserSalaryInput }, user: User) => {
            acc[user.idUsers] = {
              baseSalary: 50000,
              bonus: 100000,
            };
            return acc;
          },
          {}
        );
        setUserSalaryInputs(initialInputs);
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
      setSalaries(data.data || []);
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
          defaultBonus: userInput.bonus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate salary");
      }

      const data = await response.json();

      if (data.data) {
        setSalaryReports((prev) => {
          const otherReports = prev.filter((r) => r.idUsers !== userId);
          return [...otherReports, data.data];
        });

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

  // Function to handle sidebar toggle from child component
  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div>
      <SalesDashboard onSidebarToggle={handleSidebarToggle} />
      <div
        className={`transition-all duration-300 ${
          sidebarExpanded ? "md:pl-64" : "md:pl-16"
        } pt-14`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <DollarSign className="mr-2 text-blue-600" />
              Quản Lý Lương Nhân Viên
            </h1>

            {/* Period Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="text-blue-600" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="text-blue-600" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setShowShiftDetails(!showShiftDetails)}
                className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                  showShiftDetails
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="mr-2 h-4 w-4" />
                Chi tiết ca làm việc
              </button>
              <button
                onClick={() => setShowSalaryHistory(!showSalaryHistory)}
                className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                  showSalaryHistory
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Lịch sử lương
              </button>
            </div>

            {/* Information Card */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Chọn tháng và năm để tính lương. Nhấn vào hàng để xem chi
                    tiết. Điều chỉnh lương cơ bản và thưởng trước khi tính
                    lương.
                  </p>
                </div>
              </div>
            </div>

            {/* Employee Salary Table */}
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
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
                            className={`hover:bg-gray-50 cursor-pointer ${
                              selectedUserId === user.idUsers
                                ? "bg-blue-50"
                                : ""
                            }`}
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
                                <Users className="h-5 w-5 text-blue-500 mr-2" />
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
                                onClick={(e) => e.stopPropagation()}
                                className="form-input block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
                                onClick={(e) => e.stopPropagation()}
                                className="form-input block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center transition-colors disabled:bg-blue-300"
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
                                  className="px-0 py-0 bg-gray-50"
                                >
                                  <div className="mx-6 my-4 bg-white rounded-md shadow-sm border border-gray-200">
                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-t-md font-medium">
                                      Chi tiết ca làm việc - {user.Tentaikhoan}
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Ngày
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Giờ bắt đầu
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Giờ kết thúc
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
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
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}

                          {/* Salary History */}
                          {selectedUserId === user.idUsers &&
                            showSalaryHistory && (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="px-0 py-0 bg-gray-50"
                                >
                                  <div className="mx-6 my-4 bg-white rounded-md shadow-sm border border-gray-200">
                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-t-md font-medium">
                                      Lịch sử lương - {user.Tentaikhoan}
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Ngày tính
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Lương cơ bản
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Thưởng
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Số ca
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
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
                                                  {formatDate(
                                                    salary.ngaytinhluong
                                                  )}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                  {formatCurrency(
                                                    salary.luongcoban
                                                  )}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                  {salary.thuong
                                                    ? formatCurrency(
                                                        salary.thuong
                                                      )
                                                    : "-"}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                  {salary.soca}
                                                </td>
                                                <td className="px-4 py-2 text-sm font-medium text-green-600">
                                                  {formatCurrency(
                                                    salary.tongluong
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          {salaries.filter(
                                            (salary) =>
                                              salary.idUsers === user.idUsers
                                          ).length === 0 && (
                                            <tr>
                                              <td
                                                colSpan={5}
                                                className="px-4 py-4 text-center text-sm text-gray-500"
                                              >
                                                Chưa có dữ liệu lương
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
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
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <Users className="h-10 w-10 text-gray-400 mb-2" />
                          <span>Không có dữ liệu nhân viên</span>
                        </div>
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
