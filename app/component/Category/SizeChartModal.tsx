import React, { useState } from "react";

interface SizeChartModalProps {
  onClose: () => void;
}

interface SizeChartInfo {
  tenSize: string;
  chieuDai: string;
  vongNguc: string;
  vongEo: string;
  vongMong: string;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ onClose }) => {
  const [sizeChartData] = useState<SizeChartInfo[]>([
    {
      tenSize: "S",
      chieuDai: "65cm",
      vongNguc: "88cm",
      vongEo: "73cm",
      vongMong: "93cm",
    },
    {
      tenSize: "M",
      chieuDai: "67cm",
      vongNguc: "92cm",
      vongEo: "77cm",
      vongMong: "97cm",
    },
    {
      tenSize: "L",
      chieuDai: "69cm",
      vongNguc: "96cm",
      vongEo: "81cm",
      vongMong: "101cm",
    },
    {
      tenSize: "XL",
      chieuDai: "71cm",
      vongNguc: "100cm",
      vongEo: "85cm",
      vongMong: "105cm",
    },
    {
      tenSize: "XXL",
      chieuDai: "73cm",
      vongNguc: "104cm",
      vongEo: "89cm",
      vongMong: "109cm",
    },
  ]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Bảng Kích Thước</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chiều Dài
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vòng Ngực
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vòng Eo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vòng Mông
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sizeChartData.map((size, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {size.tenSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {size.chieuDai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {size.vongNguc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {size.vongEo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {size.vongMong}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-lg">Hướng dẫn đo kích thước:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                <span className="font-medium">Chiều dài:</span> Đo từ đỉnh vai
                đến phần dưới của áo
              </li>
              <li>
                <span className="font-medium">Vòng ngực:</span> Đo phần rộng
                nhất của ngực
              </li>
              <li>
                <span className="font-medium">Vòng eo:</span> Đo phần nhỏ nhất
                của eo
              </li>
              <li>
                <span className="font-medium">Vòng mông:</span> Đo phần rộng
                nhất của mông
              </li>
            </ul>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
