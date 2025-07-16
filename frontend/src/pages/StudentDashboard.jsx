import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

import LogoutButton from "../components/LogoutButton";
import api from "../lib/api";
import { toast, ToastContainer } from "react-toastify";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import EditUserModal from "../components/UserEditModal";

// تنظیمات آیکون پیش‌فرض Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function StudentDashboard() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [saving, setSaving] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const username = localStorage.getItem("username") || "دانشجو";

  // گرفتن لیست ایستگاه‌ها و اطلاعات کاربر و ایستگاه انتخاب شده قبلی
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsResponse, selectedStationResponse, userResponse] =
          await Promise.all([
            api.get("locations/stations/"),
            api.get("locations/student-station/"),
            api.get("auth/users/me/"), // آدرس دریافت اطلاعات کاربر (ممکن است لازم باشد اصلاح شود)
          ]);

        setStations(stationsResponse.data);

        const selectedId = selectedStationResponse.data.station;
        const matchedStation = stationsResponse.data.find(
          (station) => station.id === selectedId
        );
        if (matchedStation) setSelectedStation(matchedStation);

        setUserInfo(userResponse.data);
      } catch (err) {
        console.error("خطا در دریافت داده‌ها:", err);
        toast.error("خطا در دریافت اطلاعات");
      }
    };

    fetchData();
  }, []);

  // ذخیره ایستگاه انتخاب‌شده
  const handleSave = async () => {
    if (!selectedStation) return;
    setSaving(true);
    try {
      await api.put("locations/student-station/", {
        station: selectedStation.id,
      });
      toast.success("ایستگاه با موفقیت ذخیره شد!");
    } catch (error) {
      console.error("خطا در ذخیره ایستگاه:", error);
      toast.error("خطا در ذخیره ایستگاه، لطفا دوباره تلاش کنید.");
    }
    setSaving(false);
  };

  // ذخیره تغییرات اطلاعات کاربر
  const handleUserSave = async (updatedData) => {
    try {
      const response = await api.put("auth/users/me/", updatedData);
      setUserInfo(response.data);
      toast.success("اطلاعات با موفقیت ذخیره شد");
      setEditModalOpen(false);
    } catch (error) {
      console.error("خطا در ذخیره اطلاعات:", error);
      toast.error("خطا در ذخیره اطلاعات");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-green-200 via-green-300 to-green-400 p-8"
      dir="rtl"
      style={{ fontFamily: "Vazir, Tahoma, sans-serif" }}
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-900">داشبورد دانشجو</h1>
        <LogoutButton />
      </header>

      <main className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
        <p className="text-lg mb-4">
          سلام، <span className="font-semibold">{username}</span> عزیز! خوش آمدی
          به داشبورد دانشجویان.
        </p>

        <button
          onClick={() => setEditModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ویرایش اطلاعات کاربری
        </button>

        <ul className="list-disc list-inside text-green-800 mb-6">
          <li>دسترسی به دوره‌ها و منابع آموزشی</li>
          <li>مشاهده نمرات و وضعیت تحصیلی</li>
          <li>ارتباط با اساتید و پشتیبانی</li>
        </ul>

        {/* نقشه ایستگاه‌ها */}
        <h2 className="text-xl font-semibold mb-4 text-green-900">
          انتخاب ایستگاه سوار شدن
        </h2>
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg mt-4">
          <MapContainer
            center={[32.6546, 51.6675]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.latitude, station.longitude]}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
                icon={
                  selectedStation && selectedStation.id === station.id
                    ? new L.Icon({
                        iconUrl:
                          "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32],
                      })
                    : new L.Icon.Default()
                }
              >
                <Popup>{station.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* دکمه ذخیره */}
        <div className="mt-4 text-center">
          <button
            disabled={!selectedStation || saving}
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg font-semibold text-white cursor-pointer ${
              selectedStation
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "در حال ذخیره..." : "ذخیره ایستگاه انتخاب شده"}
          </button>
          {selectedStation && (
            <p className="mt-2 text-green-800">
              ایستگاه انتخاب شده: {selectedStation.name}
            </p>
          )}
        </div>
      </main>

      {/* مودال ویرایش کاربر */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userData={userInfo}
        onSave={handleUserSave}
      />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
