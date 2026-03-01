import React, { useState, useContext, createContext } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { DigitalIDProvider } from './contexts/DigitalIDContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminResidents from './pages/admin/Residents';
import AdminResidentProfile from './pages/admin/ResidentProfile';
import AdminEmployees from './pages/admin/Employees';
import AdminSpecialEmployees from './pages/admin/SpecialEmployees';
import AdminJobs from './pages/admin/Jobs';
import AdminRequests from './pages/admin/Requests';
import AdminDigitalID from './pages/admin/DigitalID';
import AdminNotifications from './pages/admin/Notifications';
import AdminReports from './pages/admin/Reports';

// Special Employee Pages
import SpecialEmployeeDashboard from './pages/special-employee/Dashboard';
import SpecialEmployeeResidents from './pages/special-employee/Residents';
import SpecialEmployeeEmployees from './pages/special-employee/Employees';
import SpecialEmployeeJobs from './pages/special-employee/Jobs';
import SpecialEmployeeRequests from './pages/special-employee/Requests';
import SpecialEmployeeDigitalID from './pages/special-employee/DigitalID';
import SpecialEmployeeNotifications from './pages/special-employee/Notifications';
import SpecialEmployeeReports from './pages/special-employee/Reports';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeNotifications from './pages/employee/Notifications';

// Resident Pages
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentRequests from './pages/resident/Requests';
import ResidentProfile from './pages/resident/Profile';
import ResidentDigitalID from './pages/resident/DigitalID';

import { Toaster } from 'sonner';

// ── Auth Context ───────────────────────────────────────────────────────────────
export const AuthContext = createContext({
  user: null as null | { id: string; name: string; email: string; role: string },
  login: (_email: string, _password: string, _role: string): boolean => false,
  logout: (): void => { },
  register: (_data: any): boolean => false,
});

function AuthGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// ── Router ────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  { path: '/', element: <Welcome /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  // Admin Routes
  { path: '/admin/dashboard', element: <AuthGuard allowedRoles={['admin']}><AdminDashboard /></AuthGuard> },
  { path: '/admin/residents', element: <AuthGuard allowedRoles={['admin']}><AdminResidents /></AuthGuard> },
  { path: '/admin/residents/:id', element: <AuthGuard allowedRoles={['admin']}><AdminResidentProfile /></AuthGuard> },
  { path: '/admin/employees', element: <AuthGuard allowedRoles={['admin']}><AdminEmployees /></AuthGuard> },
  { path: '/admin/special-employees', element: <AuthGuard allowedRoles={['admin']}><AdminSpecialEmployees /></AuthGuard> },
  { path: '/admin/jobs', element: <AuthGuard allowedRoles={['admin']}><AdminJobs /></AuthGuard> },
  { path: '/admin/requests', element: <AuthGuard allowedRoles={['admin']}><AdminRequests /></AuthGuard> },
  { path: '/admin/digital-id', element: <AuthGuard allowedRoles={['admin']}><AdminDigitalID /></AuthGuard> },
  { path: '/admin/notifications', element: <AuthGuard allowedRoles={['admin']}><AdminNotifications /></AuthGuard> },
  { path: '/admin/reports', element: <AuthGuard allowedRoles={['admin']}><AdminReports /></AuthGuard> },

  // Special Employee Routes
  { path: '/special-employee/dashboard', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeDashboard /></AuthGuard> },
  { path: '/special-employee/residents', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeResidents /></AuthGuard> },
  { path: '/special-employee/employees', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeEmployees /></AuthGuard> },
  { path: '/special-employee/jobs', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeJobs /></AuthGuard> },
  { path: '/special-employee/requests', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeRequests /></AuthGuard> },
  { path: '/special-employee/digital-id', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeDigitalID /></AuthGuard> },
  { path: '/special-employee/notifications', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeNotifications /></AuthGuard> },
  { path: '/special-employee/reports', element: <AuthGuard allowedRoles={['special-employee']}><SpecialEmployeeReports /></AuthGuard> },

  // Employee Routes
  { path: '/employee/dashboard', element: <AuthGuard allowedRoles={['employee']}><EmployeeDashboard /></AuthGuard> },
  { path: '/employee/notifications', element: <AuthGuard allowedRoles={['employee']}><EmployeeNotifications /></AuthGuard> },

  // Resident Routes
  { path: '/resident/dashboard', element: <AuthGuard allowedRoles={['resident']}><ResidentDashboard /></AuthGuard> },
  { path: '/resident/requests', element: <AuthGuard allowedRoles={['resident']}><ResidentRequests /></AuthGuard> },
  { path: '/resident/profile', element: <AuthGuard allowedRoles={['resident']}><ResidentProfile /></AuthGuard> },
  { path: '/resident/digital-id', element: <AuthGuard allowedRoles={['resident']}><ResidentDigitalID /></AuthGuard> },

  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState<null | { id: string; name: string; email: string; role: string }>(null);

  const login = (email: string, _password: string, role: string): boolean => {
    const nameMap: Record<string, string> = {
      admin: 'Obsan Habtamu',
      'special-employee': 'Samuel Tolasa',
      employee: 'Samuel Fayisa',
      resident: 'Samson Tadesse',
    };
    setUser({ id: '1', name: nameMap[role] ?? 'Samson Tadesse', email, role });
    return true;
  };

  const logout = () => setUser(null);

  const register = (data: any): boolean => {
    setUser({ id: '1', name: data.name, email: data.email, role: 'resident' });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      <LanguageProvider>
        <DigitalIDProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors />
          </NotificationProvider>
        </DigitalIDProvider>
      </LanguageProvider>
    </AuthContext.Provider>
  );
}

export default App;
