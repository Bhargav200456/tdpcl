const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const app = express();

/* ✅ MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ✅ DATABASE CONNECTION (RENDER + NEON) */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* ✅ TEST DATABASE CONNECTION */
pool.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ PostgreSQL connected");
  }
});

/* ✅ TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend is working");
});

/* 🔐 LOGIN */
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const dbUser = user.rows[0];

    if (password !== dbUser.password_hash) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    let teacher_id = null;

    if (dbUser.role === "teacher") {

      const teacher = await pool.query(
        "SELECT id FROM teachers WHERE user_id = $1",
        [dbUser.id]
      );

      if (teacher.rows.length > 0) {
        teacher_id = teacher.rows[0].id;
      }
    }

    res.json({
      id: dbUser.id,
      role: dbUser.role,
      name: dbUser.name,
      teacher_id,
    });

  } catch (err) {

    console.error("❌ LOGIN ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* 📚 GET TEACHER COURSES */
app.get("/teacher-courses/:teacher_id", async (req, res) => {

  const { teacher_id } = req.params;

  try {

    const courses = await pool.query(
      `SELECT id, course_name, course_code
       FROM courses
       WHERE teacher_id = $1`,
      [teacher_id]
    );

    res.json(courses.rows);

  } catch (err) {

    console.error("❌ COURSE ERROR:", err);

    res.status(500).json({
      message: "Error fetching courses",
    });
  }
});

/* 🕒 CREATE SESSION */
app.post("/create-session", async (req, res) => {

  const { course_id, teacher_id } = req.body;

  if (!course_id || !teacher_id) {
    return res.status(400).json({
      message: "Missing data",
    });
  }

  const token = uuidv4();

  try {

    const result = await pool.query(

      `INSERT INTO attendance_sessions
      (
        course_id,
        teacher_id,
        session_date,
        start_time,
        end_time,
        qr_code_token,
        is_active,
        created_at
      )
      VALUES
      (
        $1,
        $2,
        CURRENT_DATE,
        NOW(),
        NOW() + interval '10 minutes',
        $3,
        true,
        NOW()
      )
      RETURNING *`,

      [course_id, teacher_id, token]

    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error("❌ CREATE SESSION ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* 📷 SCAN QR */
app.post("/scan", async (req, res) => {

  const { token, student_id } = req.body;

  if (!token || !student_id) {
    return res.status(400).json({
      message: "Missing data",
    });
  }

  try {

    const session = await pool.query(
      `SELECT *
       FROM attendance_sessions
       WHERE qr_code_token = $1
       AND is_active = true
       AND NOW() BETWEEN start_time AND end_time`,
      [token]
    );

    if (session.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired QR",
      });
    }

    const session_id = session.rows[0].id;

    await pool.query(
      `INSERT INTO attendance_records
      (session_id, student_id, scanned_at, status)
      VALUES ($1, $2, NOW(), 'present')`,
      [session_id, student_id]
    );

    res.json({
      message: "Attendance marked successfully",
    });

  } catch (err) {

    console.error("❌ SCAN ERROR:", err);

    res.status(500).json({
      message: "Scan failed",
    });
  }
});

/* ✍️ MANUAL ATTENDANCE */
app.post("/manual", async (req, res) => {

  const { session_id, student_id } = req.body;

  if (!session_id || !student_id) {
    return res.status(400).json({
      message: "Missing data",
    });
  }

  try {

    await pool.query(
      `INSERT INTO attendance_records
      (session_id, student_id, scanned_at, status)
      VALUES ($1, $2, NOW(), 'present')`,
      [session_id, student_id]
    );

    res.json({
      message: "Attendance marked manually",
    });

  } catch (err) {

    console.error("❌ MANUAL ERROR:", err);

    res.status(500).json({
      message: "Manual attendance failed",
    });
  }
});

/* ✅ PORT FOR RENDER */
const PORT = process.env.PORT || 5000;

/* 🚀 START SERVER */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});