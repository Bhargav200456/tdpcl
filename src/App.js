import { useState } from "react";
import Student from "./Student";
import Teacher from "./Teacher";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // 🔐 Save user after login
  const handleSetUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  // 🚪 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔐 If not logged in → show login
  if (!user) {
    return <Login setUser={handleSetUser} />;
  }

  // 👨‍🎓 Student view
  if (user.role === "student") {
    return <Student onLogout={handleLogout} user={user} />;
  }

  // 👨‍🏫 Teacher view
  if (user.role === "teacher") {
    return <Teacher onLogout={handleLogout} user={user} />;
  }

  return <div>Invalid user role</div>;
}

export default App;