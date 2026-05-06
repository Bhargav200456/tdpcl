import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { scanQR } from "./api";

export default function Student({ onLogout, user }) {

  const [status, setStatus] = useState("");
  const [scanned, setScanned] = useState(false);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      async (decodedText) => {

        /* 🚫 PREVENT MULTIPLE SCANS */
        if (scanned) return;

        setScanned(true);

        try {

          const res = await scanQR(
            decodedText,
            user.id
          );

          setStatus(
            res.message || "Attendance marked"
          );

        } catch (err) {

          console.error(err);

          setStatus("Scan failed");

        }

        /* 🔄 ALLOW RESCAN AFTER 5s */
        setTimeout(() => {
          setScanned(false);
        }, 5000);

      },

      (error) => {
        /* silent scanner errors */
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, [user, scanned]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#eef2f7",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* 🔝 HEADER */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px"
      }}>

        <div style={{
          fontWeight: "bold",
          color: "#333",
          fontSize: "17px"
        }}>
          👨‍🎓 {user?.name}
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: "9px 14px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>

      </div>

      {/* 📦 MAIN CARD */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "22px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        textAlign: "center"
      }}>

        <h2 style={{
          marginBottom: "8px",
          color: "#222"
        }}>
          Scan Attendance
        </h2>

        <p style={{
          marginBottom: "18px",
          color: "#666",
          fontSize: "14px"
        }}>
          Point your camera at the QR code
        </p>

        {/* 📷 QR READER */}
        <div
          id="reader"
          style={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "14px",
            border: "2px solid #e5e5e5",
            background: "#fafafa"
          }}
        ></div>

        {/* ✅ STATUS */}
        <div style={{
          marginTop: "18px",
          minHeight: "24px",
          fontWeight: "bold",
          color:
            status.includes("marked")
              ? "green"
              : "#007bff",
          fontSize: "15px"
        }}>
          {status}
        </div>

      </div>

    </div>
  );
}