import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useState } from "react";

const init = () => {
  const token = localStorage.getItem("token");

  return {
    logged: !!token,
    user: token ? { token } : null,
  };
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userState, setUserState] = useState(init);
  //const userPre = init();

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("tokenExpiration", data.tokenExpiration);
    setUserState({
      logged: true,
      user: data,
      token: data.token,
      refreshToken: data.refreshToken,
      username: data.username,
      tokenExpiration: data.tokenExpiration,
    });
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    setUserState({
      logged: false,
      user: null,
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ ...userState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};