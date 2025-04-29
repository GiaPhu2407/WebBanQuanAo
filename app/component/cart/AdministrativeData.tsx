import { useState, useEffect } from "react";

interface Province {
  Id: string;
  Name: string;
  Districts: District[];
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Ward {
  Id: string;
  Name: string;
}

interface AdministrativeDataProps {
  onLocationChange: (location: {
    province: string;
    district: string;
    ward: string;
  }) => void;
  initialProvince?: string;
  initialDistrict?: string;
  initialWard?: string;
}

export const AdministrativeData = ({
  onLocationChange,
  initialProvince = "",
  initialDistrict = "",
  initialWard = "",
}: AdministrativeDataProps) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch provinces data
  useEffect(() => {
    const fetchAdministrativeData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch administrative data");
        }

        const data = await response.json();
        setProvinces(data);

        // If initial values are provided, select them
        if (initialProvince) {
          const province = data.find(
            (p: Province) => p.Name === initialProvince
          );
          if (province) {
            setSelectedProvince(province);

            if (initialDistrict && province.Districts) {
              const district = province.Districts.find(
                (d: District) => d.Name === initialDistrict
              );
              if (district) {
                setSelectedDistrict(district);

                if (initialWard && district.Wards) {
                  const ward = district.Wards.find(
                    (w: Ward) => w.Name === initialWard
                  );
                  if (ward) {
                    setSelectedWard(ward);
                  }
                }
              }
            }
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching administrative data:", err);
        setError("Không thể tải dữ liệu hành chính. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchAdministrativeData();
  }, [initialProvince, initialDistrict, initialWard]);

  // Notify parent component when location changes
  useEffect(() => {
    if (selectedProvince) {
      const location = {
        province: selectedProvince.Name,
        district: selectedDistrict?.Name || "",
        ward: selectedWard?.Name || "",
      };
      console.log("Location changed:", location);
      onLocationChange(location);
    }
  }, [selectedProvince, selectedDistrict, selectedWard, onLocationChange]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const province = provinces.find((p) => p.Id === provinceId) || null;
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    if (selectedProvince) {
      const district =
        selectedProvince.Districts.find((d) => d.Id === districtId) || null;
      setSelectedDistrict(district);
      setSelectedWard(null);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = e.target.value;
    if (selectedDistrict) {
      const ward = selectedDistrict.Wards.find((w) => w.Id === wardId) || null;
      setSelectedWard(ward);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        <span className="text-gray-500">
          Đang tải dữ liệu địa giới hành chính...
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tỉnh/Thành phố
        </label>
        <select
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProvince?.Id || ""}
          onChange={handleProvinceChange}
        >
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {provinces.map((province) => (
            <option key={province.Id} value={province.Id}>
              {province.Name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quận/Huyện
        </label>
        <select
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDistrict?.Id || ""}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <option value="">-- Chọn Quận/Huyện --</option>
          {selectedProvince?.Districts.map((district) => (
            <option key={district.Id} value={district.Id}>
              {district.Name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phường/Xã
        </label>
        <select
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedWard?.Id || ""}
          onChange={handleWardChange}
          disabled={!selectedDistrict}
        >
          <option value="">-- Chọn Phường/Xã --</option>
          {selectedDistrict?.Wards.map((ward) => (
            <option key={ward.Id} value={ward.Id}>
              {ward.Name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
