import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function HomePage() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        minHeight: "100vh",
        fontFamily: "'Vazir', Tahoma, sans-serif",
        backgroundColor: "#0f172a",
        color: "#e0e0e0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Particles
        id="tsparticles"
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
              direction: "none",
              random: false,
              straight: false,
              outModes: { default: "out" },
              attract: { enable: false },
            },
            number: { value: 70, density: { enable: true, area: 900 } },
            opacity: {
              value: 0.6,
              random: true,
              anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 2, max: 6 },
              random: true,
              anim: { enable: true, speed: 5, size_min: 2, sync: false },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "480px",
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          padding: "3rem 2.5rem",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          userSelect: "none",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <h1
          style={{
            fontSize: "3.6rem",
            fontWeight: "900",
            marginBottom: "1.2rem",
            color: "#f3f4f6",
            textShadow: "0 0 10px #60a5fa, 0 0 20px #2563eb, 0 0 30px #1e40af", // simple animated glow (you can animate it later)
          }}
        >
          سامانه ثبت ایستگاه
        </h1>
        <p
          style={{
            fontWeight: "400",
            fontSize: "1.25rem",
            lineHeight: "1.7",
            marginBottom: "2rem",
            color: "#d1d5db",
          }}
        >
          به سامانه ما خوش آمدید! اینجا می‌توانید ایستگاه‌های خود را به راحتی
          ثبت و مدیریت کنید. برای شروع، لطفاً وارد حساب کاربری خود شوید یا
          ثبت‌نام کنید.
        </p>

        <a
          href="/login"
          style={{
            background: "linear-gradient(90deg, #2563eb, #3b82f6, #2563eb)",
            backgroundSize: "200% 100%",
            color: "white",
            padding: "14px 56px",
            borderRadius: "28px",
            fontWeight: "700",
            fontSize: "1.2rem",
            textDecoration: "none",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.5)",
            transition:
              "background-position 0.5s ease, transform 0.2s ease, box-shadow 0.3s ease",
            display: "inline-block",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundPosition = "100% 0";
            e.currentTarget.style.transform = "scale(1.07)";
            e.currentTarget.style.boxShadow =
              "0 12px 30px rgba(30, 64, 175, 0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundPosition = "0 0";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(37, 99, 235, 0.5)";
          }}
        >
          ورود به سامانه
        </a>

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "1rem",
            color: "#818cf8",
          }}
        >
          حساب کاربری ندارید؟{" "}
          <a
            href="/register"
            style={{ color: "#a5b4fc", textDecoration: "underline" }}
          >
            ثبت‌نام کنید
          </a>
        </p>

        <footer
          style={{
            marginTop: "3.5rem",
            fontWeight: "400",
            fontSize: "0.85rem",
            color: "#94a3b8",
            userSelect: "none",
          }}
        >
          © ۲۰۲۵ سامانه ثبت ایستگاه. همه حقوق محفوظ است.
        </footer>
      </div>
    </div>
  );
}
