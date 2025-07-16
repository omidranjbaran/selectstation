import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

import api from "../lib/api";
import LogoutButton from "../components/LogoutButton";
import UserManagement from "../pages/UserManagement";
import DeleteButton from "../components/DeleteButton";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import UserBadge from "../components/UserBadge";  // <-- ایمپورت UserBadge

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

function StationForm({
  stationName,
  setStationName,
  location,
  setLocation,
  onSubmit,
  loading,
}) {
  return (
    <>
      <MapContainer
        center={[32.6546, 51.6675]}
        zoom={12}
        style={{ height: "400px", width: "100%", zIndex: 0 }}
        className="rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationSelector onSelect={setLocation} />
        {location && <Marker position={[location.lat, location.lng]} />}
      </MapContainer>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <input
          type="text"
          placeholder="نام ایستگاه"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          className="px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          dir="rtl"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "در حال ثبت..." : "ثبت ایستگاه"}
        </button>
      </form>
    </>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stationName, setStationName] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [username, setUsername] = useState("کاربر ناشناس");

  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await api.get("locations/stations/stats/");
      setStats(res.data);
      setFilteredStats(res.data);
    } catch (err) {
      console.error("خطا در دریافت آمار ایستگاه‌ها:", err);
      toast.error("خطا در دریافت آمار ایستگاه‌ها");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStats(stats);
    } else {
      const filtered = stats.filter((station) =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStats(filtered);
    }
  }, [searchTerm, stats]);

  useEffect(() => {
    // بارگزاری نام کاربر از localStorage
    const user = localStorage.getItem("username");
    if (user) setUsername(user);
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

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div
      className="min-h-screen p-8 relative overflow-hidden"
      dir="rtl"
      style={{ fontFamily: "Vazir, Tahoma, sans-serif" }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "#bfdbfe" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 140, line_linked: { opacity: 0.5 } },
              push: { quantity: 4 },
            },
          },
          particles: {
            color: { value: "#2563eb" },
            links: {
              color: "#2563eb",
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1,
            },
            collisions: { enable: false },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: true,
              speed: 1,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.6 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">داشبورد مدیر</h1>

          <UserBadge username={username} />

          <LogoutButton />
        </header>

        <div className="flex flex-col 2xl:flex-row 2xl:items-start gap-8">
          {/* بخش نقشه و فرم - سمت چپ */}
          <section
            className="w-full 2xl:w-3/5 mb-60 bg-white rounded-xl shadow-lg p-4 2xl:p-6 flex flex-col"
            style={{ minHeight: "600px" }}
          >
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              افزودن ایستگاه جدید روی نقشه
            </h2>

            {!showDeleteModal && (
              <StationForm
                stationName={stationName}
                setStationName={setStationName}
                location={location}
                setLocation={setLocation}
                onSubmit={handleCreateStation}
                loading={loading}
              />
            )}
          </section>

          {/* بخش آمار و مدیریت کاربران - سمت راست */}
          <section className="w-full 2xl:w-2/5 flex flex-col gap-6">
            <div
              className="bg-white rounded-xl shadow-md p-6  2xl:mt-auto -mt-50 "
              style={{ maxHeight: "400px", overflowY: "auto", position: "relative" }}
            >
              <h2 className="text-xl font-semibold mb-5 text-blue-900 border-b border-blue-300 pb-2">
                آمار انتخاب ایستگاه‌ها توسط دانشجویان
              </h2>

              {/* کانتینر جستجو فیکس شده */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "white",
                  paddingBottom: "1rem",
                  zIndex: 10,
                }}
              >
                <input
                  type="text"
                  placeholder="جستجوی ایستگاه..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                  autoComplete="off"
                />
              </div>

              {filteredStats.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">هیچ اطلاعاتی موجود نیست.</p>
              ) : (
                <ul className="space-y-3 mt-4">
                  {filteredStats.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition rounded-md px-5 py-3 shadow-sm"
                    >
                      <span className="font-semibold text-blue-900 flex-1">{item.name}</span>
                      <span className="text-sm text-gray-700 min-w-[80px] text-center">{item.count} نفر</span>
                      <div className="flex-shrink-0">
                        <DeleteButton onClick={() => requestDeleteStation(item)} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 2xl:p-6">
              <UserManagement />
            </div>
          </section>
        </div>

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          itemName={stationToDelete?.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
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
    </div>
  );
}
