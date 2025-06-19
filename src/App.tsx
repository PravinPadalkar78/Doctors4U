import "./App.css";

import { Routes, Route, useLocation, Navigate } from "react-router";
import AppLayout from "./Components/AppLayout";
import ThemeProvider from "./Provider/ThemeProvider";
import DoctorDetailsProvider from "./Provider/DoctorDetailsProvider";
import Appointment from "./Pages/Appointment";
import PastAppointment from "./Pages/PastAppointment";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import { AuthProvider } from "./Provider/AuthProvider";
import { App as AntApp } from "antd";
function App() {
  const { pathname } = useLocation();

  return (
    <ThemeProvider>
      <AuthProvider>
        <AntApp>
          <DoctorDetailsProvider>
            {pathname === "/" ? <Navigate to="/login" replace /> : null}
            <Routes>
              <Route path="/doctor" element={<AppLayout />}>
                <Route path="appointment" element={<Appointment />} />
                <Route path="pastAppointment" element={<PastAppointment />} />
              </Route>
              <Route path="/nurse" element={<AppLayout />}>
                <Route path="appointment" element={<Appointment />} />
                <Route path="pastAppointment" element={<PastAppointment />} />
              </Route>
              <Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>
            </Routes>
          </DoctorDetailsProvider>
        </AntApp>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
