import React from "react";

const LoadingTruck = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full bg-gray-50">
      <div className="flex flex-col items-center justify-end relative w-[300px] h-[150px] overflow-hidden">
        {/* Container cho xe với animation */}
        <div className="absolute left-0 w-full animate-[truck-move_3s_linear_infinite]">
          <div className="relative w-[130px]">
            {/* SVG của xe */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 198 93"
              className="w-full"
            >
              <path
                strokeWidth="3"
                stroke="#282828"
                fill="#F83D3D"
                d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
              />
              <path
                strokeWidth="3"
                stroke="#282828"
                fill="#7D7C7C"
                d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
              />
              <path
                strokeWidth="2"
                stroke="#282828"
                fill="#282828"
                d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
              />
              <rect
                strokeWidth="2"
                stroke="#282828"
                fill="#FFFCAB"
                rx="1"
                height="7"
                width="5"
                y="63"
                x="187"
              />
              <rect
                strokeWidth="2"
                stroke="#282828"
                fill="#282828"
                rx="1"
                height="11"
                width="4"
                y="81"
                x="193"
              />
              <rect
                strokeWidth="3"
                stroke="#282828"
                fill="#DFDFDF"
                rx="2.5"
                height="90"
                width="121"
                y="1.5"
                x="6.5"
              />
              <rect
                strokeWidth="2"
                stroke="#282828"
                fill="#DFDFDF"
                rx="2"
                height="4"
                width="6"
                y="84"
                x="1"
              />
            </svg>

            {/* Bánh xe với animation */}
            <div className="absolute bottom-0 flex items-center justify-between w-full px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 30 30"
                className="w-6 animate-[wheel-spin_1s_linear_infinite]"
              >
                <circle
                  strokeWidth="3"
                  stroke="#282828"
                  fill="#282828"
                  r="13.5"
                  cy="15"
                  cx="15"
                />
                <circle fill="#DFDFDF" r="7" cy="15" cx="15" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 30 30"
                className="w-6 animate-[wheel-spin_1s_linear_infinite]"
              >
                <circle
                  strokeWidth="3"
                  stroke="#282828"
                  fill="#282828"
                  r="13.5"
                  cy="15"
                  cx="15"
                />
                <circle fill="#DFDFDF" r="7" cy="15" cx="15" />
              </svg>
            </div>
          </div>
        </div>

        {/* Đường đi */}
        <div className="absolute bottom-0 w-full">
          <div className="relative w-full h-[2px] bg-[#282828]">
            <div className="absolute top-0 left-0 w-full h-full animate-[road-move_1s_linear_infinite]">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-[2px] bg-white"
                  style={{ left: `${i * 40}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTruck;
