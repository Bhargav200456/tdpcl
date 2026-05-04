// 🔴 PASTE YOUR IP HERE BEFORE DEMO
// Example: http://192.168.1.5:5000
const API_URL = "http://192.168.137.1:5000"; 

// 🔥 Auto fallback (prevents crash if you forget to set it)
const BASE_URL = API_URL || "http://localhost:5000";

/* 🔐 LOGIN */
export async function loginUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    return await res.json();
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return { message: "Login failed" };
  }
}

/* 📚 GET COURSES */
export async function getTeacherCourses(id) {
  try {
    const res = await fetch(`${BASE_URL}/teacher-courses/${id}`);
    return await res.json();
  } catch (err) {
    console.error("COURSE ERROR:", err);
    return [];
  }
}

/* 🕒 CREATE SESSION */
export async function createSession(course_id, teacher_id) {
  try {
    const res = await fetch(`${BASE_URL}/create-session`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ course_id, teacher_id })
    });

    return await res.json();
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    return null;
  }
}

/* 📷 SCAN QR */
export async function scanQR(token, student_id) {
  try {
    const res = await fetch(`${BASE_URL}/scan`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ token, student_id })
    });

    return await res.json();
  } catch (err) {
    console.error("SCAN ERROR:", err);
    return { message: "Scan failed" };
  }
}

/* ✍️ MANUAL */
export async function manualMark(session_id, student_id) {
  try {
    const res = await fetch(`${BASE_URL}/manual`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ session_id, student_id })
    });

    return await res.json();
  } catch (err) {
    console.error("MANUAL ERROR:", err);
    return { message: "Manual failed" };
  }
}