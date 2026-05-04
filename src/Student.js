import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { scanQR } from "./api";

export default function Student({ onLogout, user }) {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250
    });

    scanner.render(async (decodedText) => {
      const student_id = document.getElementById("studentId").value;

      if (!student_id) {
        alert("Enter Student ID first");
        return;
      }

      const res = await scanQR(decodedText, student_id);
      document.getElementById("status").innerText = res.message;
    });

    return () => scanner.clear();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* 🔝 HEADER WITH LOGOUT */}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
      }}>
        <span style={{ fontWeight: "bold" }}>
          👨‍🎓 {user?.name}
        </span>

        <button
          onClick={onLogout}
          style={{
            padding: "8px 12px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* 📦 MAIN CARD */}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>

        <h2 style={{
          marginBottom: "15px",
          color: "#333"
        }}>
          Scan Attendance
        </h2>

        <input
          id="studentId"
          placeholder="Enter Student ID"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
            outline: "none"
          }}
        />

        <div
          id="reader"
          style={{
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            border: "2px solid #eee"
          }}
        ></div>

        <p
          id="status"
          style={{
            marginTop: "15px",
            fontSize: "15px",
            color: "#007bff",
            minHeight: "20px"
          }}
        ></p>

      </div>
    </div>
  );
}