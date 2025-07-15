import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../lib/api";

// رفع مشکل آیکون مارکر
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [stationName, setStationName] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await api.get("locations/stations/stats/");
      setStats(res.data);
    } catch (err) {
      console.error("خطا در دریافت آمار ایستگاه‌ها:", err);
      toast.error("خطا در دریافت آمار ایستگاه‌ها");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const requestDeleteStation = (station) => {
    setStationToDelete(station);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!stationToDelete) return;
    try {
      await api.delete(`locations/stations/${stationToDelete.id}/delete/`);
      toast.success("ایستگاه با موفقیت حذف شد!");
      fetchStats();
    } catch (err) {
      console.error("خطا در حذف ایستگاه:", err);
      toast.error("خطا در حذف ایستگاه!");
    }
    setShowDeleteModal(false);
    setStationToDelete(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleCreateStation = async (e) => {
    e.preventDefault();
    if (!stationName || !location) {
      toast.error("لطفاً نام ایستگاه و موقعیت روی نقشه را انتخاب کنید.");
      return;
    }
    setLoading(true);
    try {
      await api.post("locations/stations/create/", {
        name: stationName,
        latitude: location.lat,
        longitude: location.lng,
      });
      toast.success("ایستگاه جدید با موفقیت اضافه شد!");
      setStationName("");
      setLocation(null);
      fetchStats();
    } catch (err) {
      console.error("خطا در افزودن ایستگاه:", err);
      toast.error("خطا در افزودن ایستگاه!");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-8"
      dir="rtl"
      style={{ fontFamily: "Vazir, Tahoma, sans-serif" }}
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">داشبورد مدیر</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          خروج
        </button>
      </header>

      {/* آمار ایستگاه‌ها */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          آمار انتخاب ایستگاه‌ها توسط دانشجویان
        </h2>
        {stats.length === 0 ? (
          <p className="text-gray-500">هیچ اطلاعاتی موجود نیست.</p>
        ) : (
          <ul className="space-y-4">
            {stats.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-blue-100 px-4 py-2 rounded-lg shadow"
              >
                <span className="font-semibold text-blue-900 flex-1">
                  {item.name}
                </span>
                <span className="text-sm text-gray-700 w-20 text-center">
                  {item.count} نفر
                </span>
                <button
                  onClick={() => requestDeleteStation(item)}
                  className="bg-red-500 cursor-pointer  text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* نقشه و فرم ثبت ایستگاه */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          افزودن ایستگاه جدید روی نقشه
        </h2>

        {!showDeleteModal && (
          <MapContainer
            center={[32.6546, 51.6675]}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector onSelect={setLocation} />
            {location && <Marker position={[location.lat, location.lng]} />}
          </MapContainer>
        )}

        <form
          onSubmit={handleCreateStation}
          className="mt-4 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="نام ایستگاه"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "در حال ثبت..." : "ثبت ایستگاه"}
          </button>
        </form>
      </div>

      {/* مودال حذف */}
      {showDeleteModal && (
        <div
          className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-lg  shadow-lg p-6 max-w-sm w-full translate-y-[-100px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">تایید حذف ایستگاه</h3>
            <p className="mb-6">
              آیا مطمئن هستید که می‌خواهید ایستگاه{" "}
              <span className="font-semibold">{stationToDelete?.name}</span> را
              حذف کنید؟
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded cursor-pointer  bg-gray-300 hover:bg-gray-400 transition"
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded cursor-pointer  bg-red-500 text-white hover:bg-red-600 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

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
