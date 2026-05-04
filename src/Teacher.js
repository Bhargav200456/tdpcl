import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { createSession, manualMark, getTeacherCourses } from "./api";

export default function Teacher({ onLogout, user }) {
  const [sessionId, setSessionId] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [manualSession, setManualSession] = useState("");
  const [manualStudent, setManualStudent] = useState("");
  const [manualStatus, setManualStatus] = useState("");

  // 📚 Fetch courses
  useEffect(() => {
    if (!user?.teacher_id) return;

    const fetchCourses = async () => {
      const data = await getTeacherCourses(user.teacher_id);
      setCourses(data || []);
    };

    fetchCourses();
  }, [user]);

  // 🕒 Generate QR
  const generateQR = async () => {
    if (!selectedCourse) {
      alert("Select a subject");
      return;
    }

    const data = await createSession(selectedCourse, user.teacher_id);

    if (!data || !data.qr_code_token) {
      alert("Failed to create session");
      return;
    }

    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, data.qr_code_token);

    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    qrDiv.appendChild(canvas);

    setSessionId(data.id);
  };

  // ✍️ Manual attendance
  const handleManual = async () => {
    if (!manualSession || !manualStudent) {
      setManualStatus("Enter all fields");
      return;
    }

    const res = await manualMark(manualSession, manualStudent);
    setManualStatus(res.message || "Done");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      padding: "20px",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px"
        }}>
          <span>👨‍🏫 {user?.name}</span>

          <button onClick={onLogout}
            style={{
              background: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "8px",
              borderRadius: "6px"
            }}>
            Logout
          </button>
        </div>

        <h2 style={{ textAlign: "center" }}>Teacher Dashboard</h2>

        {/* CREATE SESSION */}
        <div style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px"
        }}>
          <h3>Create Session</h3>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            <option value="">Select Subject</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name} ({c.course_code})
              </option>
            ))}
          </select>

          <button onClick={generateQR}
            style={{
              width: "100%",
              padding: "12px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px"
            }}>
            Generate QR
          </button>

          <div id="qrcode" style={{ marginTop: "20px", textAlign: "center" }}></div>

          <p style={{ textAlign: "center" }}>
            Session ID: {sessionId}
          </p>
        </div>

        {/* MANUAL */}
        <div style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <h3>Manual Attendance</h3>

          <input
            value={manualSession}
            onChange={(e) => setManualSession(e.target.value)}
            placeholder="Session ID"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            value={manualStudent}
            onChange={(e) => setManualStudent(e.target.value)}
            placeholder="Student ID"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <button onClick={handleManual}
            style={{
              width: "100%",
              padding: "12px",
              background: "green",
              color: "#fff",
              border: "none",
              borderRadius: "8px"
            }}>
            Mark Attendance
          </button>

          <p style={{ textAlign: "center" }}>
            {manualStatus}
          </p>
        </div>

      </div>
    </div>
  );
}