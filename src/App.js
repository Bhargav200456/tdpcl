import { useState } from "react";

import Student from "./Student";
import Teacher from "./Teacher";
import Login from "./Login";

function App() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  /* 🔐 SAVE USER AFTER LOGIN */
  const handleSetUser = (data) => {

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    setUser(data);
  };

  /* 🚪 LOGOUT */
  const handleLogout = () => {

    localStorage.removeItem("user");

    setUser(null);
  };

  /* 🔐 LOGIN SCREEN */
  if (!user) {

    return (
      <Login setUser={handleSetUser} />
    );
  }

  /* 👨‍🎓 STUDENT */
  if (user.role === "student") {

    return (
      <Student
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  /* 👨‍🏫 TEACHER */
  if (user.role === "teacher") {

    return (
      <Teacher
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div>
      Invalid user role
    </div>
  );
}

export default App;