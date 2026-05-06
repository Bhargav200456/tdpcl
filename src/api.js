const API_URL = "https://tdpcl.onrender.com";
// 🔴 Replace with YOUR actual Render backend URL

/* 🔐 LOGIN */
export async function loginUser(email, password) {

  try {

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return await res.json();

  } catch (err) {

    console.error("LOGIN ERROR:", err);

    return {
      message: "Login failed",
    };
  }
}

/* 📚 GET COURSES */
export async function getTeacherCourses(teacher_id) {

  try {

    const res = await fetch(
      `${API_URL}/teacher-courses/${teacher_id}`
    );

    return await res.json();

  } catch (err) {

    console.error("COURSE ERROR:", err);

    return [];
  }
}

/* 🕒 CREATE SESSION */
export async function createSession(course_id, teacher_id) {

  try {

    const res = await fetch(`${API_URL}/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id,
        teacher_id,
      }),
    });

    return await res.json();

  } catch (err) {

    console.error("CREATE SESSION ERROR:", err);

    return {
      message: "Session creation failed",
    };
  }
}

/* 📷 SCAN QR */
export async function scanQR(token, student_id) {

  try {

    const res = await fetch(`${API_URL}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        student_id,
      }),
    });

    return await res.json();

  } catch (err) {

    console.error("SCAN ERROR:", err);

    return {
      message: "Scan failed",
    };
  }
}

/* ✍️ MANUAL ATTENDANCE */
export async function manualMark(session_id, student_id) {

  try {

    const res = await fetch(`${API_URL}/manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id,
        student_id,
      }),
    });

    return await res.json();

  } catch (err) {

    console.error("MANUAL ERROR:", err);

    return {
      message: "Manual attendance failed",
    };
  }
}