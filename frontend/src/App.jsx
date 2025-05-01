import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";
import getDesignTokens from "./theme/Theme";
import { ThemeProviderWrapper } from "./theme/ThemeProviderWrapper";
import { CssBaseline, createTheme } from "@mui/material";
import { LogedUserContextProvider } from "./context/LogedUserContext";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

export default function App() {
  // eslint-disable-next-line no-unused-vars
  const [mode, setMode] = useState("light");

  // Create theme based on the mode
  const theme = createTheme(getDesignTokens(mode));

  return (
    <LogedUserContextProvider>
    <ThemeProviderWrapper theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home theme={theme}/>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login theme={theme}/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProviderWrapper>
    </LogedUserContextProvider>
  );
}
