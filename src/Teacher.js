import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  createSession,
  manualMark,
  getTeacherCourses
} from "./api";

export default function Teacher({ onLogout, user }) {

  const [sessionId, setSessionId] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [manualSession, setManualSession] = useState("");
  const [manualStudent, setManualStudent] = useState("");
  const [manualStatus, setManualStatus] = useState("");

  const [loading, setLoading] = useState(false);

  /* 📚 FETCH TEACHER COURSES */
  useEffect(() => {

    if (!user?.teacher_id) return;

    const fetchCourses = async () => {

      const data = await getTeacherCourses(
        user.teacher_id
      );

      setCourses(data || []);
    };

    fetchCourses();

  }, [user]);

  /* 🕒 GENERATE QR */
  const generateQR = async () => {

    if (!selectedCourse) {
      alert("Please select a subject");
      return;
    }

    setLoading(true);

    try {

      const data = await createSession(
        selectedCourse,
        user.teacher_id
      );

      if (!data || !data.qr_code_token) {
        alert("Failed to create session");
        setLoading(false);
        return;
      }

      const canvas = document.createElement("canvas");

      await QRCode.toCanvas(canvas, data.qr_code_token, {
        width: 260,
        margin: 2,
      });

      const qrDiv = document.getElementById("qrcode");

      qrDiv.innerHTML = "";
      qrDiv.appendChild(canvas);

      setSessionId(data.id);

    } catch (err) {

      console.error(err);
      alert("QR generation failed");

    }

    setLoading(false);
  };

  /* ✍️ MANUAL ATTENDANCE */
  const handleManual = async () => {

    if (!manualSession || !manualStudent) {
      setManualStatus("Enter all fields");
      return;
    }

    const res = await manualMark(
      manualSession,
      manualStudent
    );

    setManualStatus(
      res.message || "Attendance marked"
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#eef2f7",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "450px"
      }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>

          <div style={{
            fontWeight: "bold",
            color: "#333",
            fontSize: "18px"
          }}>
            👨‍🏫 {user?.name}
          </div>

          <button
            onClick={onLogout}
            style={{
              background: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>

        {/* TITLE */}
        <h2 style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#222"
        }}>
          Teacher Dashboard
        </h2>

        {/* CREATE SESSION */}
        <div style={{
          background: "#fff",
          padding: "22px",
          borderRadius: "14px",
          marginBottom: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>

          <h3 style={{
            textAlign: "center",
            marginBottom: "15px",
            color: "#333"
          }}>
            Create Attendance Session
          </h3>

          <select
            value={selectedCourse}
            onChange={(e) =>
              setSelectedCourse(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "15px",
              fontSize: "15px"
            }}
          >

            <option value="">
              Select Subject
            </option>

            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name} ({c.course_code})
              </option>
            ))}

          </select>

          <button
            onClick={generateQR}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading
                ? "#999"
                : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {loading
              ? "Generating..."
              : "Generate QR"}
          </button>

          {/* QR */}
          <div
            id="qrcode"
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          ></div>

          {/* SESSION */}
          {sessionId && (
            <div style={{
              marginTop: "15px",
              textAlign: "center",
              background: "#f7f7f7",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              color: "#333"
            }}>
              Session ID: {sessionId}
            </div>
          )}

        </div>

        {/* MANUAL ATTENDANCE */}
        <div style={{
          background: "#fff",
          padding: "22px",
          borderRadius: "14px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>

          <h3 style={{
            textAlign: "center",
            marginBottom: "15px"
          }}>
            Manual Attendance
          </h3>

          <input
            value={manualSession}
            onChange={(e) =>
              setManualSession(e.target.value)
            }
            placeholder="Session ID"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <input
            value={manualStudent}
            onChange={(e) =>
              setManualStudent(e.target.value)
            }
            placeholder="Student ID"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={handleManual}
            style={{
              width: "100%",
              padding: "13px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            Mark Attendance
          </button>

          <div style={{
            textAlign: "center",
            marginTop: "15px",
            color: "#007bff",
            fontWeight: "bold"
          }}>
            {manualStatus}
          </div>

        </div>

      </div>

    </div>
  );
}