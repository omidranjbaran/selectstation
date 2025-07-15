import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
      }}
    >
      <Particles
        init={particlesInit}
        options={{
          background: { color: { value: "#1A365D" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 140, links: { opacity: 0.7 } },
              push: { quantity: 4 },
            },
          },
          particles: {
            color: { value: ["#3b82f6", "#06b6d4", "#facc15", "#ec4899"] },
            links: {
              enable: true,
              distance: 150,
              color: "#60a5fa",
              opacity: 0.4,
              width: 1.5,
            },
            collisions: { enable: true },
            move: {
              enable: true,
              speed: 2,
              outModes: { default: "out" },
            },
            number: { value: 70, density: { enable: true, area: 900 } },
            opacity: {
              value: 0.6,
              random: true,
              anim: { enable: true, speed: 1, opacity_min: 0.3 },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 2, max: 6 },
              random: true,
              anim: { enable: true, speed: 5, size_min: 2 },
            },
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

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          paddingTop: "20vh",
          color: "white",
          textShadow: "0 0 8px rgba(0,0,0,0.7)",
          fontFamily: "'Vazir', Tahoma, sans-serif",
        }}
      >
        <h1
          style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "1rem" }}
        >
          ۴۰۴ - صفحه پیدا نشد
        </h1>
        <p
          style={{
            maxWidth: "600px",
            margin: "0 auto 3rem",
            fontWeight: "400",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          متأسفیم! صفحه‌ای که به دنبال آن بودید پیدا نشد یا ممکن است حذف شده
          باشد.
        </p>
        <Link
          to="/"
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "14px 48px",
            borderRadius: "30px",
            fontWeight: "700",
            boxShadow: "0 6px 16px rgba(59,130,246,0.6)",
            textDecoration: "none",
            fontSize: "1.05rem",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          بازگشت به صفحه اصلی
        </Link>
        <footer
          style={{
            marginTop: "12rem",
            opacity: 0.6,
            fontWeight: "400",
            fontSize: "0.9rem",
          }}
        >
          © ۲۰۲۵ سامانه ثبت ایستگاه
        </footer>
      </div>
    </div>
  );
}
