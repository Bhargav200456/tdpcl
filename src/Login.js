import { loginUser } from "./api";

export default function Login({ setUser }) {

  const handleLogin = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await loginUser(email, password);

    if (res.role) {
      setUser(res);
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      fontFamily: "Arial, sans-serif"
    }}>

      <div style={{
  background: "#ffffff",
  padding: "30px",
  borderRadius: "15px",
  width: "320px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  textAlign: "center",            // ✅ center text
  display: "flex",                // ✅ flex layout
  flexDirection: "column",
  alignItems: "center"            // ✅ center everything horizontally
}}>

        <h2 style={{
          marginBottom: "20px",
          color: "#333"
        }}>
          Attendance
        </h2>

        <p style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "20px"
        }}>
          LOGIN TO MARK YOUR ATTENDANCE
        </p>

        <input
  id="email"
  placeholder="Email"
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    textAlign: "center"   // ✅ centers placeholder text
  }}
/>

        <input
          id="password"
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            textAlign: "center"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s"
          }}
        >
          Login
        </button>

      </div>
    </div>
  );
}